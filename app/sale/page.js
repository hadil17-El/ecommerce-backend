"use client"

import {useEffect, useState} from "react"
import { getSaleProducts } from "../api/api"
import ProductCard from "../components/ProductCard"
import "./sale.css"
export default function Sale(){
    const [products,setProducts]=useState([])

 
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
       
        async function load(){
            const data = await getSaleProducts()
            setProducts(data)
            setLoading(false)
        }
        load()
    },[])

    return(
        <div className="sale-page">
            <div className="sale-header">
                <h1>Sale</h1>
                <p>Beat deals and discounts</p>
            </div>
            {loading ? (
                <p>Loading...</p>
            ):(
                <div className="sale-grid">
                    {products.map(p=>(
                          <ProductCard key={p.id} product={p} setProducts={setProducts}/>
                    ))}
                        </div>
            )}
        </div>
    )
}
