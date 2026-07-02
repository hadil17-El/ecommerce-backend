"use client"
import { useEffect, useState,useCallback } from "react";
import { useRouter } from "next/navigation";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../../api/api";
import "../adminPanel.css"
export default function AdminPanel(){
    const router = useRouter()
    
    const [products,setProducts]=useState([])
    const [form,setForm]=useState({
        name:"",
        price:"",
        image:"",
        category:"",
        gender:"",
        stock:0,
        sale:false
    })
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")
    const [editingProduct,setEditingProduct]=useState(null)
    const [showModal,setShowModal]=useState(false)

        const loadProducts=useCallback(async()=>{
            const data = await getProducts()
            setProducts(data)
        },[])
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"))

        if(!user || user.role !== "admin"){
            router.push("/login")
            return //perche return cui:
        }
        loadProducts()
    },[loadProducts])

    async function handleSubmit(e){
        e.preventDefault()
        setLoading(true)
        setError("")
        if(editingProduct){
            await updateProduct({
                ...form,
                id:editingProduct.id
            })
        } else{
             try{
            await addProduct(form)
            setForm({
                name:"",
                price:"",
                image:"",
                category:"",
                gender:"",
                stock:0,
                sale:false
            })
            await loadProducts()
        } catch {
            setError("Error durante l'aggiunta del prodotto.")
        } finally{
            setLoading(false)
        }

        }
       setEditingProduct(null)
       await loadProducts()
    }
 
    
async function handleDelete(id){
    if(!confirm("Sei sicuro di voler elminiare questo prodotto?")) return
    try{
      const result =  await deleteProduct(id)
      console.log("Risposta delete:",result)
        await loadProducts()
    } catch (err) {
        console.error("Error delte:",err)
        setError("Error durante l'eliminazione.")
    }
}
async function handleUpdate(){
    await updateProduct({
        ...form,
        id:editingProduct.id
    })
    setShowModal(false)
    setEditingProduct(null)
    setForm({name:"",price:"",image:"",category:"",gender:"",stock:0,sale:false})
    await loadProducts()
}
    return(
          <div className="admin-wrapper">
             <div className="admin-header">
                 <h1 className="admin-title">
                    Dashboard Admin
                 </h1>
                 <span className="admin-count">
                    {products.length} prodotti
                 </span>
             </div>

             <section className="admin-section">
                       <h2 className="admin-section-title">Aggiungi prodotto</h2>
                       {error &&        <p className="admin-error">{error}</p>}

                 <form   className="product-form"
                        onSubmit={handleSubmit}>
                            <div className="form-row">
                       <input 
                                className="form-input"
                                type="text"
                                placeholder="Nome prodotto"
                                value={form.name}
                                onChange={(e)=>setForm({...form,name:e.target.value}) }
                                />
                             <input 
                                className="form-input"
                                type="number"
                                placeholder="Prezzo ($)"
                                value={form.price}
                                onChange={(e)=> setForm({...form,price:e.target.value})}
                                />
                            </div>
                              <div className="form-row">
                       <input 
                                className="form-input"
                                type="text"
                                placeholder="URL immagine"
                                value={form.image}
                                onChange={(e)=>setForm({...form,image:e.target.value}) }
                                />
                           <input 
                                className="form-input"
                                type="text"
                                placeholder="category"
                                value={form.category}
                                onChange={(e)=>setForm({...form,category:e.target.value}) }
                                />
                               <input 
                                className="form-input"
                                type="text"
                                placeholder="gender"
    
                                value={form.gender}
                                onChange={(e)=>setForm({...form,gender:e.target.value}) }
                                />
                            </div>
                            <button className="btn-add" type="submit" disabled={loading}>
                                {loading ? "Aggiunta...":"+ Aggiungi prodotto"}
                                </button>
                        </form>
                                     </section>
                    <section className="admin-section">
                                     <h2 className="section-title">
                                        Prodotti ({products.length})
                                    </h2>
                                    <div className="product-table">
                                         <div className="table-head">
                                         <span>Prodotto</span>
                                          <span>Categoria</span>
                                           <span>Prezzo</span>
                                            <span>Azione</span>
                                    </div>
                                    {products.map((p)=>(
                                        <div className="table-row" key={p.id}>
                                            <span className="product-name">{p.name}</span>
                                          <span className="product-category">{p.category || "-"}</span>
                                           <span className="product-price">${p.price}</span>
                                            <div style={{ display:"flex",flexDirection:"column",gap:"5px"}}>
                                            <button className="btn-delete" onClick={()=> handleDelete(p.id)}>Elimina</button>
                                            <button className="btn-delete" onClick={()=> {
                                                setEditingProduct(p)
                                                setForm({
                                                    name:p.name ?? "",
                                                    price:p.price ?? "",
                                                    image:p.image ?? "",
                                                    category:p.category ?? "",
                                                    gender:p.gender ?? "",
                                                    stock:p.stock ?? 0,
                                                    sale:p.sale ?? false
                                                })
                                                setShowModal(true)
                                            }}>Modifica</button>

                                                    </div>
                                        </div>
                                    ))}
                                    </div>
                                     </section>     
                                     {showModal && (
                                        <div className="modal-overlay" onClick={()=> setShowModal(false)}>
                                            <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                                                <div className="modal-header">
                                                    <h2>Modifica</h2>
                                                    <button className="modal-close" onClick={()=> setShowModal(false)}>*</button>
                                                </div>
                                                <div className="modal-body">
                                                    <label>Prezzo ($)</label>
                                                    <input 
                                                        className="form-input"
                                                        type="number"
                                                        value={form.price}
                                                        onChange={(e)=> setForm({...form,price:e.target.value})} />
                                                        <label>Quantita / Stock</label>
                                                        <div className="quantity-row">
                                                            <button onClick={()=> setForm({...form,stock:Math.max(0,form.stock -1)})}>-</button>
                                                            <span>{form.stock}</span><button onClick={()=> setForm({...form,stock:Math.max(0,form.stock + 1)})}>+</button>
                                                        </div>
                                                        <label className="sale-label">
                                                                                  <input
                                                                                    type="checkbox"
                                                                                    checked={form.sale}
                                                                                  onChange={(e) => setForm({...form, sale: e.target.checked})}
                                                                                          />
                                                            <span>Badge SALE</span>
                                                            {form.sale && <span className="admin-sale-badge">SALE</span>}
                                                                </label>
                                                </div>
                                                <div className="modal-footer">
                                                    <button className="btn-cancel" onClick={()=>setShowModal(false)}>Annulla</button>
                                                    <button className="btn-save" onClick={handleUpdate}>Salva</button>
                                                </div>
                                                 </div>
                                                  </div>
                                     )}        
                     

          </div>
    )
}
