import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/:id",auth,async (req,res)=> {
  try{

  const {id} = req.params
  const [order]=await db.query(
    "SELECT * FROM orders WHERE id=? AND user_id=?",
    [id,req.user.id]
  )
  if(OrderDetails.length === 0){
    return res.status(404).json({error:"Order not found"})
  }
  const [items] = await db.query(
     `
     SELECT oi.id,oi.quantity,oi.price,p.name,p.image
     FROM order_items oi
     JOIN products p ON
            p.id = oi.product_id
            WHERE oi.order_id = ? 
     `,
     [id]
  )
  res.json({
    order: orders[0],
    items
  })
} catch (err){
  res.status(500).json({
    error:err.message
  })
}
})
router.post("/", auth, async (req, res) => {
  const user_id = req.user.id;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [cart] = await conn.query(
      `SELECT c.*, p.price FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cart.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Cart Empty" });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [result] = await conn.query(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')",
      [user_id, total]
    );
    const order_id = result.insertId;

    for (const item of cart) {
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [order_id, item.product_id, item.quantity, item.price]
      );
    }

    await conn.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
    await conn.commit();

    res.json({ message: "Order created", order_id });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

export default router;