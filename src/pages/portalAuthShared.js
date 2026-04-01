export const PORTAL_TOKEN_KEY = "indocx_portal_token";
export const PORTAL_USER_KEY = "indocx_portal_user";
export const PORTAL_SESSION_EXPIRES_AT_KEY = "indocx_portal_session_expires_at";
export const PORTAL_SESSION_DURATION_MS = 30 * 60 * 1000;

function notifyPortalSessionUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("portal-session-updated"));
  }
}

export function normalizeApiBaseUrl(rawBaseUrl) {
  const fallback = "http://localhost:5000/api";
  const candidate = (rawBaseUrl || fallback).trim();

  try {
    const url = new URL(candidate);
    const pathname = url.pathname.replace(/\/$/, "");
    const normalizedPath = pathname && pathname !== "/" ? pathname : "/api";
    return `${url.origin}${normalizedPath}`;
  } catch {
    const sanitized = candidate.replace(/\/$/, "");
    if (/\/api$/i.test(sanitized)) {
      return sanitized;
    }
    return `${sanitized}/api`;
  }
}

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export function getPortalUser() {
  const expiresAtRaw = localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY);
  if (!expiresAtRaw) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);

  if (Number.isNaN(expiresAt) || Date.now() >= expiresAt) {
    clearPortalSession();
    return null;
  }

  try {
    const raw = localStorage.getItem(PORTAL_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPortalSession({ token, user }) {
  if (token) {
    localStorage.setItem(PORTAL_TOKEN_KEY, token);
  }
  if (user) {
    localStorage.setItem(PORTAL_USER_KEY, JSON.stringify(user));
  }
  localStorage.setItem(
    PORTAL_SESSION_EXPIRES_AT_KEY,
    String(Date.now() + PORTAL_SESSION_DURATION_MS),
  );
  notifyPortalSessionUpdated();
}

export function clearPortalSession() {
  localStorage.removeItem(PORTAL_TOKEN_KEY);
  localStorage.removeItem(PORTAL_USER_KEY);
  localStorage.removeItem(PORTAL_SESSION_EXPIRES_AT_KEY);
  notifyPortalSessionUpdated();
}

export function updatePortalUser(patch = {}) {
  const currentUser = getPortalUser();
  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...patch,
    email: currentUser.email,
  };

  localStorage.setItem(PORTAL_USER_KEY, JSON.stringify(updatedUser));
  notifyPortalSessionUpdated();
  return updatedUser;
}

export async function portalRequest(path, options = {}) {
  const expiresAt = Number(
    localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY) || 0,
  );
  if (expiresAt && Date.now() >= expiresAt) {
    clearPortalSession();
    throw new Error("Session expired. Please sign in again.");
  }

  const token = localStorage.getItem(PORTAL_TOKEN_KEY);
  const isFormData = options?.body instanceof FormData;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const requestUrl = `${API_BASE_URL}${normalizedPath}`;

  return fetch(requestUrl, {
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  }).then(async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : {};

    if (!response.ok) {
      const error = new Error(
        data.message || `Request failed with status ${response.status}`,
      );
      error.status = response.status;
      if (response.status === 401) {
        clearPortalSession();
      }
      throw error;
    }

    return data;
  });
}
