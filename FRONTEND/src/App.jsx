import "./App.scss";
import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Ranking from "./components/Ranking";
import MemoryBoard from "./components/MemoryBoard";
import { GAME_VIEWS, DIFFICULTIES } from "./constants";
import { rankingService } from "./services/rankingService";

export default function App() {
  const [view, setView] = useState(GAME_VIEWS.LANDING);
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [gameStats, setGameStats] = useState({ count: 0, time: 0 });
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const preloadRankings = async () => {
      try {
        await rankingService.syncPendingToBackend();
        const difficulties = Object.values(DIFFICULTIES);
        await Promise.all(
          difficulties.map((diff) => rankingService.getRanking(diff.name))
        );
        console.log("✅ Rankings precargados al arranque");
      } catch (error) {
        console.warn("⚠️ No se pudieron precargar rankings:", error);
      }
    };
    preloadRankings();
  }, []);

  const handleStartGame = (name, selectedDifficulty) => {
    setPlayerName(name);
    setDifficulty(selectedDifficulty);
    setStartTime(new Date().toISOString());
    setView(GAME_VIEWS.GAME);
  };

  const handleShowRanking = async (count, time, finishedDifficulty, gameStartTime) => {
    let difficultyToUse = finishedDifficulty || difficulty;

    if (typeof difficultyToUse === "string") {
      difficultyToUse = Object.values(DIFFICULTIES).find(
        (d) => d.name.toUpperCase() === difficultyToUse.toUpperCase(),
      );
    }

    if (difficultyToUse && difficultyToUse.name) {
      setGameStats({ count, time });
      setDifficulty(difficultyToUse);
    }

    setView(GAME_VIEWS.RANKING);
  };

  const handlePlayAgain = () => {
    setStartTime(new Date().toISOString());
    setGameKey((prev) => prev + 1);
    setView(GAME_VIEWS.GAME);
  };

  const handleBackToLanding = () => {
    setPlayerName("");
    setDifficulty(null);
    setStartTime(null);
    setView(GAME_VIEWS.LANDING);
  };

  return (
    <main>
      <h1>Memory Game</h1>

      {view === GAME_VIEWS.LANDING && (
        <LandingPage
          onStartGame={handleStartGame}
          onShowRanking={() => setView(GAME_VIEWS.RANKING)}
        />
      )}

      {view === GAME_VIEWS.GAME && difficulty && (
        <MemoryBoard
          key={`${difficulty.name}-${gameKey}`}
          difficulty={difficulty}
          onBackToLanding={handleBackToLanding}
          onShowRanking={handleShowRanking}
          playerName={playerName}
          startTime={startTime}
        />
      )}

      {view === GAME_VIEWS.RANKING && (
        <Ranking
          key={difficulty?.name}
          onBackToBoard={difficulty ? () => setView(GAME_VIEWS.GAME) : null}
          onBackToLanding={handleBackToLanding}
          handleReset={difficulty ? handlePlayAgain : undefined}
          currentPlayerName={playerName}
          currentMoves={gameStats.count}
          currentTime={gameStats.time}
          difficulty={difficulty}
        />
      )}
    </main>
  );
}
