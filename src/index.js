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
      SELECT player_name, game_moves, game_time, difficulty
      FROM game_ranking
      ORDER BY difficulty, game_moves ASC, game_time ASC;
    `;

    const [results] = await conexion.query(query);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener ranking",
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

    conexion = await getConexion();

    const insertQuery = `
      INSERT INTO game_ranking
      (player_name, game_moves, game_time, game_date, game_pairs, difficulty)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const [result] = await conexion.execute(insertQuery, [
      player_name,
      game_moves,
      game_time,
      game_date,
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
    res.status(500).json({
      success: false,
      message: "Error al guardar la partida",
    });
  } finally {
    if (conexion) await conexion.end();
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
