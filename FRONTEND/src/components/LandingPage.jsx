import { useState } from "react";
import Button from "./Button";
import "../styles/LandingPage.scss";
import "../styles/Button.scss";

export default function LandingPage({ onStartGame, onShowRanking, onLogin }) {
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
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onLogin();
                }}>
                Iniciar Sesión
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="landing-page__main">
        <h1 className="landing-page__title">MALA MEMORIA</h1>

        <p className="landing-page__subtitle">A ver cuánto recuerdas</p>

        <div className="landing-page__game-flow">
          <div
            className={`landing-page__instructions-container ${
              showInstructions ? "is-open" : ""
            }`}>
            <div className="landing-page__instructions-button">
              <span>¿</span>
              <button onClick={handleInstructions}>COMO JUGAR</button>
              <span>?</span>
            </div>
            {showInstructions && (
              <section className="landing-page__instructions">
                <p>Busca las parejas, no tardes</p>
                <p>y ya veremos qué tal se te da</p>
              </section>
            )}
          </div>

          <Button text="EMPEZAR" variant="primary" onClick={onStartGame} />
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
