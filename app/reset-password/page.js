"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import "../forgot-password/auth.css"

export default function ResetPassword(){
    const token = useSearchParams().get("token")
        const [password,setPassord]=useState("")
        const [msg,setMesg]=useState("")

        async function handleReset(e){
            e.preventDefault()
            const res=await fetch("http://localhost/ecommerce/reset-password.php",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"

                },
                body:JSON.stringify({
                    token,
                    password
                })
            })
            const data = await res.json()
            setMesg(data.message || data.error)
        }
        return(
            <div className="auth-container">
                <div className="auth-card">
                 <h1 className="auth-title">Reset Password</h1>
                
                    <form onSubmit={handleReset}>
                        <input  className="auth-input"
                            type="password"
                            placeholder="Nuova passord"
                            onChange={(e)=>setPassword(e.target.value)} />
                            <button className="auth-button">Reset</button>
                    </form>
                    {msg && <p className="auth.essage">{msg}</p>}
            </div>
            </div>
        )
    
}