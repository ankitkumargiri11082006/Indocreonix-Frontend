import { Navigate, useNavigate } from "react-router-dom";
import PortalSidebarLayout from "./PortalSidebarLayout";
import { clearPortalSession, getPortalUser } from "./portalAuthShared";
import ProjectRequestPage from "./ProjectRequestPage";

function PortalProjectRequestPage() {
  const user = getPortalUser();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <PortalSidebarLayout
      user={user}
      onEditProfile={() => navigate("/portal/profile")}
      onLogout={() => {
        clearPortalSession();
        navigate("/portal");
      }}
    >
      <ProjectRequestPage />
    </PortalSidebarLayout>
  );
}

export default PortalProjectRequestPage;
