import { useEffect, useState } from "react";
import "../styles/Ranking.scss";
import Button from "./Button";
import { DIFFICULTIES } from "../constants";
import { rankingService } from "../services/rankingService";

export default function Ranking({
  onBackToBoard,
  handleReset,
  onBackToLanding,
  currentPlayerName,
  currentMoves,
  currentTime,
  difficulty,
}) {
  const [rankingData, setRankingData] = useState({});
  const MODES = {
    GLOBAL: "GLOBAL",
    PLAYER: "PLAYER",
  };

  const determineMode = (diff) => (diff ? MODES.PLAYER : MODES.GLOBAL);

  const [rankingMode, setRankingMode] = useState(determineMode(difficulty));

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
  }, [difficulty?.name]);

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
      .slice(0, 5);
  };

  const renderTable = (levelName) => {
    const sortedRanking = getSortedRanking(levelName);
    return (
      <div key={levelName} className="table-container">
        <h3>{levelName}</h3>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Moves</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedRanking.length > 0 ? (
              sortedRanking.map((player, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.moves}</td>
                  <td>{formatTime(player.time)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No records.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderActions = () => {
    switch (rankingMode) {
      case MODES.PLAYER:
        return (
          <div className="actions">
            <Button
              onBtnClick={() => setRankingMode(MODES.GLOBAL)}
              text="SHOW ALL"
              btnName="viewAllBtn"
            />
            {handleReset && (
              <Button
                onBtnClick={handleReset}
                text="PLAY AGAIN"
                btnName="backBtn"
              />
            )}
            <Button
              onBtnClick={onBackToLanding}
              text="CHOOSE LEVEL"
              btnName="goBackBtn"
              className="btn--go-back"
            />
          </div>
        );
      case MODES.GLOBAL:
        return (
          <div className="actions">
            {difficulty && (
              <Button
                onBtnClick={() => setRankingMode(MODES.PLAYER)}
                text="SHOW MY RANKING"
                btnName="viewAllBtn"
              />
            )}
            {handleReset && (
              <Button
                onBtnClick={handleReset}
                text="PLAY AGAIN"
                btnName="playAgainGlobalBtn"
              />
            )}
            <Button
              onBtnClick={onBackToLanding}
              text="CHOOSE LEVEL"
              btnName="goBackBtn"
              className="btn--go-back"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className={`ranking ranking--${rankingMode.toLowerCase()}`}>
      <h2>Top Players</h2>

      {rankingMode === MODES.PLAYER && (
        <div className="current-stats">
          <p>Your last game ({currentPlayerName}):</p>
          <p>
            <strong>{currentMoves} moves</strong> in{" "}
            <strong>{formatTime(currentTime)}</strong>
          </p>
        </div>
      )}

      {rankingMode === MODES.GLOBAL ? (
        <div className="all-rankings-grid">
          {Object.values(DIFFICULTIES).map((diff) => renderTable(diff.name))}
        </div>
      ) : (
        renderTable(difficulty?.name)
      )}

      {renderActions()}
    </section>
  );
}
