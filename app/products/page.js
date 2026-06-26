"use client"
import { useEffect,useState } from "react"
import {getProducts} from "../api/api"
import "./products.css"
import { useRouter } from "next/navigation"
export default function ProductsPage(){
    const [products,setProducts]=useState([])
    const router =useRouter()
    useEffect(()=>{
        async function load(){
            const data =await getProducts()

            const sorted =Array.isArray(data)
                    ?[...data].sort((a,b)=> a.price - b.price)
                    : []
            setProducts(sorted)
        }
        load()
    },[])
    return(
        <div className="products-page">
            <h1 className="products-title">All Products</h1>
                <p className="products-subtitle">
                    Discover our full collection
                </p>
            <div className="products-grid">
                {products.map(p=>(
                    <div key={p.id} className="product-card">
                        <div className="image-wrapper">
                            <img src={`/image/${p.image}`}  alt={p.name} />

                        </div>
                        <div className="product-info">
                                 <h3>{p.name}</h3>
                        <p className="price">{Number(p.price).toFixed(2)}$</p>
                                <button className="buy-btn" onClick={()=>router.push(`/product/${p.id}`)}>View Product</button>
                        </div>
                       
                        </div>
                ))}
            </div>
        </div>
    )
}