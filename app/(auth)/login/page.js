"use client"

import { useState } from "react"
import {useRouter} from "next/navigation"
import "./login.css"
import Link from "next/link"
export default function Login(){

    const [form,setForm]= useState({
        email:"",
        password:""
    })
   
    const [error,setError] = useState("")
    const [loading,setLoading]=useState(false)
    const router = useRouter()
  async function handleLogin(e){
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
        const formData = new FormData()
        formData.append("email", form.email)
        formData.append("password", form.password)

     const res = await fetch("https://ecommerce-backend-uwgf.onrender.com/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: form.email,
        password: form.password
    })
})

        const data = await res.json()

        if(data.error){
            setError(data.error)
            return
        }

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        if(data.user.role === "admin"){
            router.push("/admin")
        } else {
            router.push("/")
        }

    } finally {
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
