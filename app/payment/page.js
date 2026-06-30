"use client"
import {useEffect} from "react"
import {useRouter} from "next/navigation"
import {checkoutOrder} from "../api/api"

export default function PaymentPage(){
    const router = useRouter()

    useEffect(()=>{
        async function porcess(){
            try{
            const data=await checkoutOrder()

            if(!data || data.error){
                alert(data?.error || "Chckout failed")
                router.push("/cart")
                return
            }
            router.push(`/orders/${data.order_id}`)
        } catch (err){
            console.error(err)
            router.push("/cart")
        }}
    porcess()
},[])
return(
    <div style={{
        textAlign:"center",
        padding:"100px"
    }}>
        <h1>Processing Payment...</h1>
        <p>Please wait</p>
    </div>
)}