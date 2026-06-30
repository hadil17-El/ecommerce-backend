import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accesso negato" });
  }

  try {
    const { rows:revenueRows } = await db.query(
      "SELECT SUM(total) as revenue FROM orders"
    );
    const { rows: ordersRows } = await db.query(
      "SELECT COUNT(*) as orders FROM orders"
    );
    const { rows: usersRows } = await db.query(
      "SELECT COUNT(*) as users FROM users"
    );
    const { rows:productsRows } = await db.query(
      "SELECT COUNT(*) as products FROM products"
    );

    res.json({ 
      revenue:Number(revenueRows[0].revenue),
       orders:Number(ordersRows[0].orders),
       users:Number(usersRows[0].users),
        products:Number(productsRows[0].products),
       });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;