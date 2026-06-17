export async function POST(request, { params }) {
    const path = (await params).path.join('/')
    const body = await request.text()
    
    const res = await fetch(`https://e-commerce.ifree.page/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
    })
    
    const data = await res.text()
    return new Response(data, {
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function GET(request, { params }) {
    const path = (await params).path.join('/')
    
    const res = await fetch(`https://e-commerce.ifree.page/${path}`)
    const data = await res.text()
    return new Response(data, {
        headers: { 'Content-Type': 'application/json' }
    })
}