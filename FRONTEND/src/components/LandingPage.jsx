import { useState } from "react";
import Button from "./Button";
import "../styles/LandingPage.scss";

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
                <a href="/registro">Iniciar sesión</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="landing-page__main">
        <h1 className="landing-page__title">MALA MEMORIA</h1>

        <p className="landing-page__subtitle">A ver cuánto recuerdas.</p>

        <div className="landing-page__game-flow">
          <div
            className={`landing-page__instructions-container ${
              showInstructions ? "is-open" : ""
            }`}>
            <button
              className="landing-page__instructions-button"
              onClick={handleInstructions}>
              ¿CÓMO JUGAR?
            </button>

            {showInstructions && (
              <section className="landing-page__instructions">
                <p>Encuentra todas las parejas.</p>
                <p>Recuerda dónde está cada carta.</p>
                <p>Consigue hacerlo en el menor tiempo posible.</p>
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
          MIRA QUIÉN TE HA GANADO
        </a>
      </main>
    </div>
  );
}
