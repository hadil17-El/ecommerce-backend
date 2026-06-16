

const BASE_URL="http://e-commerce.ifree.page/products.php"

function getAuthHeaders(){
    const token = localStorage.getItem("token")

    if(!token) return {
        "Content-Type":"application/json"
    }

    return {
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
    }
}
//get prodotti
export async function getProducts(){
    const res = await fetch(BASE_URL,{
        headers:getAuthHeaders()

    })
        return res.json()
}

//post aggiungi prodotto
export async function addProduct(product){
    const user = JSON.parse(localStorage.getItem("user"))
    const res=await fetch(BASE_URL,{
        method:"POST",
        headers:getAuthHeaders(),
        body:JSON.stringify({
            ...product,
        role:user.role
    })
    })
    return res.json()
}
//delete prodotto
export async function deleteProduct(id){
    const user = JSON.parse(localStorage.getItem("user"))
    const res=await fetch(`${BASE_URL}?id=${id}`,{
        method:"DELETE",
        headers:getAuthHeaders(),
        body: JSON.stringify({
            id,role:user.role
        })
    })
    return res.json()
}


export async function getLatestProducts(){
    const res = await fetch(
        `${BASE_URL}?latest=true`
    )
    if(!res.ok) return []
    const text = await res.text()
    if(!text) return []
    try{
        return JSON.parse(text)
    } catch{
        return []//gestisci html di error
    }
    return res.json()
}


const CART_URL ="http://e-commerce.ifree.page/cart.php"


export async function addToCart(product_id){
    const res = await fetch(CART_URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:
             `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            product_id
        })
       
    })
     return res.json()
}

export async function getCart(){
    const token = localStorage.getItem("token")
    if(!token) return [] //esci subito se non c' è token
    const res = await fetch(CART_URL,{
        headers:token
            ?{
            Authorization:
             `Bearer ${token}`
        } : {}
    })
    if(!res.ok) return [] //getisci 401 e altri errori
        return res.json()
}
export async function removeFromCart(id){
const res = await fetch(
    "http://e-commerce.ifree.page/cart.php",{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            Authorization:
             `Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({id})
    }
)
return res.json()
}
export async function getRecommendedProducts(userId){
    const res = await fetch(
        `http://e-commerce.ifree.page/products.php?recommended=1&user_id=${userId}`

    )
    if (!res.ok) return []
    const text = await res.text()//legge il body della risposta come stringa grezza,invece di parsarlo subito
    if(!text.trim()) return []//rimuove spazi e newline.se dopo il trim la stringa è vuota ,!text.trim() è true e ritorniamo subito un array vuoto invece di andare in errore
    return JSON.parse(text)//converte la stringa json in un og/array che è l'equivalente di res.json() cosi ora siamo sicuri che text non è vuoto
    //return await res.json() il mio problema è che il server risponde con status 200 ma body vuoto
}
export async function updateProduct(product){
    const user =JSON.parse(localStorage.getItem("user"))
    const res =await fetch(BASE_URL,{
        method:"PUT",
        headers:getAuthHeaders(),
        body:JSON.stringify({
            ...product,
            role:user.role
        })
    })
    return res.json()
}
export async function getUsers() {
    const res = await fetch(
        "http://e-commerce.ifree.page/users.php",
        {
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        }
    )
    return res.json()
}


export async function getAnalytics() {
    const res = await fetch(
        "http://e-commerce.ifree.page/analytics.php",
        {
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    )
  const text = await res.text() //leggi come testo
  console.log("analytics raw: ",text)
  try{
    return JSON.parse(text)
  } catch {
    return{}
  }
}
export async function updateCartQuantity(id, action) {
    const res = await fetch("http://e-commerce.ifree.page/cart.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            id,
            action
        })
    })

    return res.json()
}

const FAVORITES_URL = "http://e-commerce.ifree.page/favorites.php"

// GET
export async function getFavorites(){
    const token = localStorage.getItem("token")
    if(!token) return [] //esci subito se non c'è token
    const res = await fetch(FAVORITES_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    if(!res.ok) return []
    return res.json()
}

// ADD
export async function addFavorite(product_id){
    const res = await fetch(FAVORITES_URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ product_id })
    })
    return res.json()
}

// DELETE
export async function removeFavorite(product_id){
    const res = await fetch(FAVORITES_URL, {
        method: "DELETE",
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ product_id })
    })
    return res.json()
}
export async function toggleFavorite(product_id){
    const res = await fetch("http://e-commerce.ifree.page/favorites.php", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            Authorization:`Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ product_id })
    })

    return res.json()
}
export async function getProductsByGender(gender){
    const res = await fetch(
        `http://e-commerce.ifree.page/products.php?gender=${gender}`
    )
    return res.json()
}
export async function getProductsByCategory(category){
    const res = await fetch(
        `http://e-commerce.ifree.page/products.php?category=${category}`
    )
    return res.json()
}
export async function getSaleProducts(){
    const res = await fetch(
        "http://e-commerce.ifree.page/products.php?sale=true"
    )
    return res.json()
}
export async function searchProducts(query){
    const res = await fetch(
        `http://e-commerce.ifree.page/products.php?search=${query}`
    )
    const text =await res.text()
    if(!text) return []
    return JSON.parse(text)
}
export async function getOrders(){
    const res =await fetch("http://e-commerce.ifree.page/orders.php",{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
    return res.json()
}
export async function getOrderDetails(id){
    const res = await fetch(`http://e-commerce.ifree.page/orders.php?id=${id}`,{
        headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        })
            return res.json()
}
export async function checkoutOrder(){
const res=await fetch(
    "http://e-commerce.ifree.page/checkout.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${localStorage.getItem("token")}`
        },
        body:JSON.stringify({
            checkout:true
        })
    }
)
return res.json()
}