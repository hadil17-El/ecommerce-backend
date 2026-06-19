import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT cart.*, products.name, products.image, products.price
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch  {
    res.status(500).json({ error: "Errore server" });
  }
});

router.post("/", auth, async (req, res) => {
  const { product_id, action, id } = req.body;
  try {
    if (action) {
      if (action === "inc") {
        await db.query("UPDATE cart SET quantity = quantity + 1 WHERE id = ?", [id]);
      } else if (action === "dec") {
        await db.query("UPDATE cart SET quantity = GREATEST(quantity - 1, 1) WHERE id = ?", [id]);
      } else {
        return res.status(400).json({ error: "Azione non valida" });
      }
      return res.json({ message: "updated" });
    }

    const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [req.user.id, product_id]
    );
    if (rows.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?",
        [req.user.id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id) VALUES (?, ?)",
        [req.user.id, product_id]
      );
    }
    res.json({ message: "added" });
  } catch  {
    res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/", auth, async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM cart WHERE id = ?", [id]);
    res.json({ message: "deleted" });
  } catch{
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;