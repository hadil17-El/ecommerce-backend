"use client"
import ProductCard from "../components/ProductCard"
import { getLatestProducts,searchProducts ,getProducts, getProductsByCategory,getProductsByGender } from "../api/api"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import "./shopPage.css"
export default function Shop(){
    const searchParams= useSearchParams()
    const type = searchParams.get("type")
    const gender= searchParams.get("gender")
    const category = searchParams.get("category")
    const [products,setProducts] = useState([])
    const [loading,setLoading]=useState(true)
    const search =searchParams.get("search")
    useEffect(()=>{
        async function load(){
            let data = []
            if(type === "new"){
                data = await getLatestProducts()
            }
            else if(gender){
                data = await getProductsByGender(gender)
                console.log("gender =",gender)
                console.log("data =",data)
            }
            else if(category){
                data = await getProductsByCategory(category)
            }
            else if(search){
                data =await searchProducts(search)
            }
            else {
                data = await getProducts()
            }
            setProducts(data)
            setLoading(false)
        }
        load()
    },[type,category,gender,search])

return(
    <div className="shop-page">
        <div className="shop-header">
        <h1>Shop</h1>
<p>
  {gender
    ? gender
    : category
    ? category
    : search
    ? `Results for "${search}"`
    : "All Products"}
</p></div>
{
    loading ? (
          <p>Loading...</p>
    ) :(
 <div className="shop-grid">
            {products.map(p=>(
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    )
}
       
    </div>
)
}