function normalizeApiBaseUrl(rawBaseUrl) {
  const fallback = 'http://localhost:5000/api'
  const fromEnv = (rawBaseUrl || '').trim()

  const useLocalDevApi =
    typeof window !== 'undefined' &&
    import.meta.env.DEV &&
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) &&
    /onrender\.com/i.test(fromEnv)

  const candidate = useLocalDevApi ? fallback : (fromEnv || fallback)

  try {
    const url = new URL(candidate)
    const pathname = url.pathname.replace(/\/$/, '')
    const normalizedPath = pathname && pathname !== '/' ? pathname : '/api'
    return `${url.origin}${normalizedPath}`
  } catch {
    const sanitized = candidate.replace(/\/$/, '')
    if (/\/api$/i.test(sanitized)) {
      return sanitized
    }
    return `${sanitized}/api`
  }
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)

function normalizePath(path = '') {
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

function buildRequestUrl(path) {
  return `${API_BASE_URL}${normalizePath(path)}`
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('indocx_token')
  const isFormData = options?.body instanceof FormData
  const { timeoutMs = 30000, headers = {}, ...restOptions } = options
  const normalizedPath = normalizePath(path)
  const requestUrl = buildRequestUrl(normalizedPath)

  const controller = new AbortController()
  const timeoutId = typeof window !== 'undefined' ? window.setTimeout(() => controller.abort(), timeoutMs) : null

  try {
    const response = await fetch(requestUrl, {
      ...restOptions,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : {}

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`)
      error.status = response.status
      throw error
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.')
    }
    if (error instanceof TypeError) {
      throw new Error(`Network/CORS error while calling ${requestUrl}. Check VITE_API_BASE_URL and backend CORS_ORIGIN.`)
    }
    throw error
  } finally {
    if (timeoutId) {
      window.clearTimeout(timeoutId)
    }
  }
}

export function apiBaseUrl() {
  return API_BASE_URL
}
