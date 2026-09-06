import { useEffect, useState } from "react";
import "../styles/Ranking.scss";
import Button from "./Button";
import "../styles/Button.scss";
import { DIFFICULTIES } from "../constants";
import { rankingService } from "../services/rankingService";
const LEVEL_GROUPS = [
  [DIFFICULTIES.EASY.name, DIFFICULTIES.MEDIUM.name],
  [DIFFICULTIES.HARD.name, DIFFICULTIES.EXPERT.name],
];
export default function Ranking({
  onBackToBoard,
  handleReset,
  currentPlayerName,
  currentMoves,
  currentTime,
  difficulty,
  rankingMode,
  onShowGlobalRanking,
  onShowPlayerRanking,
  onBackToLanding,
}) {
  const [rankingData, setRankingData] = useState({});
  const [rankingPage, setRankingPage] = useState(0);

  const [selectedLevel, setSelectedLevel] = useState(
    difficulty?.name || DIFFICULTIES.EASY.name,
  );

  useEffect(() => {
    const loadRankings = async () => {
      try {
        const difficulties = Object.values(DIFFICULTIES);

        const results = await Promise.all(
          difficulties.map((diff) => rankingService.getRanking(diff.name)),
        );

        const data = {};

        difficulties.forEach((diff, index) => {
          data[diff.name] = results[index];
        });

        setRankingData(data);
      } catch (error) {
        console.error("Error cargando rankings:", error);
      }
    };

    loadRankings();
  }, [difficulty]);
  useEffect(() => {
    if (difficulty?.name) {
      setSelectedLevel(difficulty.name);

      const page = LEVEL_GROUPS.findIndex((group) =>
        group.includes(difficulty.name),
      );

      setRankingPage(page >= 0 ? page : 0);
    }
  }, [difficulty]);
  const formatTime = (seconds) => {
    const totalSeconds = Number(seconds);

    if (!Number.isFinite(totalSeconds)) return "--:--";

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getSortedRanking = (levelName) => {
    return [...(rankingData[levelName] || [])]
      .sort((a, b) => a.moves - b.moves || a.time - b.time)
      .slice(0, 10);
  };

  const renderTable = (levelName) => {
    const ranking = getSortedRanking(levelName);

    return (
      <section className="ranking__level" key={levelName}>
        <h3 className="ranking__level-title">{levelName}</h3>

        <table className="ranking__table">
          <thead>
            <tr>
              <th></th>
              <th>JUGADOR</th>
              <th>MOVIMIENTOS</th>
              <th>TIEMPO</th>
            </tr>
          </thead>

          <tbody>
            {ranking.length > 0 ? (
              ranking.map((player, index) => (
                <tr key={`${player.name}-${player.startTime}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.moves}</td>
                  <td>{formatTime(player.time)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">SIN PARTIDAS</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    );
  };

  const isPlayerRanking = rankingMode === "PLAYER";

  return (
    <section className={`ranking ranking--${rankingMode.toLowerCase()}`}>
      <header className="ranking__header">
        <h2 className="ranking__title">CLASIFICACION</h2>
      </header>

      {isPlayerRanking && (
        <section className="ranking__current">
          <p className="ranking__current-title">TU ÚLTIMA PARTIDA</p>

          <p className="ranking__current-player">{currentPlayerName}</p>

          <div className="ranking__current-stats">
            <span>{currentMoves} MOVIMIENTOS</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </section>
      )}

      {!isPlayerRanking && (
        <nav className="ranking__tabs" aria-label="Seleccionar nivel">
          {rankingPage === 1 && (
            <button
              type="button"
              className="ranking__arrow ranking__arrow-left"
              onClick={() => {
                setRankingPage(0);
                setSelectedLevel(DIFFICULTIES.EASY.name);
              }}
              aria-label="Ver niveles anteriores">
              <p className="">⬅</p>
            </button>
          )}

          {LEVEL_GROUPS[rankingPage].map((level) => (
            <button
              key={level}
              type="button"
              className={`ranking__tab ${
                selectedLevel === level ? "ranking__tab--active" : ""
              }`}
              onClick={() => setSelectedLevel(level)}>
              {level}
            </button>
          ))}
          {rankingPage === 0 && (
            <button
              type="button"
              className="ranking__arrow ranking__arrow-right"
              onClick={() => {
                setRankingPage(1);
                setSelectedLevel(DIFFICULTIES.HARD.name);
              }}
              aria-label="Ver más niveles">
              <p className="">➡</p>
            </button>
          )}
        </nav>
      )}
      <section className="ranking__content">
        {isPlayerRanking
          ? renderTable(difficulty?.name)
          : renderTable(selectedLevel)}
      </section>

      <nav className="ranking__actions">
        {isPlayerRanking && (
          <Button
            text="VER TODO EL RANKING"
            onClick={onShowGlobalRanking}
            variant="secondary"
          />
        )}

        {!isPlayerRanking && difficulty && currentPlayerName && (
          <Button
            text="VER MI RANKING"
            onClick={onShowPlayerRanking}
            variant="secondary"
          />
        )}

        {handleReset && (
          <Button text="¿OTRA RONDA?" onClick={handleReset} variant="primary" />
        )}

        {isPlayerRanking && (
          <Button
            text="VOLVER AL TABLERO"
            onClick={onBackToBoard}
            variant="tertiary"
          />
        )}

        {!isPlayerRanking && !difficulty && (
          <Button
            text="SALIR DE AQUI"
            variant="tertiary"
            onClick={onBackToLanding}
          />
        )}
      </nav>
    </section>
  );
}
