import "../styles/Counter.scss";

export default function Counter({ count, points, time }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="counter">
      <div className="counter__item">
        <span className="counter__label">MOVIMIENTOS</span>
        <span className="counter__value">{count}</span>
      </div>

      <div className="counter__item">
        <span className="counter__label">TIEMPO</span>
        <span className="counter__value">{formatTime(time)}</span>
      </div>
    </div>
  );
}
