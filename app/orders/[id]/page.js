"use client"
import {useEffect,useState} from "react";
import {useParams} from "next/navigation"
import { getOrderDetails } from "../../api/api"
import "./orderDetails.css"
export default function OrderDetails(){
    const {id} = useParams()
    const [data,setData] = useState(null)

    useEffect(()=>{
        
async function load(){
    try{
            const res = await getOrderDetails(id)
            setData(res)
        } catch (err){
            console.error(err)
        }
    }
        load()
    },[id])
    if(!data?.order) return <p>Loading...</p>
    return (
        <div className="order-details">
            <h1>Order #{data.order.id}</h1>

            <div className="order-items">
                {data.items?.map(item => (
                    <div key={item.id} className="order-item">
                        <img src={`/image/${item.image}`} />
                        <div>
                            <h3>{item.name}</h3>
                            <p>Qty:{item.quantity}</p>
                            <p>${item.price}</p>
                            </div>
                            </div>
                ))}
            </div>
            <h2 className="order-total">Total:${data.order.total}</h2>
        </div>
    )
}