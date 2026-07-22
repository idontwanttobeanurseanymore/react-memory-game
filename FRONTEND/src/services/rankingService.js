import { STORAGE_KEY } from "../constants";
const API_URL = import.meta.env.PROD
  ? "https://martamao-memory-game.onrender.com"
  : "http://localhost:4000";

const PENDING_KEY = "memory_game_pending_uploads";
const LAST_LS_CLEANUP_KEY = "memory_game_last_ls_cleanup";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const checkMonthlyLSCleanup = () => {
  try {
    const lastCleanup = localStorage.getItem(LAST_LS_CLEANUP_KEY);
    const now = Date.now();

    if (lastCleanup) {
      const lastDate = new Date(lastCleanup).getTime();
      if (!isNaN(lastDate) && now - lastDate >= ONE_MONTH_MS) {
        console.log("🧹 Realizando limpieza mensual de LocalStorage...");
        
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(STORAGE_KEY) || key === PENDING_KEY) {
            localStorage.removeItem(key);
          }
        });

        localStorage.setItem(LAST_LS_CLEANUP_KEY, new Date().toISOString());
      }
    } else {
      localStorage.setItem(LAST_LS_CLEANUP_KEY, new Date().toISOString());
    }
  } catch (err) {
    console.error("Error en la limpieza mensual de LocalStorage:", err);
  }
};

const getValidIsoDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString();
  const d = new Date(dateVal);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

export const rankingService = {
  getRanking: async (difficultyName) => {
    checkMonthlyLSCleanup();
    const storageKey = `${STORAGE_KEY}_${difficultyName.toUpperCase()}`;

    try {
      const res = await fetch(`${API_URL}/api/memoryboard`);

      if (!res.ok) {
        throw new Error("Error en servidor");
      }

      const data = await res.json();

      if (!data.success) return [];

      const filtered = data.data
        .filter(
          (item) =>
            item.difficulty &&
            item.difficulty.toLowerCase() === difficultyName.toLowerCase(),
        )
        .map((item) => ({
          name: item.player_name,
          moves: item.game_moves,
          time: item.game_time,
          startTime: item.game_date,
        }))
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 10);

      // Guardar en LocalStorage (cache)
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      return filtered;
    } catch (error) {
      console.error("Error trayendo ranking:", error);

      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
  },

  saveRanking: async (difficultyName, playerName, moves, time, startTime, pairs) => {
    const storageKey = `${STORAGE_KEY}_${difficultyName.toUpperCase()}`;

    // Intentar sincronizar partidas pendientes previas
    rankingService.syncPendingToBackend().catch(() => {});

    const currentRanking = await rankingService.getRanking(difficultyName);

    const validIsoDate = getValidIsoDate(startTime);

    const newEntry = {
      name: playerName,
      moves,
      time,
      startTime: validIsoDate,
    };

    const isDuplicateLocal = currentRanking.some(
      (item) =>
        item.name === playerName &&
        item.moves === moves &&
        item.time === time &&
        item.startTime === validIsoDate
    );

    if (!isDuplicateLocal) {
      const updatedRanking = [...currentRanking, newEntry]
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 10);

      localStorage.setItem(storageKey, JSON.stringify(updatedRanking));
    }

    // Enviar a backend
    try {
      const res = await fetch(`${API_URL}/api/memoryboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: playerName,
          game_moves: moves,
          game_time: time,
          game_date: validIsoDate,
          game_pairs: pairs,
          difficulty: difficultyName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en servidor (${res.status})`);
      }
    } catch (err) {
      console.error("Error guardando en backend:", err);

      // Guardar en lista de pendientes para reintentar al reconectar
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
      const alreadyPending = pending.some(
        (p) =>
          p.startTime === validIsoDate &&
          p.playerName === playerName &&
          p.moves === moves &&
          p.time === time &&
          p.difficultyName === difficultyName,
      );
      if (!alreadyPending) {
        pending.push({ difficultyName, playerName, moves, time, startTime: validIsoDate, pairs });
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        console.warn("⚠️ Partida guardada como pendiente. Se reintentará al reconectar.");
      }
    }
  },

  syncPendingToBackend: async () => {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    if (pending.length === 0) return;

    // Eliminar duplicados de la lista de pendientes antes de procesar
    const uniquePending = [];
    for (const item of pending) {
      const isDup = uniquePending.some(
        (u) =>
          u.playerName === item.playerName &&
          u.moves === item.moves &&
          u.time === item.time &&
          u.startTime === item.startTime &&
          u.difficultyName === item.difficultyName
      );
      if (!isDup) uniquePending.push(item);
    }

    console.log(`🔄 Intentando subir ${uniquePending.length} partidas pendientes...`);
    const stillPending = [];

    for (const entry of uniquePending) {
      try {
        const res = await fetch(`${API_URL}/api/memoryboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_name: entry.playerName,
            game_moves: entry.moves,
            game_time: entry.time,
            game_date: getValidIsoDate(entry.startTime),
            game_pairs: entry.pairs,
            difficulty: entry.difficultyName,
          }),
        });

        if (!res.ok) {
          stillPending.push(entry);
        } else {
          console.log(`✅ Partida pendiente subida: ${entry.playerName} (${entry.difficultyName})`);
        }
      } catch {
        stillPending.push(entry); // Sin conexión, mantener como pendiente
      }
    }

    localStorage.setItem(PENDING_KEY, JSON.stringify(stillPending));
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    rankingService.syncPendingToBackend();
  });
}
