const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const inflightGetRequests = new Map()
const responseCache = new Map()
const DEFAULT_CACHE_TTL_MS = 4000

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('indocx_token')
  const isFormData = options?.body instanceof FormData
  const method = (options.method || 'GET').toUpperCase()
  const isGet = method === 'GET'
  const cacheKey = `${method}:${path}`
  const now = Date.now()

  if (isGet) {
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiry > now) {
      return cached.data
    }

    const inflight = inflightGetRequests.get(cacheKey)
    if (inflight) {
      return inflight
    }
  }

  const requestPromise = fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type') || ''
      const data = contentType.includes('application/json') ? await response.json() : {}

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      if (isGet) {
        responseCache.set(cacheKey, {
          data,
          expiry: Date.now() + DEFAULT_CACHE_TTL_MS,
        })
      }

      return data
    })
    .finally(() => {
      if (isGet) {
        inflightGetRequests.delete(cacheKey)
      }
    })

  if (isGet) {
    inflightGetRequests.set(cacheKey, requestPromise)
  }

  return requestPromise
}

export function apiBaseUrl() {
  return API_BASE_URL
}
