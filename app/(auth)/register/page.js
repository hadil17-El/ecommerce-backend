"use client"
import { useState } from "react"
import "../login/login.css"
import { useRouter } from "next/navigation"
export default function RegisterPage(){
    const [form,setForm]=useState({
        email:"",
        password:""
    })
    const router = useRouter()
    async function handleRegister(e) {
        e.preventDefault()
        console.log("form: ",form)
try{
const res = await fetch("https://ecommerce-backend-uwgf.onrender.com/register", {            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(form)
        })
        const data = await res.json()

        if(data.error){
            alert(data.error)
            return
        }
        alert("Registrazione completata")
        
        router.push("/login")
}catch(err){
    console.error(err)
    alert("Errore durante la registrazione")
}}
    return(
         <div className="auth-page">
            <div className="auth-card">
            <h1>
            Create account
         </h1>
         <p>
Join our shop         </p>
<form
            onSubmit={handleRegister}>

            
              <h1>Register  </h1>
                <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e)=>
                                setForm({...form,email:e.target.value})
                        } />
                         <input
                        type="password"
                        value={form.password}
                        placeholder="Password"
                        onChange={(e)=>
                                setForm({...form,password:e.target.value})
                        } />
             <button type="submit">Register </button>            
        </form>
         </div>
         </div>
        
    )
}