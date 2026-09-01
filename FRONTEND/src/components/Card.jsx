import "../styles/Card.scss";

export default function Card({
  id,
  value,
  onCardClick,
  isFlipped,
  isMatched,
  isResetting,
}) {
  const isVisible = (isFlipped || isMatched) && !isResetting;

  return (
    <div
      className={`card ${isVisible ? "card--visible" : ""} ${
        isMatched && !isResetting ? "card--matched" : ""
      }`}
      onClick={() => {
        if (isResetting || isVisible) return;
        onCardClick({ id, value });
      }}
      role="gridcell"
      tabIndex={0}
      aria-label={
        isMatched && !isResetting
          ? `Carta ${id}: pareja encontrada ${value}`
          : isVisible
            ? `Carta ${id}: ${value}`
            : `Carta ${id}: oculta`
      }
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          if (isResetting || isVisible) return;
          onCardClick({ id, value });
        }
      }}>
      <span className="card__front">
        <img
          className="card__front-image"
          src="/tarjeta-mala-memoria.png"
          alt=""
        />
      </span>
      <span className="card__back">{value}</span>
    </div>
  );
}
