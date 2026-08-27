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
    cards: [
      "🌻",
      "🌵",
      "🌴",
      "🌱",
      "🌿",
      "🍀",
      "🎍",
      "🎋",
      "👩‍🏫",
      "☀️",
      "🌝",
      "🌞",
    ],
    grid: "4x4",
  },
  HARD: {
    name: "Hard",
    cards: [
      "👨‍🍳",
      "👨‍🏫",
      "👨‍💻",
      "👨‍🔬",
      "👨‍🎨",
      "👨‍🚀",
      "👨‍✈️",
      "👨‍🚒",
      "👩‍🍳",
      "👩‍🏫",
      "👩‍💻",
      "👩‍🔬",
      "👩‍🎨",
      "👩‍🚀",
      "👩‍✈️",
      "👩‍🚒",
      "👷",
      "👮",
    ],
    grid: "6x6",
  },
  EXPERT: {
    name: "Expert",
    cards: [
      "🔵",
      "🔷",
      "🟦",
      "🧊",
      "🔹",
      "💧",
      "🧢",
      "🚙",
      "🛰️",
      "💎",
      "💙",
      "🧞",
      "🐳",
      "🌌",
      "👔",
      "🦕",
      "🪁",
      "👮",
    ],
    grid: "6x6",
  },
};

export const getBoardConfig = (difficulty) => {
  let config = DIFFICULTIES[difficulty];
  if (!config && typeof difficulty === "object" && difficulty !== null) {
    config = difficulty;
  }
  if (!config) return null;
  const size = config.grid
    .split("x")
    .reduce((a, b) => parseInt(a) * parseInt(b), 1);
  return {
    size: size,
    cards: config.cards.slice(0, size / 2),
  };
};

export const GAME_VIEWS = {
  LANDING: "landing",
  GAME: "game",
  RANKING: "ranking",
};

export const RESET_ANIMATION_DURATION = 600;
export const MATCH_DELAY = 1000;
export const STORAGE_KEY = "memory_game_ranking";

export const RESULT_MESSAGES = {
  MEMORY: [
    "¿Eso lo has memorizado tú?",
    "Tu memoria pide vacaciones.",
    "Memoria: presente.",
    "Memoria: ausente.",
    "Algo se te ha quedado.",
    "Tienes memoria. Creo.",
    "No ibas tan mal de memoria.",
    "La memoria ha hecho lo que ha podido.",
    "Tu cerebro estaba mirando.",
    "Eso sí que lo recordabas.",
    "¿Ves? Sí te acuerdas.",
    "Tu cerebro funciona. Qué alivio.",
    "La memoria no era el problema.",
    "Hoy tu cerebro ha venido.",
    "Tu memoria se ha presentado al examen.",
  ],

  PAIRS: [
    "Por fin una pareja estable.",
    "Match.",
    "Hiciste match.",
    "Las parejas te quieren.",
    "Cupido estaría orgulloso.",
    "El amor triunfa.",
    "Una pareja menos soltera.",
    "Pareja encontrada.",
    "Eso sí que es saber emparejar.",
    "Ni Tinder hace tantos matches.",
    "Tu relación con las parejas va bien.",
    "Todas las parejas en su sitio.",
    "Aquí hay química.",
  ],

  SPEED: [
    "¿Pero tú has visto las cartas?",
    "Demasiado rápido.",
    "Vas con prisa.",
    "¿Tenías tanta prisa?",
    "Eso ha sido sospechosamente rápido.",
    "Parpadeé y terminaste.",
    "Más rápido que mi WiFi.",
    "Velocidad: preocupante.",
    "¿Te persigue alguien?",
    "Sin perder el tiempo.",
    "Aquí hemos venido a correr.",
    "Ni el cronómetro se lo cree.",
  ],

  BAD: [
    "Bueno… casi.",
    "Podría haber sido peor.",
    "No pasa nada.",
    "Lo importante es participar.",
    "Tu memoria necesita refuerzo.",
    "Hoy no era el día.",
    "El cerebro estaba ocupado.",
    "Hemos tenido días mejores.",
    "¿Quieres intentarlo otra vez?",
    "Eso ha dolido un poco.",
    "Las cartas te han ganado.",
    "Las parejas se escondían muy bien.",
    "Claramente no era tu día.",
    "Tu memoria ha dicho que no.",
    "Bueno, al menos terminaste.",
  ],

  GREAT: [
    "Tenemos un cerebrito.",
    "Qué barbaridad.",
    "Vienes fuerte.",
    "Eso ha sido demasiado bueno.",
    "Tenemos campeón.",
    "Memoria de elefante.",
    "Ni una pareja se te escapa.",
    "El cerebro está fino.",
    "Hoy vienes con memoria.",
    "Esto huele a top 5.",
    "El ranking te espera.",
    "¿Seguro que no has hecho trampas? 👀",
    "Eso no es mala memoria.",
    "Tenemos rival.",
    "Aquí hay nivel.",
  ],

  TOP_FIVE: [
    "¡TOP 5! Qué memoria.",
    "¡Estás entre los mejores!",
    "El ranking tiene nuevo inquilino.",
    "Mala memoria, dice…",
    "Tu memoria no era tan mala.",
    "El top 5 te queda bien.",
    "Nos vemos en el ranking.",
    "Hoy mandas tú.",
    "Las parejas te temen.",
    "El resto que se prepare.",
  ],
};
