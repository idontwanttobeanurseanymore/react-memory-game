import Button from "./Button";
import "../styles/Login.scss";

export default function Login({ onBack, post }) {
  return (
    <div className="login">
      <main className="login__main">
        <h1 className="login__title">Mi Usuario</h1>
        <p className="login__subtitle">PROXIMAMENTE</p>
        <p className="login__message">
          Inicia sesión, guarda tus puntuaciones y comprueba si ya te han
          quitado el puesto. Tu memoria puede fallar, pero tus records siempre
          estarán aquí.
        </p>
        <p className="login__social-message">
          Dime en{" "}
          <a
            className="login__social-link"
            href={post}
            target="_blank"
            rel="noreferrer">
            esta publicación
          </a>{" "}
          si quieres que me dé prisa en dejarte iniciar sesión.
        </p>
        <Button text="VOLVER" className="start-game__back" onClick={onBack} />
      </main>
    </div>
  );
}
