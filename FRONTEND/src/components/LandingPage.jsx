import { useState } from "react";
import Button from "./Button";
import { DIFFICULTIES } from "../constants";
import "../styles/LandingPage.scss";

export default function LandingPage({ onStartGame, onShowRanking }) {
  const [playerName, setPlayerName] = useState("");

  const handleInputChange = (ev) => {
    const value = ev.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    if (value.length <= 3) {
      setPlayerName(value);
    }
  };

  const isButtonDisabled = playerName.length !== 3;

  const renderRetroInput = () => {
    const letters = playerName.split("");
    const placeholders = ["_", "_", "_"];
    return (
      <div className="retroInputContainer">
        <label htmlFor="playerNameInput" className="playerLabel">
          Player:
        </label>
        <div className="lettersContainer">
          {placeholders.map((_, index) => (
            <span key={index} className="retroLetter">
              {letters[index] || ""}
            </span>
          ))}
        </div>
        <input
          id="playerNameInput"
          type="text"
          value={playerName}
          onChange={handleInputChange}
          className="hiddenInput"
          maxLength={3}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div className="landingPage">
      <p className="introQ">can you make into the top 5?</p>
      {renderRetroInput()}
      <div className="difficultyButtons">
        <div className="buttonContainer">
          {Object.keys(DIFFICULTIES).map((levelKey) => (
            <Button
              key={levelKey}
              text={DIFFICULTIES[levelKey].name}
              btnName={`startBtn-${levelKey}`}
              onBtnClick={() => onStartGame(playerName, levelKey)}
              disabled={isButtonDisabled}
              className={`btn--${levelKey.toLowerCase()}`}
            />
          ))}
        </div>
        <Button
          text="LEADERBOARD"
          btnName="leaderboardBtn"
          onBtnClick={onShowRanking}
          className="btn--ranking"
        />
      </div>
    </div>
  );
}
