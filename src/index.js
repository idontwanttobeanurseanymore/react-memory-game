import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//CONFIGURACIÓN BD
const getConexion = async () => {
  const datosConexion = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_SCHEMA,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const conexion = await mysql.createConnection(datosConexion);
  await conexion.connect();
  return conexion;
};

//COMPROBAR CONEXIÓN
const checkDBConnection = async () => {
  try {
    const conexion = await getConexion();
    console.log("✅ Conexión a la BD correcta");
    await conexion.end();
  } catch (error) {
    console.error("❌ Error de conexión a la BD:", error.message);
  }
};

//SERVIDOR
const server = express();

server.use(cors());
server.use(express.json({ limit: "25Mb" }));

//ARRANQUE
const port = process.env.PORT || 4000;

//ENDPOINTS

//GET RANKING
server.get("/api/memoryboard", async (req, res) => {
  let conexion;

  try {
    conexion = await getConexion();

    const query = `
      SELECT player_name, game_moves, game_time, game_date, game_pairs, difficulty
      FROM game_ranking
      ORDER BY difficulty, game_moves ASC, game_time ASC;
    `;

    const [results] = await conexion.query(query);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (conexion) await conexion.end();
  }
});

//POST GAME
server.post("/api/memoryboard", async (req, res) => {
  let conexion;

  try {
    const {
      player_name,
      game_moves,
      game_time,
      game_date,
      game_pairs,
      difficulty,
    } = req.body;

    if (
      !player_name ||
      game_moves === undefined ||
      game_time === undefined ||
      !game_date ||
      game_pairs === undefined ||
      !difficulty
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios",
      });
    }

    if (typeof player_name !== "string" || player_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "player_name debe ser texto válido",
      });
    }

    if (isNaN(game_moves) || isNaN(game_time) || isNaN(game_pairs)) {
      return res.status(400).json({
        success: false,
        message: "game_moves, game_time y game_pairs deben ser números",
      });
    }

    let formattedDate;
    try {
      const d = new Date(game_date);
      if (isNaN(d.getTime())) {
        formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      } else {
        formattedDate = d.toISOString().slice(0, 19).replace('T', ' ');
      }
    } catch {
      formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    conexion = await getConexion();

    const checkQuery = `
      SELECT 1 FROM game_ranking
      WHERE player_name = ?
        AND game_moves = ?
        AND game_time = ?
        AND game_date = ?
        AND game_pairs = ?
        AND difficulty = ?
      LIMIT 1;
    `;

    const [existing] = await conexion.execute(checkQuery, [
      player_name,
      game_moves,
      game_time,
      formattedDate,
      game_pairs,
      difficulty,
    ]);

    if (existing && existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: "El resultado ya existe en la base de datos",
        data: {
          player_name,
          game_moves,
          game_time,
          game_date: formattedDate,
          game_pairs,
          difficulty,
        },
      });
    }

    const insertQuery = `
      INSERT INTO game_ranking
      (player_name, game_moves, game_time, game_date, game_pairs, difficulty)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const [result] = await conexion.execute(insertQuery, [
      player_name,
      game_moves,
      game_time,
      formattedDate,
      game_pairs,
      difficulty,
    ]);

    if (result.affectedRows === 1) {
      res.status(201).json({
        success: true,
        data: {
          //   id: result.insertId,
          ...req.body,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No se pudo guardar la partida",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (conexion) await conexion.end();
  }
});

// HELPER PARA LIMPIAR BD (MANTIENE SOLO LOS 10 MEJORES POR NIVEL)
const runDBCleanup = async () => {
  let conexion;
  try {
    conexion = await getConexion();

    const [difficulties] = await conexion.query(
      "SELECT DISTINCT difficulty FROM game_ranking"
    );

    const idsToKeep = [];

    for (const diffObj of difficulties) {
      const diffName = diffObj.difficulty;
      if (!diffName) continue;

      const [topRecords] = await conexion.execute(
        `SELECT id FROM game_ranking 
         WHERE LOWER(difficulty) = LOWER(?) 
         ORDER BY game_moves ASC, game_time ASC, game_date ASC, id ASC 
         LIMIT 10`,
        [diffName]
      );

      topRecords.forEach((row) => idsToKeep.push(row.id));
    }

    let deletedRows = 0;

    if (idsToKeep.length > 0) {
      const placeholders = idsToKeep.map(() => "?").join(",");
      const deleteQuery = `DELETE FROM game_ranking WHERE id NOT IN (${placeholders})`;
      const [result] = await conexion.execute(deleteQuery, idsToKeep);
      deletedRows = result.affectedRows;
    }

    console.log(`🧹 Limpieza de BD realizada: ${deletedRows} partidas eliminadas.`);
    return deletedRows;
  } catch (error) {
    console.error("❌ Error en la limpieza de la BD:", error.message);
    throw error;
  } finally {
    if (conexion) await conexion.end();
  }
};

// DELETE GAME RANKING (MANTIENE SOLO TOP 10 POR NIVEL)
server.delete(["/api/memoryboard", "/api/memoryboard/cleanup"], async (req, res) => {
  try {
    const deletedRows = await runDBCleanup();
    res.status(200).json({
      success: true,
      message: "Limpieza de base de datos realizada. Se conservaron los 10 mejores resultados por nivel.",
      deletedRows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//STATIC
const staticServerPath = path.join(__dirname, "../public");
server.use(express.static(staticServerPath));
//FALLBACK
server.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(staticServerPath, "index.html"));
});

//404
server.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Página no encontrada",
  });
});
//LISTEN
server.listen(port, async () => {
  console.log(`Servidor iniciado en ${port}`);
  await checkDBConnection();
});
