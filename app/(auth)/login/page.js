"use client"

import { useState } from "react"
import {useRouter} from "next/navigation"
import "./login.css"
import Link from "next/link"
export default function Login(){
    //Serve a salvare i dati del form.
    const [form,setForm]= useState({
        email:"",
        password:""
    })
    //Serve a salvare eventuali errori di login.
    const [error,setError] = useState("")
    //Serve a gestire lo stato di caricamento durante la richiesta di login.Serve per sapere se la richiesta login è in corso.stato iniziale è false :NON sta caricando
    const [loading,setLoading]=useState(false)
    const router = useRouter()
    //Funzione per gestire il login dell'utente.
    async function handleLogin(e){
        //Preveniamo il comportamento di default del form.
        /**Normalmente un form HTML:quando premi “submit”:ricarica la pagina
Quindi senza questa riga succederebbe:
👉 pagina refresh */
    e.preventDefault()
    //Iniziamo il processo di login, impostando lo stato di caricamento e resettando eventuali errori.
    /**Qui dici:

👉 “sta iniziando una richiesta al server”

Serve per la UI, per esempio:

disabilitare il bottone
mostrare “Loading...”
evitare doppi click

Esempio:

<button disabled={loading}>
Se non lo fai, l’utente può cliccare 10 volte → 10 richieste al server. */
    setLoading(true)
    /**Serve a pulire eventuali errori precedenti.

Esempio problema reale:

utente sbaglia password → appare errore
corregge password
rifà login

Se NON fai:

setError("")

l’errore vecchio resta visibile anche se il nuovo login potrebbe funzionare. */
    setError("")
    try{
        const res=await fetch("https://e-commerce.ifree.page/login.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(form)
        })
        const data = await res.json()
        if(data.error){
            setError(data.error)
            return
        }
        localStorage.setItem("token",data.token)
        localStorage.setItem("user",JSON.stringify(data.user))

        if(data.user.role === "admin"){
            router.push("/admin")
        } else {
            router.push("/")
        }
    } finally{
        setLoading(false)
    }
        
}
return(
      <div className="auth-page">
        <div className="auth-card">
        <h1>
        Welcome back
      </h1>
       <p>
Login to continue shopping
      </p>
        <form onSubmit={handleLogin}>
      <input
            placeholder="email"
            onChange={(e)=> setForm({...form,email:e.target.value})}
            />
       <input   
            type="password"
            placeholder="password"
            onChange={(e)=> setForm({...form,password:e.target.value})}
            />
            <button disabled={loading}>
                {loading ? "Loading..." : "Login"}
            </button>
          
    </form>
    {error && <p className="error">{error}</p>}
   
    <div className="auth-redirect">
        <span>Non hai un account</span>
          <Link href="/register" className="auth-redirect-link">Registrati</Link>
    </div>
      </div>
      </div>
  
)
}
