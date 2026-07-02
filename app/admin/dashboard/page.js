"use client"
import { useEffect, useState } from "react"
import { getProducts,getAnalytics } from "../../api/api"
import "../adminPanel.css"
import {
    LineChart,Line,YAxis,XAxis,Tooltip,ResponsiveContainer
} from "recharts"
const salesData=[
  {month:"Jan",sales:400},
{month:"Feb",sales:900},
{month:"Mar",sales:1200},
{month:"Apr",sales:700},
{month:"May",sales:1000},
{month:"Jun",sales:1300},
{month:"Jul",sales:1500},
{month:"Aug",sales:1300},
{month:"Sep",sales:1600},
{month:"Oct",sales:1200},
{month:"Nov",sales:1700},
{month:"Dec",sales:2000}
]
const insights = [
    {type:"warnings",text:"Low stock products: 3"},
    {type:"success",text:"Sales increased by +18% this week"},
    {type:"info",text:"Most viewed product: Nike Air Max"}
]
export  default  function Dashboard(){
    
    const [products,setProducts]=useState([])
    const [stats,setStats]=useState({
        revenue:0,orders:0,users:0,products:0
    })
    useEffect(()=>{
   console.log("token:",localStorage.getItem("token"))
   console.log("user:",localStorage.getItem("user"))
        async function load(){
              try{
             const analytics = await getAnalytics()
        setStats(analytics)
            const data = await getProducts()
            setProducts(data)
        } catch(err){
            console.error("Failed to load dashboard data:",err)
        }
    }
        load()
    },[])

    return (
        <div className="dashboard-grid">
            <div className="chart-card">
                <div className="chart-header">
                    <h3>Sales Overview</h3>
                    <p>Last months performance</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={salesData}>
                        <XAxis datakey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#111" strokeWidth={2} dot={{ r: 3,fill:"#3d3d42"}} activeDot={{ r:6}} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="insights-box">
                    <h3>Insights</h3>
                    {insights.map((item,i)=>(
                        <div key={i} className={`insight ${item.type}`}>
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>
            <div className="stats-grid">
                <div className="stat-card revenue">
                    <h3>Total Revenue</h3>
                    <p>${stats.revenue}</p>
                </div>
                   <div className="stat-card orders">
                    <h3>Orders</h3>
                    <p>${stats.orders}</p>
                </div>
                   <div className="stat-card users">
                    <h3>Users</h3>
                    <p>{stats.users}</p>
                </div>
                   <div className="stat-card products">
                    <h3>Products</h3>
                    <p>{stats.products}</p>
                </div>
             
            </div>
      
        </div>
    )
}

