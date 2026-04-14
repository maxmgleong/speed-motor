export async function onRequest({ request, env }) {
  const url = new URL(request.url)
  const path = url.pathname

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (path === '/api/properties' && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT * FROM properties LIMIT 1').first()
      const data = result ? JSON.parse(result.data) : null
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/api/properties' && request.method === 'POST') {
      const body = await request.json()
      const data = JSON.stringify(body.properties)
      const now = new Date().toISOString()
      const existing = await env.DB.prepare('SELECT * FROM properties LIMIT 1').first()
      if (existing) {
        await env.DB.prepare('UPDATE properties SET data = ?, updated_at = ?').bind(data, now).run()
      } else {
        await env.DB.prepare('INSERT INTO properties (id, data, updated_at) VALUES (?, ?, ?)').bind('main', data, now).run()
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/api/tenants' && request.method === 'GET') {
      const result = await env.DB.prepare('SELECT * FROM tenants LIMIT 1').first()
      const data = result ? JSON.parse(result.data) : []
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/api/tenants' && request.method === 'POST') {
      const body = await request.json()
      const data = JSON.stringify(body.tenants)
      const now = new Date().toISOString()
      const existing = await env.DB.prepare('SELECT * FROM tenants LIMIT 1').first()
      if (existing) {
        await env.DB.prepare('UPDATE tenants SET data = ?, updated_at = ?').bind(data, now).run()
      } else {
        await env.DB.prepare('INSERT INTO tenants (id, data, updated_at) VALUES (?, ?, ?)').bind('main', data, now).run()
      }
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (path === '/api/upload' && request.method === 'POST') {
      const formData = await request.formData()
      const file = formData.get('file')
      const folder = formData.get('folder') || 'misc'
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      const ext = file.name.split('.').pop() || 'jpg'
      const filename = `${folder}/${Date.now()}.${ext}`
      await env.IMAGES.put(filename, file.stream(), { httpMetadata: { contentType: file.type } })
      const imageUrl = `https://pub-c56079a1c4064f1ca0e1c19a2c36d82.r2.dev/${filename}`
      return new Response(JSON.stringify({ url: imageUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
}
