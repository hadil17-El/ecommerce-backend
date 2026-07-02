import Image from "next/image"
import "./trends.css"
import  Link  from "next/link"
import { addToCart,getCart,toggleFavorite,getFavorites, removeFromCart, removeFavorite, addFavorite } from "../api/api"
import {useApp} from "../context/AppContext"
import HeartButton from "./HeartButton"

export default function ProductCard({product}){
    const {cartItems,
            setCartItems,
            favorites,
            setFavorites} = useApp()

 const isInCart= Array.isArray(cartItems) ? cartItems.some(
    item=>Number(item.product_id)=== Number(product.id)
 ) : false
 const isFav = Array.isArray(favorites) ? favorites.some(
    i => Number(i.id) === Number(product.id)
 ) : false
 
    async function handleAddToCart(e){
        e.preventDefault()
        e.stopPropagation()
        if(isInCart){
            //trova l'id dell item nel carrello e rimuovilo 
            const cartItem = cartItems.find(
                item => Number(item.product_id) === Number(product.id)
            )
            await removeFromCart(cartItem.id)
        } else {
            
            await addToCart(product.id)
        }
       
        const updated = await getCart()
        setCartItems(Array.isArray(updated) ? updated : [])
        
    }
    async function handleFav(e){
        e.preventDefault()
        e.stopPropagation()
        const res = await toggleFavorite(product.id)
        setFavorites(prev=>{
            if(res.added){
                return[...prev,product]
            } else {
                return prev.filter(f=>f.id !== product.id)
            }
        })
  
    const updated = await getFavorites()
    setFavorites(updated)
    }

    return(
        <Link href={`/product/${product.id}`}>

        <div className="trend-card">
            
        <div className="trend-card-img-wrapper">
            <HeartButton productId={product.id} isFavorite={isFav} onToggle={handleFav}/>
                  {product.price <= 40 && (
                    <span className="sale-badge">SALE</span>
                  )}
                <Image src={`/image/${product.image}`} width={300} height={300} alt={product.name} />

        </div>
             <h2 className="trend-name">{product.name}</h2>
              <p className="trend-price">{product.price} $</p>
               <button
                        className={`quick-add ${isInCart ? "added" : ""}`}
                        onClick={handleAddToCart}>{isInCart ? "Added" :"Add to cart"}</button>
        </div>
        </Link>
    )
}

