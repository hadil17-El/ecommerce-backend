"use client"

import {useEffect,useState} from "react"
import Link from "next/link"
import {getOrders} from "../api/api"
import "./orders.css"

export default function OrdersPage(){
    const [orders,setOrders]=useState([])

    useEffect(()=>{
        async function load(){
        const data = await getOrders()
        setOrders(Array.isArray(data) ? data : []) 
        }
        load()
    },[])
function getStatusClass(status){
    if(status === "pending") return "status pending"
    if(status === "shipped") return "status shipped"
    if(status === "delivered") return "status delivered"
    return "status"
}
    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            {orders.length === 0 && (
                <p>No Orders yet</p>
            )}
            <div className="orders-grid">
                {orders.map(order => (
                    <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="order-card"
                    >
                        <div className="order-top">
                        <h3>Order :{order.id}</h3>
                        <span className={getStatusClass(order.status)}>
                            {order.status}
                        </span>
                        </div>
                        <div className="order-info">
                            <p>Total: ${order.total}</p>
                            <p>Date: {order.created_at || "N/A"}</p>{/**se non esiste allora mostra N/A */}
                        </div>
                        <div className="order-footer">
                            View details
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )

}
