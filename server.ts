import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_ICC_CONFIG } from "./src/constants";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("icc.db");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS config (
    id INTEGER PRIMARY KEY,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    patientId TEXT NOT NULL,
    unit TEXT NOT NULL,
    bed TEXT NOT NULL,
    date TEXT NOT NULL,
    scores TEXT NOT NULL,
    totalScore INTEGER NOT NULL,
    category TEXT NOT NULL,
    alerts TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed admin user if empty
const adminExists = db.prepare("SELECT id FROM users WHERE username = 'admin'").get();
if (!adminExists) {
  db.prepare("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)").run(
    Math.random().toString(36).substr(2, 9),
    "admin",
    "admin123",
    "admin"
  );
}

// Seed config if empty
const configExists = db.prepare("SELECT id FROM config WHERE id = 1").get();
if (!configExists) {
  db.prepare("INSERT INTO config (id, data) VALUES (1, ?)").run(JSON.stringify(DEFAULT_ICC_CONFIG));
}

// Seed records if empty
const recordsCount = db.prepare("SELECT COUNT(*) as count FROM records").get() as { count: number };
if (recordsCount.count === 0) {
  const seedRecords = [
    {
      id: "1",
      patientId: "PAC-001",
      unit: "UH1",
      bed: "101",
      date: new Date().toISOString(),
      scores: JSON.stringify({ dependencia: 30, respiratorio: 15, cutanea: 10, conducta: 5 }),
      totalScore: 60,
      category: "Alta",
      alerts: JSON.stringify({ vm: true, fuga: true, aislamiento: false, lpp: true })
    },
    {
      id: "2",
      patientId: "PAC-002",
      unit: "UH1",
      bed: "102",
      date: new Date().toISOString(),
      scores: JSON.stringify({ dependencia: 10, urinaria: 4, fecal: 4 }),
      totalScore: 18,
      category: "Baja",
      alerts: JSON.stringify({ vm: false, fuga: false, aislamiento: false, lpp: false })
    },
    {
      id: "3",
      patientId: "PAC-003",
      unit: "UH2",
      bed: "201",
      date: new Date().toISOString(),
      scores: JSON.stringify({ dependencia: 20, respiratorio: 12, aislamiento: 4 }),
      totalScore: 36,
      category: "Media",
      alerts: JSON.stringify({ vm: true, fuga: false, aislamiento: true, lpp: false })
    },
    {
      id: "4",
      patientId: "PAC-004",
      unit: "UH4",
      bed: "405",
      date: new Date().toISOString(),
      scores: JSON.stringify({ dependencia: 30, respiratorio: 15, cutanea: 10, conducta: 8 }),
      totalScore: 63,
      category: "Muy Alta",
      alerts: JSON.stringify({ vm: true, fuga: false, aislamiento: false, lpp: true })
    }
  ];

  const insert = db.prepare(`
    INSERT INTO records (id, patientId, unit, bed, date, scores, totalScore, category, alerts)
    VALUES (@id, @patientId, @unit, @bed, @date, @scores, @totalScore, @category, @alerts)
  `);

  seedRecords.forEach(r => insert.run(r));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/config", (req, res) => {
    const config = db.prepare("SELECT data FROM config WHERE id = 1").get() as { data: string };
    res.json(JSON.parse(config.data));
  });

  app.post("/api/config", (req, res) => {
    db.prepare("UPDATE config SET data = ? WHERE id = 1").run(JSON.stringify(req.body));
    res.json({ success: true });
  });

  app.get("/api/records", (req, res) => {
    const records = db.prepare("SELECT * FROM records ORDER BY createdAt DESC").all();
    res.json(records.map((r: any) => ({
      ...r,
      scores: JSON.parse(r.scores),
      alerts: JSON.parse(r.alerts)
    })));
  });

  app.post("/api/records", (req, res) => {
    const record = req.body;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO records (id, patientId, unit, bed, date, scores, totalScore, category, alerts)
      VALUES (@id, @patientId, @unit, @bed, @date, @scores, @totalScore, @category, @alerts)
    `);
    stmt.run({
      ...record,
      scores: JSON.stringify(record.scores),
      alerts: JSON.stringify(record.alerts)
    });
    res.json({ success: true });
  });

  app.delete("/api/records/:id", (req, res) => {
    db.prepare("DELETE FROM records WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // User Management API
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT id, username, role FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  });

  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, username, role, createdAt FROM users").all();
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const { username, password, role } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)");
      stmt.run(Math.random().toString(36).substr(2, 9), username, password, role);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: "El usuario ya existe" });
    }
  });

  app.patch("/api/users/:id", (req, res) => {
    const { password, role } = req.body;
    if (password) {
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(password, req.params.id);
    }
    if (role) {
      db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
    }
    res.json({ success: true });
  });

  app.delete("/api/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

