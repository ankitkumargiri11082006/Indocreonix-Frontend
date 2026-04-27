import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getConsentCookieValue() {
  if (typeof document === "undefined") return null;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("ic_cookie_consent="))
    ?.split("=")[1] ?? null;
}

function hasConsentCookie() {
  return getConsentCookieValue() !== null;
}

function setConsentCookie(value) {
  const secure = window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ic_cookie_consent=${value}; Max-Age=${180 * 24 * 60 * 60}; Path=/; SameSite=Lax${secure}`;
}

function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentCookie());
  }, []);

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie notice">
      <div className="cookie-banner-inner">
        <p>
          We use cookies that are strictly necessary for security and to improve your experience. You can accept or decline optional cookies.
          Read our <Link to="/privacy-policy">Privacy Policy</Link> for details.
        </p>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setConsentCookie(0);
              setVisible(false);
            }}
          >
            Decline
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setConsentCookie(1);
              setVisible(false);
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieNotice;
