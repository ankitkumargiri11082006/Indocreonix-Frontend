import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("indocx_token");
    if (!token) {
      setLoading(false);
      return;
    }

    apiRequest("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => {
        localStorage.removeItem("indocx_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("indocx_token");
    if (!token) return undefined;

    let disposed = false;

    const syncUser = async () => {
      if (!localStorage.getItem("indocx_token")) return;

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
        localStorage.setItem("indocx_token", result.token);
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

        localStorage.setItem("indocx_token", result.token);
        setUser(result.user);
        return result.user;
      },
      logout() {
        localStorage.removeItem("indocx_token");
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
