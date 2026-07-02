"use client"

import ProductCard from "./ProductCard"
import Link from "next/link"
import "./trends.css"
import {Swiper,SwiperSlide} from "swiper/react"

import {
  useEffect,
  useState,
} from "react"

import {
  getLatestProducts,
  getCart
} from "../api/api"



export default function Trends(){

    const [products,setProducts] = useState([])
const [loading,setLoading]=useState(true)
 const [cartItems,setCartItems] = useState([])
 useEffect(()=>{
    async function loadCart(){
        const data = await getCart()
        if(!data || !Array.isArray(data)) return
        setCartItems(Array.isArray(data) ? data :[])
        setLoading(false)
    }
    loadCart()
   

 },[])
    useEffect(()=>{

        async function load(){

            const data =
              await getLatestProducts()

            setProducts(data)
        }

        load()

    },[])


    return(

        <div className="trends-section">

            <div className="trends-header">

                <h2 className="trends-title">
                    New Arrivals
                </h2>

            </div>



            <Swiper
                spaceBetween={15}
                slidesPerView={2.5}
                breakpoints={{
                    768:{slidesPerView:4},
                    1024:{slidesPerView: 5}
                }}
            >

                {products.map((product)=>(
                            <SwiperSlide key={product.id}>
                                         <ProductCard product={product}  />
                            </SwiperSlide>
                   
                ))}

            </Swiper>


 <div className="tend-div">
     <Link href="/products">

                <button className="trend-btn">
                    Show All
                </button>

            </Link>

 </div>
           
        </div>
    )
}
