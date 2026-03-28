import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SEO from "../components/SEO";
import {
  clearPortalSession,
  getPortalUser,
  portalRequest,
} from "./portalAuthShared";
import { apiRequest } from "../lib/apiClient";
import "./PortalPages.css";

const FALLBACK_APPLICATIONS = [
  {
    id: "CAR-001",
    role: "Frontend Engineer",
    status: "Screening",
    submittedAt: "2026-03-25",
    notes: "Resume reviewed, interview scheduling pending.",
  },
  {
    id: "CAR-002",
    role: "UI/UX Intern",
    status: "Interview",
    submittedAt: "2026-03-21",
    notes: "First interview completed, awaiting final review.",
  },
];

const FALLBACK_OPENINGS = [
  {
    _id: "role-internship",
    title: "UI/UX Internship",
    type: "internship",
    location: "Remote",
  },
  {
    _id: "role-job",
    title: "Frontend Developer",
    type: "job",
    location: "Hybrid",
  },
];

function CareerDashboardPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const [applications, setApplications] = useState([]);
  const [openings, setOpenings] = useState([]);
  const [openingFilter, setOpeningFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredOpenings = useMemo(() => {
    if (openingFilter === "all") {
      return openings;
    }
    return openings.filter(
      (opening) => String(opening.type || "").toLowerCase() === openingFilter,
    );
  }, [openings, openingFilter]);

  const openApplications = applications.filter((item) => {
    const status = String(item.status || "").toLowerCase();
    return (
      status !== "delivered" && status !== "completed" && status !== "rejected"
    );
  }).length;

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [applicationsResult, opportunitiesResult] = await Promise.all([
          portalRequest("/portal/career/applications/me"),
          apiRequest("/careers/opportunities/public"),
        ]);

        if (!mounted) return;
        setApplications(
          Array.isArray(applicationsResult.items)
            ? applicationsResult.items
            : [],
        );
        setOpenings(
          Array.isArray(opportunitiesResult.items)
            ? opportunitiesResult.items
            : [],
        );
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        setApplications(FALLBACK_APPLICATIONS);
        setOpenings(FALLBACK_OPENINGS);
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
    <section className="portal-dashboard-shell">
      <SEO
        title="Career Dashboard"
        description="Track your applications and progress."
        noindex={true}
      />
      <div className="portal-dashboard-topbar">
        <div>
          <p className="portal-kicker">Career Dashboard</p>
          <h1>Welcome, {user.name || "Candidate"}</h1>
          <p>
            Track every role you applied for and monitor hiring progress live.
          </p>
        </div>
        <div className="portal-dashboard-actions">
          <Link className="btn btn-secondary" to="/portal">
            All Dashboards
          </Link>
          <Link className="btn btn-secondary" to="/portal?profile=edit">
            Edit Profile
          </Link>
          <Link className="btn btn-secondary" to="/project/dashboard">
            Project Dashboard
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
        aria-label="Career dashboard highlights"
      >
        <article className="portal-metric-card">
          <p>Total Applications</p>
          <strong>{applications.length}</strong>
          <span>Across all hiring stages</span>
        </article>
        <article className="portal-metric-card">
          <p>Active Pipeline</p>
          <strong>{openApplications}</strong>
          <span>Profiles currently in review</span>
        </article>
        <article className="portal-metric-card">
          <p>Open Roles</p>
          <strong>{openings.length}</strong>
          <span>
            {openingFilter === "all"
              ? "All opportunities shown"
              : `Filtered by ${openingFilter}`}
          </span>
        </article>
      </div>

      {loading ? (
        <p className="portal-inline-note">Loading applications...</p>
      ) : null}
      {error ? (
        <p className="portal-inline-note portal-inline-warning">{error}</p>
      ) : null}

      <div className="portal-dashboard-grid">
        {applications.length ? (
          applications.map((item) => (
            <article
              key={item.id || `${item.role}-${item.submittedAt}`}
              className="portal-status-card"
            >
              <div className="portal-status-head">
                <p>{item.id || "Application"}</p>
                <span
                  className={`portal-status-pill portal-status-${String(
                    item.status || "pending",
                  )
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.status || "Pending"}
                </span>
              </div>
              <h3>{item.role || "Applied Role"}</h3>
              <p className="portal-status-date">
                Submitted: {item.submittedAt || "N/A"}
              </p>
              <p className="portal-status-note">
                {item.notes || "Status update will appear here."}
              </p>
            </article>
          ))
        ) : (
          <article className="portal-status-card">
            <h3>No applications yet</h3>
            <p className="portal-status-note">
              Apply to open roles and track progress from this dashboard.
            </p>
            <Link to="/careers" className="btn btn-primary">
              Explore Careers
            </Link>
          </article>
        )}
      </div>

      <div className="portal-project-section">
        <div className="portal-section-head">
          <h2>Available Openings</h2>
          <div
            className="portal-filter-row"
            role="tablist"
            aria-label="Opening filters"
          >
            {[
              { value: "all", label: "All" },
              { value: "job", label: "Jobs" },
              { value: "internship", label: "Internships" },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                type="button"
                role="tab"
                aria-selected={openingFilter === filterOption.value}
                className={
                  openingFilter === filterOption.value
                    ? "portal-filter-chip portal-filter-chip-active"
                    : "portal-filter-chip"
                }
                onClick={() => setOpeningFilter(filterOption.value)}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
        <div className="portal-dashboard-grid">
          {filteredOpenings.length ? (
            filteredOpenings.map((opening) => (
              <article
                key={opening._id}
                className="portal-status-card portal-opening-card"
              >
                <div className="portal-status-head">
                  <p>{String(opening.type || "job").toUpperCase()}</p>
                  <span className="portal-status-pill portal-status-screening">
                    Open
                  </span>
                </div>
                <h3>{opening.title || "Career Opening"}</h3>
                <p className="portal-status-note">
                  Location: {opening.location || "Not specified"}
                </p>
                <Link
                  to={`/careers/apply/${opening.type === "internship" ? "internship" : "job"}`}
                  className="btn btn-primary"
                >
                  Apply Now
                </Link>
              </article>
            ))
          ) : (
            <article className="portal-status-card">
              <p className="portal-status-note">
                No active openings found for this filter right now.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

export default CareerDashboardPage;
