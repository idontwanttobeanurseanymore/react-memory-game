import "../styles/Message.scss";
import { RESULT_MESSAGES } from "../constants";

const getRandomMessage = (messages) => {
  return messages[Math.floor(Math.random() * messages.length)];
};

export default function Message({ result, time, timeout }) {
  if (timeout) {
    return <p className="result">{getRandomMessage(RESULT_MESSAGES.BAD)}</p>;
  }

  if (!result) return null;

  let messageType;

  if (time < 40) {
    messageType = "SPEED";
  } else if (time <= 60) {
    messageType = "PAIRS";
  } else {
    messageType = "MEMORY";
  }

  return (
    <p className="result">{getRandomMessage(RESULT_MESSAGES[messageType])}</p>
  );
}
