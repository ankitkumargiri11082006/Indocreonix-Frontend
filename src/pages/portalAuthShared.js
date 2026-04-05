import { apiBaseUrl } from "../lib/apiClient";

export const PORTAL_TOKEN_KEY = "indocx_portal_token";
export const PORTAL_USER_KEY = "indocx_portal_user";
export const PORTAL_SESSION_EXPIRES_AT_KEY = "indocx_portal_session_expires_at";
export const PORTAL_SESSION_DURATION_MS = 30 * 60 * 1000;

const API_BASE_URL = apiBaseUrl();

function notifyPortalSessionUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("portal-session-updated"));
  }
}

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

export function hasCareerAccess(user) {
  return Boolean(user?.access?.career);
}

export function hasProjectAccess(user) {
  return Boolean(user?.access?.project);
}

export function getPortalDashboardPath(user) {
  if (!user) return "/portal";

  const careerAllowed = hasCareerAccess(user);
  const projectAllowed = hasProjectAccess(user);

  if (user?.defaultDashboard === "project" && projectAllowed) {
    return "/project/dashboard";
  }

  if (user?.defaultDashboard === "career" && careerAllowed) {
    return "/career/dashboard";
  }

  if (careerAllowed) return "/career/dashboard";
  if (projectAllowed) return "/project/dashboard";

  return "/portal/home";
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
