import "./App.scss";
import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Ranking from "./components/Ranking";
import MemoryBoard from "./components/MemoryBoard";
import { GAME_VIEWS, DIFFICULTIES } from "./constants";
import { rankingService } from "./services/rankingService";
import Footer from "./components/Footer";
import StartGame from "./components/StartGame";
import Login from "./components/Login";

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
          difficulties.map((diff) => rankingService.getRanking(diff.name)),
        );
        console.log("✅ Rankings precargados al arranque");
      } catch (error) {
        console.warn("⚠️ No se pudieron precargar rankings:", error);
      }
    };
    preloadRankings();
  }, []);

  const handleStart = () => {
    setView(GAME_VIEWS.START_GAME);
  };

  const handleStartGame = (name, selectedDifficulty) => {
    setPlayerName(name);
    setDifficulty(selectedDifficulty);
    setStartTime(new Date().toISOString());
    setView(GAME_VIEWS.GAME);
  };

  const handleShowRanking = async (
    count,
    time,
    finishedDifficulty,
    gameStartTime,
  ) => {
    let difficultyToUse = finishedDifficulty || difficulty;

    if (typeof difficultyToUse === "object" && difficultyToUse !== null) {
      const match = Object.entries(DIFFICULTIES).find(
        ([key, d]) =>
          d.name.toUpperCase() === difficultyToUse.name?.toUpperCase(),
      );
      if (match) difficultyToUse = match[0];
    } else if (typeof difficultyToUse === "string") {
      const match = Object.entries(DIFFICULTIES).find(
        ([key, d]) =>
          key.toUpperCase() === difficultyToUse.toUpperCase() ||
          d.name.toUpperCase() === difficultyToUse.toUpperCase(),
      );
      if (match) difficultyToUse = match[0];
    }

    if (difficultyToUse) {
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

  const currentDifficultyObj =
    typeof difficulty === "string" ? DIFFICULTIES[difficulty] : difficulty;

  return (
    <main>
      {view === GAME_VIEWS.LANDING && (
        <LandingPage
          onStartGame={handleStart}
          onShowRanking={() => setView(GAME_VIEWS.RANKING)}
          onLogin={() => setView(GAME_VIEWS.LOGIN)}
        />
      )}
      {view === GAME_VIEWS.START_GAME && (
        <StartGame
          onStartGame={handleStartGame}
          onBack={() => setView(GAME_VIEWS.LANDING)}
        />
      )}
      {view === GAME_VIEWS.LOGIN && (
        <Login
          onBack={handleBackToLanding}
          post="https://www.linkedin.com/posts/martaao_memory-game-share-7487443531561693184-VYLJ/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAET7VwkBswdxjt-_GwV3T-W6HPhePGuNrjM"
        />
      )}
      {view === GAME_VIEWS.GAME && difficulty && (
        <MemoryBoard
          key={`${typeof difficulty === "string" ? difficulty : difficulty?.name}-${gameKey}`}
          difficulty={difficulty}
          onBackToLanding={handleBackToLanding}
          onShowRanking={handleShowRanking}
          playerName={playerName}
          startTime={startTime}
        />
      )}

      {view === GAME_VIEWS.RANKING && (
        <Ranking
          key={currentDifficultyObj?.name}
          onBackToBoard={difficulty ? () => setView(GAME_VIEWS.GAME) : null}
          onBackToLanding={handleBackToLanding}
          handleReset={difficulty ? handlePlayAgain : undefined}
          currentPlayerName={playerName}
          currentMoves={gameStats.count}
          currentTime={gameStats.time}
          difficulty={currentDifficultyObj}
        />
      )}
      <Footer
        name="martamao"
        github="https://github.com/martamao"
        linkedin="https://www.linkedin.com/in/martaao/"
        post="https://www.linkedin.com/posts/martaao_memory-game-share-7487443531561693184-VYLJ/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAET7VwkBswdxjt-_GwV3T-W6HPhePGuNrjM"
      />
    </main>
  );
}
