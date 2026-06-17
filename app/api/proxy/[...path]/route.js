export async function POST(request, { params }) {
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')
    const body = await request.text()
    
    console.log('Proxy POST to:', path)
    console.log('Body:', body)
    
    const res = await fetch(`https://e-commerce.ifree.page/${path}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: body
    })
    
    const text = await res.text()
    console.log('Response:', text)
    
    return new Response(text, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function GET(request, { params }) {
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')
    
    const res = await fetch(`https://e-commerce.ifree.page/${path}`, {
        headers: { 'Accept': 'application/json' }
    })
    const text = await res.text()
    
    return new Response(text, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
    })
}