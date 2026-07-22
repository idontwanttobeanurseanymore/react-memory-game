import { STORAGE_KEY } from "../constants";
const API_URL = import.meta.env.PROD
  ? "https://martamao-memory-game.onrender.com"
  : "http://localhost:4000";

const PENDING_KEY = "memory_game_pending_uploads";

export const rankingService = {
  getRanking: async (difficultyName) => {
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

    const currentRanking = await rankingService.getRanking(difficultyName);

    const newEntry = {
      name: playerName,
      moves,
      time,
      startTime,
    };

    const updatedRanking = [...currentRanking, newEntry]
      .sort((a, b) => a.moves - b.moves || a.time - b.time)
      .slice(0, 10);

    localStorage.setItem(storageKey, JSON.stringify(updatedRanking));

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
          game_date: new Date(startTime).toISOString(),
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
        (p) => p.startTime === startTime && p.playerName === playerName,
      );
      if (!alreadyPending) {
        pending.push({ difficultyName, playerName, moves, time, startTime, pairs });
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
        console.warn("⚠️ Partida guardada como pendiente. Se reintentará al reconectar.");
      }
    }
  },

  syncPendingToBackend: async () => {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    if (pending.length === 0) return;

    console.log(`🔄 Intentando subir ${pending.length} partidas pendientes...`);
    const stillPending = [];

    for (const entry of pending) {
      try {
        const res = await fetch(`${API_URL}/api/memoryboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_name: entry.playerName,
            game_moves: entry.moves,
            game_time: entry.time,
            game_date: new Date(entry.startTime).toISOString(),
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
