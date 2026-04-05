import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { clearPortalSession, getPortalUser, portalRequest } from "./portalAuthShared";
import PortalSidebarLayout from "./PortalSidebarLayout";

function PortalHomePage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSummary() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [applicationsResult, projectsResult] = await Promise.all([
          portalRequest("/portal/career/applications/me"),
          portalRequest("/portal/projects/me"),
        ]);

        if (!mounted) return;
        setApplications(Array.isArray(applicationsResult.items) ? applicationsResult.items : []);
        setProjects(Array.isArray(projectsResult.items) ? projectsResult.items : []);
      } catch {
        if (!mounted) return;
        setApplications([]);
        setProjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSummary();
    return () => {
      mounted = false;
    };
  }, [user]);

  const approvedDocuments = useMemo(
    () =>
      applications.filter(
        (item) => item.offerLetter?.isApproved || item.certificate?.isApproved,
      ).length,
    [applications],
  );

  const recentActivities = useMemo(() => {
    const appActivities = applications.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.role || "Application",
      type: "Application",
      status: item.status || "Pending",
      date: item.submittedAt || "",
    }));

    const projectActivities = projects.slice(0, 3).map((item) => ({
      id: item.id,
      title: item.name || "Project",
      type: "Project",
      status: item.status || "In Progress",
      date: item.updatedAt || item.eta || "",
    }));

    return [...appActivities, ...projectActivities].slice(0, 5);
  }, [applications, projects]);

  const profileReadiness = useMemo(() => {
    const fields = [
      user?.name,
      user?.phone,
      user?.organization,
      user?.roleTitle,
      user?.location,
      user?.bio,
    ];
    const completed = fields.filter((value) => String(value || "").trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [user]);

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <PortalSidebarLayout
      user={user}
      onEditProfile={() => navigate("/portal/profile")}
      onLogout={() => {
        clearPortalSession();
        setUser(null);
      }}
    >
      <section className="portal-dashboard-shell">
        <SEO title="Portal Home" description="Account overview and quick access." noindex={true} />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Portal Home</p>
            <h1>Welcome, {user.name || "User"}</h1>
            <p>Use the sidebar to move between your account sections.</p>
          </div>
          <div className="portal-dashboard-actions">
            <Link className="btn btn-secondary" to="/portal/profile">
              Profile
            </Link>
            <Link className="btn btn-secondary" to="/career/dashboard">
              Career Dashboard
            </Link>
            {user?.access?.project ? (
              <Link className="btn btn-secondary" to="/project/dashboard">
                Project Dashboard
              </Link>
            ) : null}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                clearPortalSession();
                setUser(null);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? <p className="portal-inline-note">Loading summary...</p> : null}

        <div className="portal-metric-grid" aria-label="Portal summary">
          <article className="portal-metric-card">
            <p>Applications</p>
            <strong>{applications.length}</strong>
            <span>Your submitted career applications</span>
          </article>
          <article className="portal-metric-card">
            <p>Projects</p>
            <strong>{projects.length}</strong>
            <span>Your active and delivered project orders</span>
          </article>
          <article className="portal-metric-card">
            <p>Approved Docs</p>
            <strong>{approvedDocuments}</strong>
            <span>Offer letters and certificates ready to download</span>
          </article>
          <article className="portal-metric-card portal-metric-card-highlight">
            <p>Account</p>
            <strong>{user.access?.career || user.access?.project ? "Enabled" : "Limited"}</strong>
            <span>Career and project access status</span>
          </article>
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card portal-priority-card-focus">
            <p className="portal-priority-label">Career</p>
            <h2>Application Center</h2>
            <p>Check status, move to documents, or browse openings.</p>
            <div className="portal-quick-grid">
              <Link to="/career/applications" className="portal-quick-card">
                <h3>Applications</h3>
                <p>View only the roles you submitted.</p>
              </Link>
              <Link to="/career/documents" className="portal-quick-card">
                <h3>Documents</h3>
                <p>Download approved offer letters and certificates.</p>
              </Link>
              <Link to="/career/openings" className="portal-quick-card">
                <h3>Openings</h3>
                <p>Browse current career opportunities.</p>
              </Link>
            </div>
          </article>

          <article className="portal-priority-card">
            <p className="portal-priority-label">Project</p>
            <h2>Delivery Center</h2>
            <p>Switch to project tracking or start a new request.</p>
            <div className="portal-quick-grid">
              {user?.access?.project ? (
                <Link to="/project/dashboard" className="portal-quick-card">
                  <h3>Project Dashboard</h3>
                  <p>See project progress at a glance.</p>
                </Link>
              ) : null}
              <Link to="/portal/project/request" className="portal-quick-card">
                <h3>New Project</h3>
                <p>Start a fresh project request.</p>
              </Link>
              <Link to="/portal/profile" className="portal-quick-card">
                <h3>Profile</h3>
                <p>Update contact and account details.</p>
              </Link>
            </div>
          </article>
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card portal-priority-card-focus">
            <p className="portal-priority-label">Recent Activity</p>
            <h2>Latest updates across your workspace</h2>
            <div className="portal-quick-grid">
              {recentActivities.length ? (
                recentActivities.map((entry) => (
                  <article key={`${entry.type}-${entry.id || entry.title}`} className="portal-quick-card">
                    <h3>{entry.title}</h3>
                    <p>{entry.type} • {entry.status}</p>
                    <p>{entry.date || "Recent update"}</p>
                  </article>
                ))
              ) : (
                <article className="portal-quick-card">
                  <h3>No recent updates</h3>
                  <p>Once you apply or request a project, activity appears here.</p>
                </article>
              )}
            </div>
          </article>

          <article className="portal-priority-card">
            <p className="portal-priority-label">Account Health</p>
            <h2>Readiness and quick recommendations</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Profile Readiness</h3>
                <p>{profileReadiness}% completed profile details.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Career Access</h3>
                <p>{user.access?.career ? "Enabled" : "Disabled"} for applications and documents.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Project Access</h3>
                <p>{user.access?.project ? "Enabled" : "Disabled"} for dashboard and requests.</p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default PortalHomePage;
