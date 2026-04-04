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

  const profileCompleteness = useMemo(() => {
    const fields = [
      user?.name,
      user?.email,
      user?.phone,
      user?.organization,
      user?.roleTitle,
      user?.location,
      user?.bio,
    ];
    const filled = fields.filter((value) => String(value || "").trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const priorityApplications = useMemo(() => {
    const scoreMap = {
      interview: 1,
      screening: 2,
      review: 3,
      pending: 4,
      delivered: 5,
      completed: 5,
      rejected: 6,
    };

    return [...applications]
      .sort((a, b) => {
        const statusA = String(a.status || "pending").toLowerCase();
        const statusB = String(b.status || "pending").toLowerCase();
        const scoreA = scoreMap[statusA] ?? 99;
        const scoreB = scoreMap[statusB] ?? 99;

        if (scoreA !== scoreB) {
          return scoreA - scoreB;
        }

        return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
      })
      .slice(0, 3);
  }, [applications]);

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
        <article className="portal-metric-card portal-metric-card-highlight">
          <p>Profile Strength</p>
          <strong>{profileCompleteness}%</strong>
          <span>
            {profileCompleteness >= 85
              ? "Excellent profile quality"
              : "Complete profile to increase shortlist chance"}
          </span>
        </article>
      </div>

      <div className="portal-priority-grid" aria-label="Career priorities">
        <article className="portal-priority-card portal-priority-card-focus">
          <p className="portal-priority-label">High Priority</p>
          <h2>Applications Needing Attention</h2>
          <p>
            Focus on interview and screening stages first to improve your
            conversion into offers.
          </p>
          <div className="portal-priority-list">
            {priorityApplications.length ? (
              priorityApplications.map((item) => (
                <div
                  key={item.id || `${item.role}-${item.submittedAt}`}
                  className="portal-priority-item"
                >
                  <div>
                    <h3>{item.role || "Applied Role"}</h3>
                    <p>{item.id || "Application"}</p>
                  </div>
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
              ))
            ) : (
              <p className="portal-inline-note">
                No active applications yet. Start with current openings.
              </p>
            )}
          </div>
        </article>

        <article className="portal-priority-card">
          <p className="portal-priority-label">Quick Actions</p>
          <h2>Move Faster</h2>
          <div className="portal-quick-grid">
            <Link to="/careers" className="portal-quick-card">
              <h3>Explore Roles</h3>
              <p>Browse all active job and internship opportunities.</p>
            </Link>
            <Link to="/portal?profile=edit" className="portal-quick-card">
              <h3>Update Profile</h3>
              <p>Increase match quality by keeping profile data fresh.</p>
            </Link>
            <Link to="/project/dashboard" className="portal-quick-card">
              <h3>Track Projects</h3>
              <p>Switch to your project delivery dashboard instantly.</p>
            </Link>
            <Link to="/portal" className="portal-quick-card">
              <h3>Portal Home</h3>
              <p>Access account controls and all dashboard modules.</p>
            </Link>
          </div>
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
              <div className="portal-inline-actions" style={{ marginTop: "0.6rem", flexWrap: "wrap" }}>
                {item.offerLetter?.downloadUrl ? (
                  <a
                    href={item.offerLetter.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`offer-letter-${item.id || "application"}.pdf`}
                    className="btn btn-secondary"
                  >
                    Download Offer Letter
                  </a>
                ) : item.offerLetter?.isSent ? (
                  <span className="portal-inline-note">Offer letter awaiting admin approval</span>
                ) : null}

                {item.certificate?.downloadUrl ? (
                  <a
                    href={item.certificate.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`certificate-${item.id || "application"}.pdf`}
                    className="btn btn-secondary"
                  >
                    Download Certificate
                  </a>
                ) : item.certificate?.isSent ? (
                  <span className="portal-inline-note">Certificate awaiting admin approval</span>
                ) : null}
              </div>
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
