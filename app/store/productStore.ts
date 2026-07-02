
import { Product } from "../type/product"
import {create} from "zustand"

type ProductState={
    products: Product[]
    setProducts:(p:Product[])=>void
    recommended: Product[]
    setRecommended:(p: Product[])=>void
}

export const useProductStore = create<ProductState>((set)=>({
    products:[],
    recommended:[],
    setProducts:(p)=>set({products: p}),
    setRecommended:(p)=> set({recommended:p})
    }))
