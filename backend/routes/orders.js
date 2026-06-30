import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/:id",auth,async (req,res)=> {
  const {id}=req.params;
  try{

  
  const {rows: orderRows }=await db.query(
    "SELECT * FROM orders WHERE id=$1 AND user_id=$2",
    [id,req.user.id]
  )
  if(orderRows.length === 0){
    return res.status(404).json({error:"Order not found"})
  }
  const {rows: items} = await db.query(
     `
     SELECT oi.id,oi.quantity,oi.price,p.name,p.image
     FROM order_items oi
     JOIN products p ON
            p.id = oi.product_id
            WHERE oi.order_id = $1
     `,
     [id]
  )
  res.json({
    order: orderRows[0],
    items
  })
} catch (err){
  res.status(500).json({
    error:err.message
  })
}
})
router.get("/",auth,async (req,res)=>{
  try{
    const {rows}=await db.query(
      "SELECT * FROM orders WHERE user_id =$1 ORDER BY id DESC",
      [req.user.id] 
    )
    res.json(rows)
  } catch(err){
    res.status(500).json({error:err.message})
  }
})


export default router;