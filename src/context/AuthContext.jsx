import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/apiClient";

const AuthContext = createContext(null);

export const ADMIN_TOKEN_KEY = "indocx_token";
export const ADMIN_SESSION_EXPIRES_AT_KEY = "indocx_admin_session_expires_at";
export const ADMIN_SESSION_DURATION_MS = 30 * 60 * 1000;

export function setAdminSessionExpiry() {
  localStorage.setItem(
    ADMIN_SESSION_EXPIRES_AT_KEY,
    String(Date.now() + ADMIN_SESSION_DURATION_MS),
  );
}

export function clearAdminSessionStorage() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_SESSION_EXPIRES_AT_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    const expiresAtRaw = localStorage.getItem(ADMIN_SESSION_EXPIRES_AT_KEY);
    const expiresAt = Number(expiresAtRaw || 0);

    if (expiresAtRaw && (!Number.isFinite(expiresAt) || Date.now() >= expiresAt)) {
      clearAdminSessionStorage();
      setUser(null);
      setLoading(false);
      return;
    }

    if (!expiresAtRaw) {
      setAdminSessionExpiry();
    }

    apiRequest("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => {
        clearAdminSessionStorage();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return undefined;

    let disposed = false;

    const syncUser = async () => {
      if (!localStorage.getItem(ADMIN_TOKEN_KEY)) return;

      const expiresAt = Number(
        localStorage.getItem(ADMIN_SESSION_EXPIRES_AT_KEY) || 0,
      );
      if (expiresAt && Date.now() >= expiresAt) {
        clearAdminSessionStorage();
        setUser(null);
        return;
      }

      try {
        const result = await apiRequest("/auth/me");
        if (!disposed) {
          setUser(result.user);
        }
      } catch {
        // Keep existing session state on transient sync failures.
      }
    };

    const onFocus = () => {
      syncUser();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncUser();
      }
    };

    const intervalId = window.setInterval(syncUser, 60000);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  async function refreshUser() {
    const result = await apiRequest("/auth/me");
    setUser(result.user);
    return result.user;
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(email, password) {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
        setAdminSessionExpiry();
        setUser(result.user);
        return result.user;
      },
      async loginWithGoogle(credential) {
        if (!credential) {
          throw new Error("Google credential is missing");
        }

        const result = await apiRequest("/auth/google", {
          method: "POST",
          body: JSON.stringify({ credential }),
        });

        if (!result?.token || !result?.user) {
          throw new Error("Invalid Google login response from server");
        }

        localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
        setAdminSessionExpiry();
        setUser(result.user);
        return result.user;
      },
      logout() {
        clearAdminSessionStorage();
        setUser(null);
      },
      setCurrentUser(nextUser) {
        setUser(nextUser);
      },
      refreshUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
