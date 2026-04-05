import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
} from "./portalAuthShared";
import PortalSidebarLayout from "./PortalSidebarLayout";
import "./PortalPages.css";

const FALLBACK_PROJECTS = [
  {
    id: "ORD-2091",
    name: "Lead Automation CRM",
    status: "Pending",
    eta: "2026-04-09",
    owner: "Delivery Team A",
  },
  {
    id: "ORD-2084",
    name: "Client Portal Revamp",
    status: "Delivered",
    eta: "2026-03-20",
    owner: "Delivery Team B",
  },
];

function ProjectDashboardPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const result = await portalRequest("/portal/projects/me");
        if (!mounted) return;
        setProjects(Array.isArray(result.items) ? result.items : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        setProjects(FALLBACK_PROJECTS);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, [user]);

  const { pending, delivered } = useMemo(() => {
    const grouped = { pending: [], delivered: [] };
    projects.forEach((project) => {
      const status = String(project.status || "").toLowerCase();
      if (status === "delivered" || status === "completed") {
        grouped.delivered.push(project);
      } else {
        grouped.pending.push(project);
      }
    });
    return grouped;
  }, [projects]);

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  return (
    <PortalSidebarLayout
      user={user}
        onEditProfile={() => navigate("/portal/profile?edit=1")}
      onLogout={() => {
        clearPortalSession();
        setUser(null);
      }}
    >
      <section className="portal-dashboard-shell">
        <SEO
          title="Project Dashboard"
          description="Track pending and delivered projects."
          noindex={true}
        />
        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Project Dashboard</p>
            <h1>Delivery Tracker</h1>
            <p>See pending and delivered projects for your account.</p>
          </div>
          <div className="portal-dashboard-actions">
              <Link className="btn btn-secondary" to="/portal/profile?edit=1">
              Edit Profile
            </Link>
            <Link className="btn btn-secondary" to="/career/dashboard">
              Career Dashboard
            </Link>
            <Link className="btn btn-secondary" to="/request-quote">
              New Project
            </Link>
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

        {loading ? (
          <p className="portal-inline-note">Loading project status...</p>
        ) : null}
        {error ? (
          <p className="portal-inline-note portal-inline-warning">{error}</p>
        ) : null}

        <div className="portal-metric-grid" aria-label="Project summary">
          <article className="portal-metric-card">
            <p>Total Projects</p>
            <strong>{projects.length}</strong>
            <span>All orders linked to your account</span>
          </article>
          <article className="portal-metric-card">
            <p>Pending / Active</p>
            <strong>{pending.length}</strong>
            <span>Currently in delivery pipeline</span>
          </article>
          <article className="portal-metric-card">
            <p>Delivered</p>
            <strong>{delivered.length}</strong>
            <span>Completed project deliveries</span>
          </article>
          <article className="portal-metric-card portal-metric-card-highlight">
            <p>Request Support</p>
            <strong>24x7</strong>
            <span>Use new project for fresh requirements</span>
          </article>
        </div>

        <div className="portal-project-section">
          <h2>Pending / In Progress</h2>
          <div className="portal-dashboard-grid">
            {pending.length ? (
              pending.map((item) => (
                <article
                  key={item.id || item.name}
                  className="portal-status-card"
                >
                  <div className="portal-status-head">
                    <p>{item.id || "Order"}</p>
                    <span className="portal-status-pill portal-status-pending">
                      {item.status || "Pending"}
                    </span>
                  </div>
                  <h3>{item.name || "Project"}</h3>
                  <p className="portal-status-date">
                    Expected delivery: {item.eta || "TBD"}
                  </p>
                  <p className="portal-status-note">
                    Assigned: {item.owner || "Delivery Team"}
                  </p>
                </article>
              ))
            ) : (
              <article className="portal-status-card">
                <p className="portal-status-note">No pending projects found.</p>
              </article>
            )}
          </div>
        </div>

        <div className="portal-project-section">
          <h2>Delivered</h2>
          <div className="portal-dashboard-grid">
            {delivered.length ? (
              delivered.map((item) => (
                <article
                  key={item.id || item.name}
                  className="portal-status-card"
                >
                  <div className="portal-status-head">
                    <p>{item.id || "Order"}</p>
                    <span className="portal-status-pill portal-status-delivered">
                      {item.status || "Delivered"}
                    </span>
                  </div>
                  <h3>{item.name || "Project"}</h3>
                  <p className="portal-status-date">
                    Delivered on: {item.eta || "N/A"}
                  </p>
                  <p className="portal-status-note">
                    Owner: {item.owner || "Delivery Team"}
                  </p>
                </article>
              ))
            ) : (
              <article className="portal-status-card">
                <p className="portal-status-note">No delivered projects yet.</p>
              </article>
            )}
          </div>
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card">
            <p className="portal-priority-label">Project Guidance</p>
            <h2>Keep deliveries smooth</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Track ETA regularly</h3>
                <p>Pending cards include expected delivery date and owner.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Start a new request early</h3>
                <p>Create next project request before current cycle closes.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Sync profile details</h3>
                <p>Updated contact details speed up delivery communication.</p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default ProjectDashboardPage;
