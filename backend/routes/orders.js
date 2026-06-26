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
  if(order.length === 0){
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
    order: order[0],
    items
  })
} catch (err){
  res.status(500).json({
    error:err.message
  })
}
})


export default router;