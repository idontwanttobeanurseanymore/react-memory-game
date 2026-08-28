import { useState } from "react";
import Button from "./Button";
import "../styles/LandingPage.scss";
import "../styles/Button.scss";

export default function LandingPage({ onStartGame, onShowRanking }) {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleInstructions = () => {
    setShowInstructions((prev) => !prev);
  };

  const handleStart = () => {
    onStartGame();
  };

  return (
    <div className="landing-page">
      <header className="landing-page__header">
        <div className="landing-page__top">
          <img
            className="landing-page__logo"
            src="/images/logo-mala-memoria.png"
            alt="Mala Memoria"
          />

          <nav className="landing-page__navigation">
            <ul className="landing-page__navigation-list">
              <li className="landing-page__navigation-item">
                <a href="#contacto">Contacto</a>
              </li>

              <li className="landing-page__navigation-item">
                <a href="/registro"> Mi usuario</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="landing-page__main">
        <h1 className="landing-page__title">MALA MEMORIA</h1>

        <p className="landing-page__subtitle">A ver cuánto recuerdas</p>

        <div className="landing-page__game-flow">
          <div
            className={`landing-page__instructions-container ${
              showInstructions ? "is-open" : ""
            }`}>
            <button
              className="landing-page__instructions-button"
              onClick={handleInstructions}>
              ¿COMO JUGAR?
            </button>

            {showInstructions && (
              <section className="landing-page__instructions">
                <p>Busca las parejas y no tardes</p>
                <p>A VER QUE TAL SE TE DA</p>
              </section>
            )}
          </div>

          <Button text="EMPEZAR" variant="primary" onClick={handleStart} />
        </div>

        <a
          className="landing-page__ranking"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            onShowRanking();
          }}>
          <h2 className="ranking-cta__title"> Mira quién te ha ganado </h2>
        </a>
      </main>
    </div>
  );
}
