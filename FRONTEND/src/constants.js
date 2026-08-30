export const DIFFICULTIES = {
  EASY: {
    name: "de tranquis",
    cards: ["👽​​​", "🧟‍♀️", "👩🏻‍🚀", "🧑🏻‍💻", "🥷🏻​​", "🐒", "🦚", "🦭​"],
  },
  MEDIUM: {
    name: "normalito",
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
  },
  HARD: {
    name: "chungo",
    cards: [
      "🔵",
      "🔷",
      "🟦",
      "🧊",
      "🔹",
      "💧",
      "🧢",
      "🚙",
      "💎",
      "💙",
      "🧞",
      "🐳",
      "🌌",
      "👔",
      "👮",
    ],
  },
  EXPERT: {
    name: "imposible",
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
  },
};

export const getBoardConfig = (difficulty) => {
  let config = DIFFICULTIES[difficulty];

  if (!config && typeof difficulty === "object" && difficulty !== null) {
    config = difficulty;
  }

  if (!config) return null;

  return {
    size: config.cards.length * 2,
    cards: config.cards,
  };
};

export const GAME_VIEWS = {
  LANDING: "landing",
  START_GAME: "start-game",
  GAME: "game",
  RANKING: "ranking",
  LOGIN: "login",
};

export const RESET_ANIMATION_DURATION = 600;
export const MATCH_DELAY = 1000;
export const STORAGE_KEY = "memory_game_ranking";

export const START_GAME_MESSAGES = [
  "HOY NO HAY EXCUSAS",
  "NO PROMETO QUE SEA FACIL",
  "QUE EMPIECE EL DESASTRE",
  "¿DE VERDAD CREES QUE PUEDES?",
];
export const DIFFICULTY_MESSAGES = {
  EASY: ["¿Vas a ir por lo fácil?", "Para empezar, no está mal", "Qué cobarde"],

  MEDIUM: [
    "Esto se pone serio",
    "Aquí empieza lo bueno",
    "Ni de coña clasificas",
  ],

  HARD: [
    "Ah, te gusta sufrir",
    "Luego no digas que no te avisé",
    "Esto no es para cualquiera",
  ],

  EXPERT: [
    "Tú sabrás lo que te haces",
    "Esto va a doler",
    "Buena suerte. La vas a necesitar",
  ],
};
export const RESULT_MESSAGES = {
  BAD: [
    "¿Quieres intentarlo otra vez?",
    "Eso ha dolido un poco",
    "Las cartas te han ganado",
    "Las parejas se escondían muy bien",
    "Bueno… casi",
    "No pasa nada",
    "Tu memoria necesita refuerzo",
    "Hoy no era el día",
    "Tu cerebro estaba a otras cosas",
    "Hemos tenido días mejores",
    "Claramente no era tu día",
    "Tu memoria ha dicho basta",
    "Memoria: ausente",
  ],
  SPEED: [
    "¿Pero tú has visto las cartas?",
    "Demasiado rápido",
    "Vas con prisa",
    "¿Tanta prisa tenías?",
    "Eso ha sido sospechosamente rápido",
    "Parpadeé y terminaste",
    "Más rápido que mi WiFi",
    "Velocidad: preocupante",
    "¿Te persigue alguien?",
    "Sin perder el tiempo",
    "Llegaste sin aliento",
    "Ni el cronómetro se lo cree",
  ],
  PAIRS: [
    "Cupido estaría orgulloso",
    "No ha quedado ni una suelta",
    "Eso sí que es saber emparejar",
    "Ni Tinder hace tantos matches",
    "Has encontrado a toda la pandilla",
    "Aquí nadie se ha quedado colgado",
    "Todas juntitas. Qué bonito",
    "Todas en su sitio. Milagro",
    "Bueno, al menos sabes emparejar",
    "No sabemos cómo, pero las has juntado",
    "Todas juntas. Ahora déjalas tranquilas",
    "Cupido puede descansar",
    "El mercado de las parejas está cerrado",
    "Tenemos parejas para rato",
    "Todas las parejas localizadas",
    "Esto parece una agencia matrimonial",
    "Has juntado a todo el mundo",
    "Aquí hay más matches que en Tinder",
    "Las tenías todas fichadas",
  ],
  MEMORY: [
    "Podría haber sido peor",
    "Lo importante es participar",
    "Bueno, al menos terminaste",
    "Tu memoria pide vacaciones",
    "Tu memoria ha hecho lo que ha podido",
    "Tu cerebro estaba mirando",
    "Eso sí que lo recordabas",
    "¿Ves? Sí te acuerdas",
    "Tu cerebro funciona. Qué alivio",
    "La memoria no era el problema",
    "Hoy tu cerebro ha venido",
    "Tu memoria se ha presentado al examen",
    "Nadie al volante",
  ],
  GREAT: [
    "No ibas tan mal de memoria",
    "Tenemos un cerebrito",
    "Qué barbaridad",
    "Vienes fuerte",
    "Eso ha sido demasiado bueno",
    "Tenemos campeón",
    "Memoria de elefante",
    "Ni una pareja se te escapa",
    "El cerebro está fino",
    "Hoy vienes con memoria",
    "Esto huele a top 5",
    "El ranking te espera",
    "¿Seguro que no has hecho trampas? 👀",
    "Eso no es mala memoria",
    "Tenemos rival",
    "Aquí hay nivel",
  ],

  TOP_FIVE: [
    "¡TOP 5! Qué memoria",
    "¡Qué nivel, maribel!",
    "El ranking tiene nuevo inquilino",
    "Mala memoria, dice…",
    "Tu memoria no era tan mala",
    "El top 5 te queda bien",
    "Nos vemos en el ranking",
    "Hoy mandas tú",
    "Las parejas te temen",
    "El resto que se prepare",
  ],
};
