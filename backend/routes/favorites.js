import express from "express";
import db from "../db.js";
import auth from "../middleware.js";

const router = express.Router();
//GET favorites
router.get("/",auth,async(req,res)=>{
  try{
    const [favorites]=await db.query(
      `SELECT p.*
      FROM favorites f
      JOIN products p ON p.id = f.product_id
      WHERE f.user_id=?`,
      [req.user.id]
    )
    res.json(favorites)
  } catch(err) {
    res.status(500).json({
      error:err.message
    })
  }
})
router.post("/", auth, async (req, res) => {
  try{
    const {product_id} = req.body
    await db.query(
      `
      INSERT IGNORE INTO favorites
      (user_id,product_id)
      VALUES (?,?)
      `,
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
 
});
router.delete("/",auth,async (req,res)=>{
  try{
    const {product_id} = req.body
    await db.query(
      `
      DELETE FROM favorites
      WHERE user_id = ?
      AND product_id =?`,
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