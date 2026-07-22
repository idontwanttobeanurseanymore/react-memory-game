export const DIFFICULTIES = {
  /* 
    PLAN FUTURO:
    Para añadir niveles que no quepan en pantalla:
    1. Añadir propiedad `minWidth` (ej: 800px) a cada nivel.
    2. En MemoryBoard.jsx, añadir check:
       if (window.innerWidth < difficulty.minWidth) { mostrar aviso }
  */
  EASY: {
    name: "Easy",
    cards: ["👽​​​", "🧟‍♀️", "👩🏻‍🚀", "🧑🏻‍💻", "🥷🏻​​", "🐒", "🦚", "🦭​"],
    grid: "4x4",
  },
  MEDIUM: {
    name: "Medium",
    cards: ["🌻", "🌵", "🌴", "🌱", "🌿", "🍀", "🎍", "🎋", "👩‍🏫", "☀️", "🌝", "🌞"],
    grid: "4x4",
  },
  HARD: {
    name: "Hard",
    cards: ["👨‍🍳", "👨‍🏫", "👨‍💻", "👨‍🔬", "👨‍🎨", "👨‍🚀", "👨‍✈️", "👨‍🚒", "👩‍🍳", "👩‍🏫", "👩‍💻", "👩‍🔬", "👩‍🎨", "👩‍🚀", "👩‍✈️", "👩‍🚒", "👷", "👮"],
    grid: "6x6",
  },
  EXPERT: {
    name: "Expert",
    cards: ["🔵", "🔷", "🟦", "🧊", "🔹", "💧", "🧢", "🚙", "🛰️", "💎", "💙", "🧞", "🐳", "🌌", "👔", "🦕", "🪁", "👮"],
    grid: "6x6",
  },
};

export const getBoardConfig = (difficulty) => {
  let config = DIFFICULTIES[difficulty];
  if (!config && typeof difficulty === "object" && difficulty !== null) {
    config = difficulty;
  }
  if (!config) return null;
  const size = config.grid.split('x').reduce((a, b) => parseInt(a) * parseInt(b), 1);
  return {
    size: size,
    cards: config.cards.slice(0, size / 2)
  };
};

export const GAME_VIEWS = {
  LANDING: "landing",
  GAME: "game",
  RANKING: "ranking",
};

export const RESET_ANIMATION_DURATION = 600;
export const MATCH_DELAY = 1000;
export const STORAGE_KEY = 'memory_game_ranking';
