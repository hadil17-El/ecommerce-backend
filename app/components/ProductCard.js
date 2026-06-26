import Image from "next/image"
import "./trends.css"
import  Link  from "next/link"
import { addToCart,getCart,toggleFavorite,getFavorites, removeFromCart, removeFavorite, addFavorite } from "../api/api"
import {useApp} from "../context/AppContext"
import HeartButton from "./HeartButton"
/**
quando la pagina si apre,react fa questo :1)giro(prima che arrivino i dati) e qiundi cartItem non esiste ancora  =undefined 2(giro (dopo useEffect) :trends fa getCart() arrivano i dati e react ridisegna tutto e quindi cartItems =[...] .il problema che tu stai facendo cartItems.some(...) ma .some() funziona solo su array e se è undefined allora crash .quindi perche si rompe ?perche react inizia sempre con dati vuoti 
=()=>{} questo signfica se nessuno passa setCartItems,usa una funzione vuota invece di undefined 
*/
//export default function ProductCard({product,cartItems=[],setCartItems=()=>{},loading,setLoading=()=>{}}){
export default function ProductCard({product}){
    const {cartItems,
            setCartItems,
            favorites,
            setFavorites} = useApp()
/**scorri tutto il carrello,se almeno un item ha lo stesso product_id di questo prodotto allora true ,altrimenti false
 * .some() si ferma al primo match trovato,non scorre tutto inutilmente, e Number() serve per essere sicuri che stiamo confrontando numeri e non stringhe,perche a volte i dati possono arrivare come stringhe anche se rappresentano numeri, e questo potrebbe causare problemi di confronto.
 */
 const isInCart= Array.isArray(cartItems) ? cartItems.some(
    item=>Number(item.product_id)=== Number(product.id)
 ) : false
 const isFav = Array.isArray(favorites) ? favorites.some(
    i => Number(i.id) === Number(product.id)
 ) : false
 /**cosa succede quando clicchi su "Add to cart":
  * 1 handleAddToCart parte : addToCart(product.id) fa una chiamata al backend per aggiungere il prodotto al carrello
  * 2 getCart() chiede al backend di restituire lo stato aggiornato del carrello dopo l'aggiunta
  * 3 setCartItems(Array.isArray(updated) ? updated : []) aggiorna lo stato locale del carrello con i dati restituiti dal backend, assicurandosi che sia un array valido prima di aggiornare lo stato.
  * 4 react ridisegna productcard con il nuovo cartItems
  *  e isInCart divent true e quindi il bottone cambia da "Add to cart" a "Added"
  */
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
             /**cui prima quando cliccavi su add to cart facevi questo:chiamata api (addtocart) poi aggiornavi solo lo stato local :setCartItems(prev=>[...prev,{product_id:product.id}])
         * pero adesso cosa abbiamo fatto: chiedo al backend cosa ce è davvero nel carrello (getCart) e aggiorno lo stato locale con quello che mi ha risposto il backend : setCartItems(Array.isArray(updated) ? updated : [])
         */
            await addToCart(product.id)
        }
       
        const updated = await getCart()
        setCartItems(Array.isArray(updated) ? updated : [])
        
    }
    async function handleFav(e){
        e.preventDefault()
        e.stopPropagation()
    await toggleFavorite(product.id)
    const updated = await getFavorites()
    setFavorites(updated)
    }

    return(
        <Link href={`/product/${product.id}`}>

        <div className="trend-card">
            
        <div className="trend-card-img-wrapper">
            <HeartButton productId={product.id} isFavorite={isFav} onToggle={handleFav}/>
                  {product.price < 40 && (
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

