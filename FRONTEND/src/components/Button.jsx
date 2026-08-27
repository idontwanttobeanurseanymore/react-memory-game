import "../styles/Button.scss";

export default function Button({ text, onClick, variant }) {
  return (
    <button
      className={`button button--${variant}`}
      type="button"
      onClick={onClick}>
      {text}
    </button>
  );
}
