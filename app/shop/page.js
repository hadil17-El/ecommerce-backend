import {Suspense} from "react"
import Shop from "./Shop"
export default function ShopPage(){
    return(
        <Suspense fallback={<p>Loading...</p>}>
            <Shop />
        </Suspense>
    )
}