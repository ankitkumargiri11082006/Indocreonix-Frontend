function normalizeApiBaseUrl(rawBaseUrl) {
  const fallback = 'http://localhost:5000/api'
  const candidate = (rawBaseUrl || fallback).trim()

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
  const normalizedPath = normalizePath(path)
  const requestUrl = buildRequestUrl(normalizedPath)

  return fetch(requestUrl, {
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
        const error = new Error(data.message || `Request failed with status ${response.status}`)
        error.status = response.status
        throw error
      }

      return data
    })
    .catch((error) => {
      if (error instanceof TypeError) {
        throw new Error(`Network/CORS error while calling ${requestUrl}. Check VITE_API_BASE_URL and backend CORS_ORIGIN.`)
      }
      throw error
    })
}

export function apiBaseUrl() {
  return API_BASE_URL
}
