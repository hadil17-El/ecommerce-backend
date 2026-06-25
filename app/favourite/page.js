"use client"

import { useEffect } from "react"
import { useApp } from "../context/AppContext"
import { FaHeart } from "react-icons/fa"
import { getFavorites, removeFavorite } from "../api/api"
import ProductCard from "../components/ProductCard"
import "./favorites.css"
export default function Favourite(){
    const {favorites,setFavorites}=useApp()
    async function load() {
        const data=await getFavorites()
        setFavorites(Array.isArray(data) ? data : [])
    }
    useEffect(()=>{
        load()

    },[])
    async function remove(id){
        await removeFavorite(id)
        const updated = await getFavorites()
        setFavorites(Array.isArray(updated) ? updated : [])
        
        load()
    }
    return(
        <div className="favorites-page">
            <h1>
                <FaHeart size={24} />
        </h1>
        {favorites.length === 0 && (
            <p>
                No favorites yet
        </p>
        )}
        <div className="favorites-grid">
            {favorites.map(product =>(
                <div key={product.id} className="favorite-card">
                    <ProductCard product={product} />
                    <button
                        className="remove-btn"
                        onClick={()=>remove(product.id)}>
                            Remove
                        </button>
                        </div>
            ))}
        </div>
        </div>
    )
}