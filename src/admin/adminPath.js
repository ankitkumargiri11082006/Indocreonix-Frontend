function normalizeBasePath(value) {
  const raw = String(value || '').trim()
  if (!raw) return '/admin'
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  const withoutTrailingSlash = withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/g, '') : withLeadingSlash
  return withoutTrailingSlash || '/admin'
}

export const ADMIN_BASE_PATH = normalizeBasePath(import.meta.env.VITE_ADMIN_PATH || '/admin')

export function adminPath(subPath = '') {
  const clean = String(subPath || '').replace(/^\/+/, '')
  return clean ? `${ADMIN_BASE_PATH}/${clean}` : ADMIN_BASE_PATH
}
