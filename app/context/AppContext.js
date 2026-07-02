"use client"
import { createContext,useContext,useState,useEffect } from "react"
import { getCart,getFavorites } from "../api/api"
const AppContext = createContext()
export function AppProvider({children}){
    const [cartItems,setCartItems]=useState([])
    const [favorites,setFavorites]=useState([])
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        async function load(){
            const cart = await getCart()
            const fav = await getFavorites()

            setCartItems(Array.isArray(cart) ? cart : [])
            setFavorites(Array.isArray(fav) ? fav : [])
            setLoading(false)
        }
        const storedUser = localStorage.getItem("user")
        if(!storedUser) {
            setLoading(false)
            return 
        }
      
       
        load()
    },[]) 
   
        <AppContext.Provider value={{
            cartItems,setCartItems,favorites,setFavorites,loading
        }}>
            {children}
        </AppContext.Provider>
    )
}
export function useApp(){
    return useContext(AppContext)
}
