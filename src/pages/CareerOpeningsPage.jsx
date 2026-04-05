import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import PortalSidebarLayout from "./PortalSidebarLayout";
import { clearPortalSession, getPortalUser } from "./portalAuthShared";
import { apiRequest } from "../lib/apiClient";

function CareerOpeningsPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadOpenings() {
      try {
        const result = await apiRequest("/careers/opportunities/public");
        if (!mounted) return;
        setOpenings(Array.isArray(result.items) ? result.items : []);
      } catch {
        if (!mounted) return;
        setOpenings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOpenings();
    return () => {
      mounted = false;
    };
  }, []);

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
        <SEO title="Openings" description="Current career openings." noindex={true} />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Openings</p>
            <h1>Career Opportunities</h1>
            <p>Browse current openings and apply from here.</p>
          </div>
          <div className="portal-dashboard-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/applications")}>
              Applications
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/documents")}>
              Documents
            </button>
            <Link className="btn btn-primary" to="/career/dashboard">
              Overview
            </Link>
          </div>
        </div>

        {loading ? <p className="portal-inline-note">Loading openings...</p> : null}

        <div className="portal-metric-grid" aria-label="Openings summary">
          <article className="portal-metric-card">
            <p>Total Openings</p>
            <strong>{openings.length}</strong>
            <span>Public opportunities currently available</span>
          </article>
          <article className="portal-metric-card">
            <p>Job Roles</p>
            <strong>{openings.filter((item) => item.type !== "internship").length}</strong>
            <span>Full-time and role-based opportunities</span>
          </article>
          <article className="portal-metric-card">
            <p>Internships</p>
            <strong>{openings.filter((item) => item.type === "internship").length}</strong>
            <span>Internship positions for trainees</span>
          </article>
          <article className="portal-metric-card portal-metric-card-highlight">
            <p>Application Ready</p>
            <strong>{user.access?.career ? "Yes" : "No"}</strong>
            <span>Career access is required for application tracking</span>
          </article>
        </div>

        <div className="portal-dashboard-grid">
          {openings.length ? (
            openings.map((opening) => (
              <article key={opening._id} className="portal-status-card">
                <div className="portal-status-head">
                  <p>{String(opening.type || "job").toUpperCase()}</p>
                  <span className="portal-status-pill portal-status-screening">Open</span>
                </div>
                <h3>{opening.title || "Career Opening"}</h3>
                <p className="portal-status-note">{opening.summary || "Open position details available on the careers page."}</p>
                <p className="portal-status-date">Location: {opening.location || "Not specified"}</p>
                <Link
                  to={`/careers/apply/${opening.type === "internship" ? "internship" : "job"}`}
                  className="btn btn-secondary"
                >
                  Apply Now
                </Link>
              </article>
            ))
          ) : (
            <article className="portal-status-card">
              <h3>No openings published yet</h3>
              <p className="portal-status-note">Check back later for updated roles.</p>
            </article>
          )}
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card">
            <p className="portal-priority-label">Application Prep</p>
            <h2>Before you apply</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Review profile</h3>
                <p>Ensure your contact and organization details are updated.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Track all submissions</h3>
                <p>Every applied role appears in applications page automatically.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Check approved docs</h3>
                <p>Offer letters and certificates are listed in documents page.</p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default CareerOpeningsPage;
