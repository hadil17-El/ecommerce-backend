"use client"
import Link from "next/link"

import { usePathname,useRouter } from "next/navigation"
import {FaHome,FaRegHeart} from "react-icons/fa"
import {FiShoppingBag} from "react-icons/fi"

import {IoIosLogOut } from "react-icons/io"
import "./navbar.css"
import { useEffect,useState } from "react"
export default function Navbar(){
     const router=useRouter()
         const pathname = usePathname()
     const [user,setUser]=useState(null)
     useEffect(()=>{
        const stored = localStorage.getItem("user")
        if(stored) {
            setUser(JSON.parse(stored))

        }
     },[])
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }
if(!user){
    return null
}

    return(
        <div className="navbar-container">
             <div className="navbar">

            <ul className="nav-list">
                <li className="nav-item">
                     <Link href="/" className={`nav-link ${pathname === "/" ? "active":""}`}>
           <FaHome size={20} />
            </Link>
                </li>
                <li>
                      <Link href="/favourite" className={`nav-link ${pathname === "/favourite" ? "active" : ""}`}>
            <FaRegHeart size={20} />
            </Link>
                </li>
                <li>
                     <Link href="/cart" className={`nav-link ${pathname === "/cart" ? "active" : ""}`}>
            <FiShoppingBag size={20} />
            </Link>
                </li>
        
                    <li>
                    <button onClick={logout}
                    className="nav-link logout-btn">
          <IoIosLogOut  size={20} />
            </button>
                </li>
            </ul>

           
           
              </div>
             
        </div>
    )
}
