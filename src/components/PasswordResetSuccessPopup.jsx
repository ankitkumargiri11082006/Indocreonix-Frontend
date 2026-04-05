import { useNavigate } from "react-router-dom";
import "./PasswordResetSuccessPopup.css";
import { adminPath } from "../admin/adminPath";

function PasswordResetSuccessPopup({ isOpen, isAdminPortal = false }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  function handleLogin() {
    if (isAdminPortal) {
      navigate(adminPath('login'));
    } else {
      navigate("/portal?mode=signin");
    }
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="success-icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
        </div>

        <h2 className="popup-title">Password Updated Successfully!</h2>

        <p className="popup-message">
          Your password has been reset successfully. You can now log in with
          your new password.
        </p>

        <button
          onClick={handleLogin}
          className="btn btn-primary popup-btn"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default PasswordResetSuccessPopup;
