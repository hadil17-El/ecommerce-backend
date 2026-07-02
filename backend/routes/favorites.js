import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();

router.get("/",auth,async(req,res)=>{
  try{
    const { rows }=await db.query(
      `SELECT p.*
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      WHERE f.user_id=$1`,
      [req.user.id]
    )
    res.json(rows)
  } catch(err) {
    res.status(500).json({
      error:err.message
    })
  }
})
router.post("/", auth, async (req, res) => {
  try{
    const {product_id} = req.body
    const user_id = req.user.id
    const {rows}=await db.query(
      "SELECT * FROM favorites WHERE user_id=$1 AND product_id=$2",
      [user_id,product_id]
    )
    if(rows.length > 0) {
      await db.query(
        "DELETE FROM favorites WHERE user_id=$1 AND product_id=$2",
        [user_id,product_id]
      )
      return res.json({added:false})
    }
    await db.query(
      "INSERT INTO favorites (user_id,product_id) VALUES ($1,$2)",
      [user_id,product_id]
    )
    return res.json({added:true})
   
  } catch (err){
    res.status(500).json({
      error:err.message
    })
  }
 
});
router.delete("/",auth,async (req,res)=>{
  try{
    const {product_id} = req.body
    await db.query(
      `
      DELETE FROM favorites
      WHERE user_id = $1
      AND product_id =$2`,
      [req.user.id,product_id]
    )
    res.json({
      success:true
    })
  } catch (err){
    res.status(500).json({
      error:err.message
    })
  }
})

export default router;
