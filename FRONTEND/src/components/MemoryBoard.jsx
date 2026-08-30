import { useEffect, useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Message from "./Message";
import Counter from "./Counter";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { DIFFICULTIES } from "../constants";
import { rankingService } from "../services/rankingService";
import "../styles/MemoryBoard.scss";

export default function MemoryBoard({
  difficulty,
  onBackToLanding,
  onBackToStartGame,
  onShowRanking,
  playerName,
  startTime,
}) {
  const difficultyConfig =
    typeof difficulty === "string" ? DIFFICULTIES[difficulty] : difficulty;
  const [hasSaved, setHasSaved] = useState(false);
  const [currentStartTime, setCurrentStartTime] = useState(
    startTime || new Date().toISOString(),
  );

  useEffect(() => {
    if (startTime) {
      setCurrentStartTime(startTime);
    }
  }, [startTime]);

  const {
    cards,
    backCard,
    matchedCards,
    count,
    points,
    result,
    isResetting,
    elapsedTime,
    timeout,
    gameStarted,
    handleReset,
    startGame,
    selectCard,
  } = useMemoryGame(difficulty);

  const handlePlayAgain = () => {
    setHasSaved(false);
    setCurrentStartTime(new Date().toISOString());
    handleReset();
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (result && difficultyConfig && !hasSaved) {
      setHasSaved(true);
      const gamePairs = difficultyConfig.cards
        ? difficultyConfig.cards.length
        : 8;
      rankingService.saveRanking(
        difficultyConfig.name,
        playerName || "Anonymous",
        count,
        elapsedTime,
        currentStartTime,
        gamePairs,
      );
    }
  }, [
    result,
    difficultyConfig,
    hasSaved,
    playerName,
    count,
    elapsedTime,
    currentStartTime,
  ]);

  const MIN_CARD_SIZE = 52;
  const GRID_GAP = 4;
  const BOARD_PADDING = 16;

  const getColumns = (cardCount) => {
    const availableWidth = Math.min(window.innerWidth - BOARD_PADDING * 2, 420);

    const maxColumns = Math.floor(
      (availableWidth + GRID_GAP) / (MIN_CARD_SIZE + GRID_GAP),
    );

    for (let columns = maxColumns; columns >= 1; columns--) {
      if (cardCount % columns === 0) {
        return columns;
      }
    }

    return 1;
  };

  const columns = getColumns(cards.length);
  return (
    <div className="memory-board">
      <div className="memory-board__counter">
        <Counter count={count} points={points} time={elapsedTime} />
      </div>

      <div
        className="memory-board__table"
        style={{ "--columns": columns }}
        role="grid"
        aria-label="Tablero de memoria">
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            value={card.value}
            onCardClick={selectCard}
            isFlipped={backCard.some((c) => c.id === card.id)}
            isMatched={matchedCards.some((c) => c.id === card.id)}
            isResetting={isResetting}
          />
        ))}
      </div>

      <div className="memory-board__footer">
        <div className="memory-board__message">
          {timeout && <Message timeout={timeout} />}

          {result && (
            <Message
              result={result}
              count={count}
              points={points}
              time={elapsedTime}
            />
          )}
        </div>

        <div className="memory-board__actions">
          {timeout && (
            <>
              <Button
                onClick={handlePlayAgain}
                text="¿Otra ronda?"
                variant="primary"
              />
            </>
          )}

          {result && (
            <>
              <Button
                onClick={handlePlayAgain}
                text="¿Echamos otra?"
                variant="primary"
              />

              <Button
                onClick={() =>
                  onShowRanking(
                    count,
                    elapsedTime,
                    difficulty,
                    currentStartTime,
                  )
                }
                text="VER MI RANKING"
                variant="secondary"
              />
            </>
          )}
        </div>

        <div className="memory-board__navigation">
          <Button
            text="VOLVER"
            onClick={onBackToStartGame}
            variant="tertiary"
          />
        </div>
      </div>
    </div>
  );
}
