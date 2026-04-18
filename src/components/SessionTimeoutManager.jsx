import { useEffect, useRef, useState } from "react";
import StatusModal from "./StatusModal";
import {
  ADMIN_SESSION_EXPIRES_AT_KEY,
  ADMIN_TOKEN_KEY,
  clearAdminSessionStorage,
  useAuth,
} from "../context/AuthContext";
import {
  clearPortalSession,
  PORTAL_SESSION_EXPIRES_AT_KEY,
  PORTAL_TOKEN_KEY,
} from "../pages/portalAuthShared";

function isScreenVisible() {
  if (typeof document === "undefined") return false;
  const visible = document.visibilityState === "visible";
  const focused = typeof document.hasFocus === "function" ? document.hasFocus() : true;
  return visible && focused;
}

function clearPortalSessionStorage() {
  clearPortalSession();
}

function SessionTimeoutManager() {
  const { setCurrentUser } = useAuth();
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const adminExpiredHandledRef = useRef(false);
  const portalExpiredHandledRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();

      const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
      const adminExpiresAt = Number(localStorage.getItem(ADMIN_SESSION_EXPIRES_AT_KEY) || 0);

      if (!adminToken) {
        adminExpiredHandledRef.current = false;
      } else if (adminExpiresAt > 0 && now >= adminExpiresAt && !adminExpiredHandledRef.current) {
        adminExpiredHandledRef.current = true;
        clearAdminSessionStorage();
        setCurrentUser(null);

        if (isScreenVisible()) {
          setModalState({
            isOpen: true,
            title: "Admin Session Expired",
            message:
              "For security, your admin session was automatically logged out after 30 minutes. Please sign in again.",
          });
        }
      }

      const portalToken = localStorage.getItem(PORTAL_TOKEN_KEY);
      const portalExpiresAt = Number(localStorage.getItem(PORTAL_SESSION_EXPIRES_AT_KEY) || 0);

      if (!portalToken) {
        portalExpiredHandledRef.current = false;
      } else if (
        portalExpiresAt > 0 &&
        now >= portalExpiresAt &&
        !portalExpiredHandledRef.current
      ) {
        portalExpiredHandledRef.current = true;
        clearPortalSessionStorage();

        if (isScreenVisible()) {
          setModalState({
            isOpen: true,
            title: "Session Expired",
            message:
              "For security, your portal session was automatically logged out after 30 minutes. Please sign in again.",
          });
        }
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [setCurrentUser]);

  return (
    <StatusModal
      isOpen={modalState.isOpen}
      onClose={() => setModalState((previous) => ({ ...previous, isOpen: false }))}
      title={modalState.title}
      message={modalState.message}
      type="error"
    />
  );
}

export default SessionTimeoutManager;
