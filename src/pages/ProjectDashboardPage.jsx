import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SEO from "../components/SEO";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
} from "./portalAuthShared";
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

  const dueSoon = useMemo(() => {
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + 14);

    return pending
      .filter((item) => {
        if (!item.eta) return false;
        const etaDate = new Date(item.eta);
        return etaDate >= today && etaDate <= threshold;
      })
      .slice(0, 3);
  }, [pending]);

  if (!user) {
    return <Navigate to="/portal" replace />;
  }

  return (
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
          <p>
            See what is pending, in progress, and delivered for your account.
          </p>
        </div>
        <div className="portal-dashboard-actions">
          <Link className="btn btn-secondary" to="/portal">
            All Dashboards
          </Link>
          <Link className="btn btn-secondary" to="/portal?profile=edit">
            Edit Profile
          </Link>
          <Link className="btn btn-secondary" to="/career/dashboard">
            Career Dashboard
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

      <div
        className="portal-metric-grid"
        aria-label="Project dashboard highlights"
      >
        <article className="portal-metric-card">
          <p>Total Orders</p>
          <strong>{projects.length}</strong>
          <span>All tracked project orders</span>
        </article>
        <article className="portal-metric-card">
          <p>Active Delivery</p>
          <strong>{pending.length}</strong>
          <span>Pending and in-progress items</span>
        </article>
        <article className="portal-metric-card">
          <p>Delivered</p>
          <strong>{delivered.length}</strong>
          <span>Completed outcomes for your account</span>
        </article>
        <article className="portal-metric-card portal-metric-card-highlight">
          <p>Due In 14 Days</p>
          <strong>{dueSoon.length}</strong>
          <span>Priority queue for upcoming deadlines</span>
        </article>
      </div>

      <div className="portal-priority-grid" aria-label="Project priorities">
        <article className="portal-priority-card portal-priority-card-focus">
          <p className="portal-priority-label">Deadline Focus</p>
          <h2>Upcoming Deliveries</h2>
          <p>
            Monitor what is due in the next two weeks to avoid schedule drift.
          </p>
          <div className="portal-priority-list">
            {dueSoon.length ? (
              dueSoon.map((item) => (
                <div key={item.id || item.name} className="portal-priority-item">
                  <div>
                    <h3>{item.name || "Project"}</h3>
                    <p>{item.id || "Order"}</p>
                  </div>
                  <span className="portal-status-pill portal-status-pending">
                    {item.eta || "TBD"}
                  </span>
                </div>
              ))
            ) : (
              <p className="portal-inline-note">
                No near-term deadlines in the next 14 days.
              </p>
            )}
          </div>
        </article>

        <article className="portal-priority-card">
          <p className="portal-priority-label">Quick Actions</p>
          <h2>Command Center</h2>
          <div className="portal-quick-grid">
            <Link to="/request-quote" className="portal-quick-card">
              <h3>Start New Project</h3>
              <p>Submit requirements and receive your custom quote.</p>
            </Link>
            <Link to="/portal?profile=edit" className="portal-quick-card">
              <h3>Update Contact Info</h3>
              <p>Keep delivery communication details up to date.</p>
            </Link>
            <Link to="/career/dashboard" className="portal-quick-card">
              <h3>Career Dashboard</h3>
              <p>Switch to your applications and hiring progress view.</p>
            </Link>
            <Link to="/portal" className="portal-quick-card">
              <h3>Portal Home</h3>
              <p>Return to central access and account controls.</p>
            </Link>
          </div>
        </article>
      </div>

      {loading ? (
        <p className="portal-inline-note">Loading project status...</p>
      ) : null}
      {error ? (
        <p className="portal-inline-note portal-inline-warning">{error}</p>
      ) : null}

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
    </section>
  );
}

export default ProjectDashboardPage;
