import "../styles/Message.scss";

export default function Message({ result, time, timeout, count, points }) {
  if (timeout) return <p className="result">Time's up! Try again!</p>;
  if (!result) return;
  let textMessage;
  if (time < 60) {
    textMessage = "In less than a minute!";
  } else if (time >= 60) {
    textMessage = "Well done!";
  }
  return <p className="result">{textMessage}</p>;
}
