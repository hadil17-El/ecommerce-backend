"use client"
import Link from "next/link"

import { useEffect, useState } from "react"
import {usePathname, useRouter} from "next/navigation"
import {
    FaBoxOpen,FaClipboardList,FaUsers,FaChartLine,FaSignOutAlt,FaBars,
    FaTimes
} from "react-icons/fa"
import "./adminLayout.css"

export default function AdminLayout({
    children
}){

    const router = useRouter()
    const pathname = usePathname()
    const [collapsed,setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
   
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"))
        if(!user || user.role !== "admin"){
            router.push("/login")
        }

    },[])
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        router.push("/login")
    }
    const menu =[
        {
            name:"Dashboard",
            href:"/admin/dashboard",
            icon:<FaChartLine />
        },{
            name:"Products",
            href:"/admin/products",
            icon:<FaBoxOpen />
        },
        {
            name:"Orders",
            href:"/admin/orders",
            icon:<FaClipboardList />
        },{
            name:"Users",
            href:"/admin/users",
            icon:<FaUsers />
        }
    ]

    return(
        <div className="admin-layout">
            <button
                className="mobile-menu-btn"
                onClick={()=>setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>
                {mobileOpen
                        && (
                            <div className="sidbar-overlay"
                            onClick={()=>setMobileOpen(false)} />
                        )}
<aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
                    <div className="sidebar-logo">
                
                 <h2 className="sidbar-logo">{collapsed ? "U" :"ULTRASHOP"}</h2>
                 {mobileOpen && (
                    <button className={`collapse-btn ${mobileOpen ? "close-icon" : ""}`}
                            onClick={()=> setCollapsed(!collapsed)}>{collapsed ? <FaBars />  : <FaTimes />}</button>
                      
                 )}
                  
                      </div>     
                 <nav
                   className="sidebar-nav">
                    {menu.map((item)=>(
                            <Link href={item.href}
                                    key={item.href}
                                    className={`sidebar-link ${pathname === item.href ? "active" : ""}`}>
                                      <span className="sidebar-icon">{item.icon}</span>
                                      {!collapsed && (
                                        <span>{item.name}</span>
                                      )}  
                                    </Link>
                                   

                    ))}
        
                 </nav>

             
              </aside>
            <main style={{ flex:1,padding:"20px"}}>{children}</main>

        </div>
    )
}
