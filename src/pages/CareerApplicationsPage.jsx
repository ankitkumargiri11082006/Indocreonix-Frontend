import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import PortalSidebarLayout from "./PortalSidebarLayout";
import { clearPortalSession, getPortalUser, portalRequest } from "./portalAuthShared";

function CareerApplicationsPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const statusCounts = applications.reduce(
    (acc, item) => {
      const status = String(item.status || "pending").toLowerCase();
      if (status.includes("interview")) acc.interview += 1;
      else if (status.includes("review") || status.includes("screen")) acc.review += 1;
      else if (status.includes("deliver") || status.includes("complete")) acc.completed += 1;
      else acc.pending += 1;
      return acc;
    },
    { pending: 0, review: 0, interview: 0, completed: 0 },
  );

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await portalRequest("/portal/career/applications/me");
        if (!mounted) return;
        setApplications(Array.isArray(result.items) ? result.items : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        setApplications([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadApplications();
    return () => {
      mounted = false;
    };
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
        <SEO title="Applications" description="Your submitted career applications." noindex={true} />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Applications</p>
            <h1>Your Submitted Roles</h1>
            <p>Only the applications tied to your account are shown here.</p>
          </div>
          <div className="portal-dashboard-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/documents")}>
              Documents
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/openings")}>
              Openings
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/career/dashboard")}>
              Overview
            </button>
          </div>
        </div>

        {loading ? <p className="portal-inline-note">Loading applications...</p> : null}
        {error ? <p className="portal-inline-note portal-inline-warning">{error}</p> : null}

        <div className="portal-metric-grid" aria-label="Application insights">
          <article className="portal-metric-card">
            <p>Total Applications</p>
            <strong>{applications.length}</strong>
            <span>All roles submitted by this account</span>
          </article>
          <article className="portal-metric-card">
            <p>In Review</p>
            <strong>{statusCounts.review}</strong>
            <span>Screening and review stages</span>
          </article>
          <article className="portal-metric-card">
            <p>Interviews</p>
            <strong>{statusCounts.interview}</strong>
            <span>Applications currently in interview rounds</span>
          </article>
          <article className="portal-metric-card portal-metric-card-highlight">
            <p>Completed</p>
            <strong>{statusCounts.completed}</strong>
            <span>Delivered or completed outcomes</span>
          </article>
        </div>

        <div className="portal-dashboard-grid">
          {applications.length ? (
            applications.map((item) => (
              <article key={item.id} className="portal-status-card">
                <div className="portal-status-head">
                  <p>{item.id || "Application"}</p>
                  <span className={`portal-status-pill portal-status-${String(item.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}>
                    {item.status || "Pending"}
                  </span>
                </div>
                <h3>{item.role || "Applied Role"}</h3>
                <p className="portal-status-date">Submitted: {item.submittedAt || "N/A"}</p>
                <p className="portal-status-note">{item.notes || "Status update will appear here."}</p>
              </article>
            ))
          ) : (
            <article className="portal-status-card">
              <h3>No applications yet</h3>
              <p className="portal-status-note">Apply to a role from the openings page.</p>
            </article>
          )}
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card">
            <p className="portal-priority-label">Application Tips</p>
            <h2>Improve your review pipeline</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Keep profile updated</h3>
                <p>Updated profile information helps recruiter communication.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Track status changes</h3>
                <p>Watch each card for timeline progress and latest notes.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Check documents</h3>
                <p>Approved letters and certificates appear in documents.</p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default CareerApplicationsPage;
