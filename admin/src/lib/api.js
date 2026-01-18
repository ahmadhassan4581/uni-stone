const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function apiFetch(path, options = {}, token) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    ...options,
    headers,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const msg = body?.message || (typeof body === 'string' ? body : '') || `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.body = body
    throw err
  }

  return body
}
