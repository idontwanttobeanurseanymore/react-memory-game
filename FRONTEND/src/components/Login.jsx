import Button from "./Button";
import "../styles/Login.scss";

export default function Login({ onBack, post, text }) {
  return (
    <div className="login">
      <main className="login__main">
        <h1 className="login__title">Iniciar Sesion</h1>
        <p className="login__subtitle">PROXIMAMENTE</p>
        <section className="login__message">
          <p>
            Inicia sesión, guarda tus puntuaciones y comprueba si te han quitado
            el puesto.
          </p>
          <p>Tu memoria puede fallar, pero tus records siempre estarán aquí.</p>
        </section>
        <section className="login__social-message">
          <p>¿Tienes ganas?</p>
          <p>
            <a
              className="login__social-link"
              href={post}
              target="_blank"
              rel="noreferrer">
              Dime que me de prisa
            </a>
          </p>
        </section>
        <Button text="NO, GRACIAS" onClick={onBack} variant="tertiary" />
      </main>
    </div>
  );
}
