import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { id, latest, recommended, user_id, gender, category, sale, search } = req.query;

  try {
    if (id) {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      return res.json(rows[0] || null);
    }
    if (latest) {
      const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC LIMIT 10");
      return res.json(rows);
    }
    if (recommended && user_id) {
      const [cats] = await db.query(
        "SELECT DISTINCT p.category FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?",
        [user_id]
      );
      const categories = cats.map(r => r.category).filter(Boolean);
      if (categories.length === 0) return res.json([]);
      const placeholders = categories.map(() => "?").join(",");
      const [rows] = await db.query(
        `SELECT * FROM products WHERE category IN (${placeholders}) AND id NOT IN (SELECT product_id FROM cart WHERE user_id = ?) LIMIT 10`,
        [...categories, user_id]
      );
      return res.json(rows);
    }
    if (gender) {
      const [rows] = await db.query("SELECT * FROM products WHERE gender = ?", [gender]);
      return res.json(rows);
    }
    if (category) {
      const [rows] = await db.query("SELECT * FROM products WHERE category = ?", [category]);
      return res.json(rows);
    }
    if (sale !== undefined) {
      const [rows] = await db.query("SELECT * FROM products WHERE price <= 40 ORDER BY price ASC");
      return res.json(rows);
    }
    if (search) {
      const like = `%${search}%`;
      const [rows] = await db.query("SELECT * FROM products WHERE name LIKE ? OR category LIKE ?", [like, like]);
      return res.json(rows);
    }
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (e) {
    console.log("ERRORE:", e);
    res.status(500).json({ error: "Errore server" });
  }
});

router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Accesso negato" });
  const { name, price, image, description, category } = req.body;
  if (!name || !price) return res.status(400).json({ error: "Nome e prezzo obbligatori" });
  try {
    const [result] = await db.query(
      "INSERT INTO products (name, price, image, description, category) VALUES (?, ?, ?, ?, ?)",
      [name, price, image, description, category]
    );
    res.json({ message: "Prodotto aggiunto", id: result.insertId });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

router.put("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Non autorizzato" });
  const { id, name, price, image, description, category, stock, sale } = req.body;
  try {
    await db.query(
      "UPDATE products SET name=?, price=?, image=?, description=?, category=?, stock=?, sale=? WHERE id=?",
      [name, price, image, description, category, stock || 0, sale ? 1 : 0, id]
    );
    res.json({ message: "Prodotto aggiornato" });
  } catch  {
    res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Non autorizzato" });
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID mancante" });
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Prodotto non trovato" });
    res.json({ message: "Prodotto eliminato" });
  }  catch (e) {
    console.log("ERRORE:", e);
    res.status(500).json({ error: "Errore server" });
}
});

export default router;