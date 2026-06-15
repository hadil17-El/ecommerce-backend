/**adeso stai usando context api per condividere dati tra tutti i component senza passare props dappertutto
 * il problema che avevi prima: prima ogni componente aveva il suo stato :const [cartItems,setCartItems] e ognuno aveva una copia diversa del carrello se aggiungevi un prodotto in trends si aggiornava solo trends e ad esempio shop non sapeva nulla 
 * cosa fa context api:context crea uno stato globale,quando aggiorni quel stato globale tutti i component che lo usano si aggiornano automaticamente con i nuovi dati : esempio se aggiungi un prodotto in trends e aggiorni il carrello globale allora shop che usa lo stesso stato globale del carrello si aggiorna automaticamente e mostra il nuovo prodotto aggiunto senza bisogno di passare props o fare chiamate extra al backend
 * come funziona:1)crei un contesto con createContext() 2)crei un provider che avvolge tutta l'app e fornisce i dati globali 3)usare useContext(AppContext) in qualsiasi componente per accedere ai dati globali
 */

"use client"
import { createContext,useContext,useState,useEffect } from "react"
import { getCart,getFavorites } from "../api/api"
const AppContext = createContext() //qui react crea il contenitore .per ora è vuoto
export function AppProvider({children}){//è il componente che riempie il contenitore con i dati globali e avvolge tutta l'app
    //sono i stati globali che vogliamo condividere tra i componenti : cartItems,favorites,loading.questi non appertengono piu a productCard.appartengon all intera app
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
            return //non fare chiamate se non loggato
        }
      
        //perche chiamiamo load() dentro useEffect invece di mettere tutto direttamente in useEffect? perche useEffect non può essere async direttamente,quindi dobbiamo creare una funzione async separata (load) e poi chiamarla dentro useEffect.
        //perche chiamiamo load() dentro useEffect inece di mettere tutto direttamente in useEffect? perche useEffect non può essere async direttamente,quindi dobbiamo creare una funzione async separata (load) e poi chiamarla dentro useEffect.
        //prima definiamo la funzione async load() che contiene tutte le chiamate asincrone e poi la chiamiamo dentro useEffect per eseguirla quando il componente si monta.
        load()
    },[]) //cosi riempie il context
    //quando il componente AppProvider si monta,esegue useEffect che chiama load() che a sua volta chiama getCart() e getFavorites() per ottenere i dati iniziali del carrello e dei preferiti dal backend. una volta ottenuti i dati,aggiorna lo stato globale con setCartItems e setFavorites, e imposta loading su false per indicare che i dati sono stati caricati. da questo momento in poi,tutti i componenti che usano questo contesto avranno accesso ai dati aggiornati del carrello e dei preferiti.
    //qui stai dicendo:tutti i component sotto di me possono usare questi dati globali : cartItems,setCartItems,favorites,setFavorites,loading
    return(
        <AppContext.Provider value={{
            cartItems,setCartItems,favorites,setFavorites,loading
        }}>
            {children}{/**qui significa che il provider avvolge tutti i componenti figli  = tutto l 'app*/}
        </AppContext.Provider>
    )
}
//questa è la funzione che i componenti useranno per accedere ai dati globali del contesto. invece di importare useContext e AppContext in ogni componente,puoi semplicemente importare useApp() e usarlo per ottenere i dati globali.
export function useApp(){
    return useContext(AppContext)
}