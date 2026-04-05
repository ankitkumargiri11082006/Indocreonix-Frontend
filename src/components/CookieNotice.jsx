import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function hasConsentCookie() {
  if (typeof document === "undefined") return true;
  return document.cookie.split(";").some((part) => part.trim().startsWith("ic_cookie_consent=1"));
}

function setConsentCookie() {
  const secure = window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ic_cookie_consent=1; Max-Age=${180 * 24 * 60 * 60}; Path=/; SameSite=Lax${secure}`;
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
          We use cookies that are strictly necessary for security and to improve your experience. By continuing, you agree
          to our <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setConsentCookie();
            setVisible(false);
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

export default CookieNotice;
