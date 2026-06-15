// app/shop/page.js
import dynamic from "next/dynamic"

const Shop = dynamic(() => import("./Shop"), { ssr: false })

export default function ShopPage() {
    return <Shop />
}