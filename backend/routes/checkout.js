import express from "express";
import db from "../db.js";
import auth from "../middleware.js";


const router = express.Router();

router.post("/", auth, async (req, res) => {
  const user_id = req.user.id;
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const {rows: cart } = await client.query(
      `SELECT c.*, p.price FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [user_id]
    );

    if (cart.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart Empty" });
    }

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    const {rows: orderRows} = await client.query(
       `INSERT INTO orders (user_id, total, status) VALUES ($1, $2, 'pending') RETURNING id`,
      [user_id, total]
    );
    if(!orderRows.length){
      throw new Error("Order creation failed");
    }
    const order_id = orderRows[0].id;

    for (const item of cart) {
      await client.query(
         `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) `,
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query( `DELETE FROM cart WHERE user_id = $1 `, [user_id]);
    await client.query("COMMIT");

    res.json({ message: "Order created", order_id });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("CHECKOUT ERROR: ",err)
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

export default router;