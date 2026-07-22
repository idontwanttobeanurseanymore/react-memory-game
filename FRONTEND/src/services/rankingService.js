import { STORAGE_KEY, DIFFICULTIES } from "../constants";

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

const isSameGame = (a, b) => {
  if (!a || !b) return false;
  const samePlayer =
    String(a.name || a.playerName || a.player_name || "").trim().toLowerCase() ===
    String(b.name || b.playerName || b.player_name || "").trim().toLowerCase();
  const sameMoves = Number(a.moves ?? a.game_moves) === Number(b.moves ?? b.game_moves);
  const sameTime = Number(a.time ?? a.game_time) === Number(b.time ?? b.game_time);
  const sameDiff =
    String(a.difficultyName || a.difficulty || "").trim().toLowerCase() ===
    String(b.difficultyName || b.difficulty || "").trim().toLowerCase();

  const timeA = new Date(a.startTime || a.game_date).getTime();
  const timeB = new Date(b.startTime || b.game_date).getTime();
  const sameDate = !isNaN(timeA) && !isNaN(timeB) && Math.abs(timeA - timeB) < 5000;

  return samePlayer && sameMoves && sameTime && sameDiff && sameDate;
};

export const rankingService = {
  getRanking: async (difficultyName) => {
    checkMonthlyLSCleanup();
    const storageKey = `${STORAGE_KEY}_${difficultyName.toUpperCase()}`;

    try {
      const res = await fetch(`${API_URL}/api/memoryboard`);

      if (!res.ok) {
        throw new Error(`Error en servidor (${res.status})`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error("Respuesta no exitosa del servidor");
      }

      const dbFiltered = data.data
        .filter(
          (item) =>
            item.difficulty &&
            item.difficulty.toLowerCase() === difficultyName.toLowerCase()
        )
        .map((item) => ({
          name: item.player_name,
          moves: Number(item.game_moves),
          time: Number(item.game_time),
          startTime: item.game_date,
          difficultyName: item.difficulty,
          pairs: item.game_pairs,
        }));

      const localCached = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");

      const pendingForDiff = pending.filter(
        (p) =>
          p.difficultyName &&
          p.difficultyName.toLowerCase() === difficultyName.toLowerCase()
      );

      const combined = [...dbFiltered];

      const localCandidates = [...localCached, ...pendingForDiff];
      for (const localItem of localCandidates) {
        const existsInDb = combined.some((dbItem) => isSameGame(localItem, dbItem));
        if (!existsInDb) {
          combined.push({
            name: localItem.name || localItem.playerName,
            moves: Number(localItem.moves),
            time: Number(localItem.time),
            startTime: getValidIsoDate(localItem.startTime || localItem.game_date),
            difficultyName: difficultyName,
            pairs: localItem.pairs,
          });
        }
      }

      const sorted = combined
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 10);

      localStorage.setItem(storageKey, JSON.stringify(sorted));

      return sorted;
    } catch (error) {
      console.warn(`⚠️ Usando rankings de LocalStorage para ${difficultyName} debido a error:`, error.message);
      const localData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return localData.sort((a, b) => a.moves - b.moves || a.time - b.time).slice(0, 10);
    }
  },

  saveRanking: async (difficultyName, playerName, moves, time, startTime, pairs) => {
    const storageKey = `${STORAGE_KEY}_${difficultyName.toUpperCase()}`;
    const validIsoDate = getValidIsoDate(startTime);

    const newEntry = {
      name: playerName,
      playerName: playerName,
      moves: Number(moves),
      time: Number(time),
      startTime: validIsoDate,
      difficultyName,
      pairs: Number(pairs),
    };

    const currentLocal = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const isDup = currentLocal.some((item) => isSameGame(item, newEntry));
    if (!isDup) {
      const updatedLocal = [...currentLocal, newEntry]
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 10);
      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));
    }

    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
    const isAlreadyPending = pending.some((p) => isSameGame(p, newEntry));
    if (!isAlreadyPending) {
      pending.push(newEntry);
      localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    }

    try {
      const res = await fetch(`${API_URL}/api/memoryboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: playerName,
          game_moves: Number(moves),
          game_time: Number(time),
          game_date: validIsoDate,
          game_pairs: Number(pairs),
          difficulty: difficultyName,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error en servidor (${res.status})`);
      }

      const currentPending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
      const updatedPending = currentPending.filter((p) => !isSameGame(p, newEntry));
      localStorage.setItem(PENDING_KEY, JSON.stringify(updatedPending));

      return await rankingService.getRanking(difficultyName);
    } catch (err) {
      console.warn("⚠️ Partida guardada en LocalStorage (pendiente de sincronizar con BD):", err.message);
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
  },

  syncPendingToBackend: async () => {
    try {
      console.log("🔄 Verificando y sincronizando datos entre LocalStorage y BD...");

      const res = await fetch(`${API_URL}/api/memoryboard`);
      if (!res.ok) {
        console.warn("⚠️ BD no disponible para sincronizar en este momento.");
        return;
      }
      const data = await res.json();
      if (!data.success) return;

      const dbRecords = data.data || [];

      const allLocalItems = [];

      const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
      allLocalItems.push(...pending);

      const diffList = Object.values(DIFFICULTIES).map((d) => d.name);
      for (const diffName of diffList) {
        const storageKey = `${STORAGE_KEY}_${diffName.toUpperCase()}`;
        const cached = JSON.parse(localStorage.getItem(storageKey) || "[]");
        cached.forEach((item) => {
          allLocalItems.push({
            playerName: item.name || item.playerName,
            moves: item.moves,
            time: item.time,
            startTime: getValidIsoDate(item.startTime || item.game_date),
            difficultyName: diffName,
            pairs: item.pairs || 8,
          });
        });
      }

      const uniqueLocalItems = [];
      for (const item of allLocalItems) {
        if (!item.playerName || !item.difficultyName) continue;
        const dup = uniqueLocalItems.some((u) => isSameGame(u, item));
        if (!dup) uniqueLocalItems.push(item);
      }

      const remainingPending = [];

      for (const item of uniqueLocalItems) {
        const existsInDb = dbRecords.some((dbItem) => isSameGame(item, dbItem));

        if (!existsInDb) {
          try {
            console.log(`📤 Subiendo partida no sincronizada a la BD: ${item.playerName} (${item.difficultyName})...`);
            const postRes = await fetch(`${API_URL}/api/memoryboard`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                player_name: item.playerName,
                game_moves: Number(item.moves),
                game_time: Number(item.time),
                game_date: getValidIsoDate(item.startTime),
                game_pairs: Number(item.pairs || 8),
                difficulty: item.difficultyName,
              }),
            });

            if (!postRes.ok) {
              remainingPending.push(item);
            } else {
              console.log(`✅ Partida sincronizada con la BD: ${item.playerName}`);
            }
          } catch (postErr) {
            console.warn(`❌ Error al subir partida: ${postErr.message}`);
            remainingPending.push(item);
          }
        }
      }

      localStorage.setItem(PENDING_KEY, JSON.stringify(remainingPending));

      for (const diffName of diffList) {
        await rankingService.getRanking(diffName);
      }
    } catch (err) {
      console.warn("Error durante sincronización LS <-> BD:", err.message);
    }
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    rankingService.syncPendingToBackend();
  });
}

