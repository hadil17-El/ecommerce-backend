import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accesso negato" });
  }

  try {
    const [[{ revenue }]] = await db.query(
      "SELECT SUM(total) as revenue FROM orders"
    );
    const [[{ orders }]] = await db.query(
      "SELECT COUNT(*) as orders FROM orders"
    );
    const [[{ users }]] = await db.query(
      "SELECT COUNT(*) as users FROM users"
    );
    const [[{ products }]] = await db.query(
      "SELECT COUNT(*) as products FROM products"
    );

    res.json({ revenue: revenue || 0, orders, users, products });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;