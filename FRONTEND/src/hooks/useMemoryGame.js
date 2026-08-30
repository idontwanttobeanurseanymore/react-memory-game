import { useEffect, useCallback, useReducer, useMemo } from "react";
import {
  RESET_ANIMATION_DURATION,
  MATCH_DELAY,
  getBoardConfig,
} from "../constants";

const initialState = {
  cards: [],
  backCard: [],
  matchedCards: [],
  count: 0,
  points: 0,
  result: false,
  isResetting: false,
  elapsedTime: 0,
  timeout: false,
  gameStarted: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "RESET_START":
      return {
        ...state,
        isResetting: true,
        backCard: [],
        matchedCards: [],
        result: false,
        elapsedTime: 0,
        timeout: false,
        gameStarted: true,
      };
    case "RESET_COMPLETE":
      return {
        ...state,
        cards: action.cards,
        count: 0,
        points: 0,
        isResetting: false,
      };
    case "START_GAME":
      return { ...state, gameStarted: true };
    case "FLIP_CARD":
      if (
        state.isResetting ||
        state.backCard.find((c) => c.id === action.card.id) ||
        state.backCard.length >= 2
      )
        return state;
      return { ...state, backCard: [...state.backCard, action.card] };
    case "INCREMENT_COUNT":
      return { ...state, count: state.count + 1 };
    case "MATCH_CARDS":
      return {
        ...state,
        matchedCards: [...state.matchedCards, ...action.cards],
        points: state.points + 1,
        backCard: [],
      };
    case "CLEAR_BACK_CARD":
      return { ...state, backCard: [] };
    case "SET_RESULT":
      return { ...state, result: true };
    case "TICK":
      if (state.elapsedTime >= 119) {
        return {
          ...state,
          elapsedTime: 120,
          timeout: true,
        };
      }

      return {
        ...state,
        elapsedTime: state.elapsedTime + 1,
      };
    case "SET_TIMEOUT":
      return { ...state, timeout: true };
    default:
      return state;
  }
}

export const useMemoryGame = (difficultyKey) => {
  const boardConfig = useMemo(
    () => getBoardConfig(difficultyKey),
    [difficultyKey],
  );
  const cardArray = useMemo(
    () => (boardConfig ? [...boardConfig.cards, ...boardConfig.cards] : []),
    [boardConfig],
  );

  const shuffleCards = useCallback(() => {
    const cardArrayObj = cardArray.map((value, index) => ({
      id: index,
      value,
    }));

    for (let i = cardArrayObj.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardArrayObj[i], cardArrayObj[j]] = [cardArrayObj[j], cardArrayObj[i]];
    }

    return cardArrayObj;
  }, [cardArray]);

  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    cards: shuffleCards(),
  });

  useEffect(() => {
    let timer;
    // Start timer if game is started, active, not resetting, not finished, and not timed out
    if (
      state.gameStarted &&
      state.matchedCards.length < cardArray.length &&
      !state.isResetting &&
      !state.result &&
      !state.timeout
    ) {
      timer = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [
    state.gameStarted,
    state.matchedCards.length,
    state.isResetting,
    state.result,
    state.timeout,
    state.elapsedTime,
    cardArray.length,
  ]);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_START" });

    setTimeout(() => {
      dispatch({ type: "RESET_COMPLETE", cards: shuffleCards() });
    }, RESET_ANIMATION_DURATION);
  }, [shuffleCards]);

  useEffect(() => {
    if (state.backCard.length === 2) {
      dispatch({ type: "INCREMENT_COUNT" });
      const timer = setTimeout(() => {
        if (state.backCard[0].value === state.backCard[1].value) {
          dispatch({
            type: "MATCH_CARDS",
            cards: [state.backCard[0], state.backCard[1]],
          });
        } else {
          dispatch({ type: "CLEAR_BACK_CARD" });
        }
      }, MATCH_DELAY);
      return () => clearTimeout(timer);
    }
  }, [state.backCard]);

  useEffect(() => {
    if (
      state.matchedCards.length === cardArray.length &&
      cardArray.length > 0
    ) {
      dispatch({ type: "SET_RESULT" });
    }
  }, [state.matchedCards, cardArray.length]);

  const selectCard = (cardData) => {
    if (state.timeout || state.result) return;
    dispatch({ type: "FLIP_CARD", card: cardData });
  };

  return {
    cards: state.cards,
    backCard: state.backCard,
    matchedCards: state.matchedCards,
    count: state.count,
    points: state.points,
    result: state.result,
    isResetting: state.isResetting,
    elapsedTime: state.elapsedTime,
    timeout: state.timeout,
    gameStarted: state.gameStarted,
    handleReset,
    startGame,
    selectCard,
  };
};
