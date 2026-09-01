import { useState } from "react";
import Button from "./Button";
import "../styles/Button.scss";
import {
  DIFFICULTIES,
  START_GAME_MESSAGES,
  DIFFICULTY_MESSAGES,
} from "../constants";
import "../styles/StartGame.scss";

export default function StartGame({ onStartGame, onBack }) {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [difficultyMessage, setDifficultyMessage] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z]/g, "");

    if (value.length <= 3) {
      setPlayerName(value);

      if (value.length < 3) {
        setDifficulty("");
        setDifficultyMessage("");
      }
    }
  };

  const handleDifficultyChange = (levelKey) => {
    setDifficulty(levelKey);

    const messages = DIFFICULTY_MESSAGES[levelKey];

    setDifficultyMessage(getRandomMessage(messages));
  };

  const handleStart = () => {
    if (playerName.length === 3 && difficulty) {
      onStartGame(playerName, difficulty);
    }
  };

  const isStartDisabled = playerName.length !== 3 || !difficulty;
  const isDifficultyDisabled = playerName.length !== 3;

  const getRandomMessage = (messages) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };
  const [startMessage] = useState(() => getRandomMessage(START_GAME_MESSAGES));

  return (
    <div className="start-game">
      <h1 className="start-game__title">{startMessage}</h1>
      <div className="start-game__board">
        <div className="start-game__player">
          <label htmlFor="playerName">ELIGE 3 LETRAS</label>

          <input
            id="playerName"
            className="start-game__input"
            type="text"
            value={playerName}
            onChange={handleInputChange}
            maxLength={3}
            autoFocus
          />
        </div>

        <div className="start-game__difficulty">
          <p className="start-game__difficulty-title">ELIGE NIVEL</p>

          <div className="start-game__difficulty-buttons">
            {Object.entries(DIFFICULTIES).map(([levelKey, level]) => (
              <Button
                key={levelKey}
                text={level.name}
                onClick={() => handleDifficultyChange(levelKey)}
                variant={
                  difficulty === levelKey
                    ? `${levelKey.toLowerCase()}-selected`
                    : playerName.length === 3 && !difficulty
                      ? levelKey.toLowerCase()
                      : `${levelKey.toLowerCase()}-disabled`
                }
                disabled={isDifficultyDisabled}
              />
            ))}
          </div>
        </div>
        <p className="start-game__difficulty-message">{difficultyMessage}</p>
        <Button
          text="AL TURRON"
          variant={isStartDisabled ? "disabled" : "primary"}
          onClick={handleStart}
          disabled={isStartDisabled}
        />
      </div>
      <Button text="HE CAMBIADO DE IDEA" onClick={onBack} variant="tertiary" />
    </div>
  );
}
