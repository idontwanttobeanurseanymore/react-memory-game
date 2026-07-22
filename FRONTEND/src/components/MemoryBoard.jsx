import { useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import Message from "./Message";
import Counter from "./Counter";
import { useMemoryGame } from "../hooks/useMemoryGame";
import { DIFFICULTIES } from "../constants";

export default function MemoryBoard({ difficulty, onBackToLanding, onShowRanking, playerName, startTime }) {
  const difficultyConfig = typeof difficulty === 'string' ? DIFFICULTIES[difficulty] : difficulty;
  const gridClass = difficultyConfig ? `grid-${difficultyConfig.grid}` : '';

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
    selectCard
  } = useMemoryGame(difficulty);

  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <>
      <Counter count={count} points={points} time={elapsedTime} />
      <div className={`table ${gridClass}`} role="grid" aria-label="Memory Game Board">
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
      
      <div className="navContainer">
        <Button onBtnClick={onBackToLanding} text="GO BACK" btnName="backToLandingBtn" className="btn--nav" />
      </div>

      {timeout && (
        <div className="resultSection">
          <Message timeout={timeout} />
          <div className="resultButtons">
            <Button onBtnClick={handleReset} text="PLAY AGAIN" btnName="resetBtn" />
            <Button onBtnClick={onBackToLanding} text="CHOOSE LEVEL" btnName="chooseLevelTimeoutBtn" />
          </div>
        </div>
      )}

      {result && (
        <div className="resultSection">
          <Message result={result} count={count} points={points} time={elapsedTime}/>
          <div className="resultButtons">
            <Button onBtnClick={handleReset} text="PLAY AGAIN" btnName="resetBtn" />
            <Button onBtnClick={() => onShowRanking(count, elapsedTime, difficulty, startTime)} text="SHOW MY RANKING" btnName="rankingBtn" />
          </div>
        </div>
      )}
    </>
  );
}
