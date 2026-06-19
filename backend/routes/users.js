import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accesso negato" });
  }

  try {
    const [rows] = await db.query("SELECT id, email, role FROM users");
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;