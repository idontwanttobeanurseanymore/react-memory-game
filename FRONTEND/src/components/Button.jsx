import "../styles/Button.scss";

export default function Button({ text, onClick, variant, disabled = false }) {
  return (
    <button
      className={`button button--${variant}`}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </button>
  );
}
