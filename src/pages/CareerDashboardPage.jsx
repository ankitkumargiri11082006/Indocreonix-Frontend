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

function CareerDashboardPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const approvedOfferLetters = useMemo(
    () =>
      applications
        .filter((item) => item.offerLetter?.downloadUrl && item.offerLetter?.isApproved)
        .map((item) => ({
          id: item.id,
          title: item.role || "Applied Role",
          downloadUrl: item.offerLetter.downloadUrl,
          submittedAt: item.submittedAt || "",
        })),
    [applications],
  );

  const approvedCertificates = useMemo(
    () =>
      applications
        .filter((item) => item.certificate?.downloadUrl && item.certificate?.isApproved)
        .map((item) => ({
          id: item.id,
          title: item.role || "Applied Role",
          downloadUrl: item.certificate.downloadUrl,
          submittedAt: item.submittedAt || "",
        })),
    [applications],
  );

  const activeApplications = useMemo(
    () =>
      applications.filter((item) => {
        const status = String(item.status || "").toLowerCase();
        return status !== "delivered" && status !== "completed" && status !== "rejected";
      }).length,
    [applications],
  );

  const approvedDocuments = approvedOfferLetters.length + approvedCertificates.length;

  const approvedDocumentsList = useMemo(
    () => [
      ...approvedOfferLetters.map((item) => ({
        id: `offer-${item.id}`,
        title: item.title,
        type: "Offer Letter",
        downloadUrl: item.downloadUrl,
        submittedAt: item.submittedAt,
      })),
      ...approvedCertificates.map((item) => ({
        id: `certificate-${item.id}`,
        title: item.title,
        type: "Certificate",
        downloadUrl: item.downloadUrl,
        submittedAt: item.submittedAt,
      })),
    ],
    [approvedCertificates, approvedOfferLetters],
  );

  const recentApplications = useMemo(() => applications.slice(0, 3), [applications]);

  const statusTone = (status) => {
    const normalized = String(status || "").toLowerCase();
    if (["delivered", "completed"].includes(normalized)) return "delivered";
    if (normalized === "rejected") return "completed";
    if (normalized === "interview") return "interview";
    if (normalized === "screening") return "screening";
    if (normalized === "review") return "review";
    return "in-progress";
  };

  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const applicationsResult = await portalRequest("/portal/career/applications/me");

        if (!mounted) return;
        setApplications(Array.isArray(applicationsResult.items) ? applicationsResult.items : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
        setApplications(FALLBACK_APPLICATIONS);
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
      onEditProfile={() => navigate("/portal/profile?edit=1")}
      onLogout={() => {
        clearPortalSession();
        setUser(null);
      }}
    >
      <section className="portal-dashboard-shell portal-career-dashboard-shell">
        <SEO
          title="Career Dashboard"
          description="Track your applications, approved documents, and openings."
          noindex={true}
        />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Career Command Center</p>
            <h1>Welcome, {user.name || "Candidate"}</h1>
            <p>Monitor your applications, open roles, and approved documents from one place.</p>
          </div>
          <div className="portal-dashboard-actions">
            <Link className="btn btn-secondary" to="/project/dashboard">
              Project Dashboard
            </Link>
            <Link className="btn btn-secondary" to="/career/applications">
              Applications
            </Link>
            <Link className="btn btn-secondary" to="/career/documents">
              Documents
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

        {loading ? <p className="portal-inline-note">Loading applications...</p> : null}
        {error ? <p className="portal-inline-note portal-inline-warning">{error}</p> : null}

        <div className="portal-dashboard-grid" aria-label="Career overview panels">
          <article className="portal-status-card portal-opening-card">
            <div className="portal-status-head">
              <p>Applications</p>
              <span className="portal-status-pill portal-status-review">{applications.length} total</span>
            </div>
            <h3>Active application queue</h3>
            <p className="portal-status-note">
              {activeApplications} submissions are still moving through review.
            </p>
            <div className="portal-priority-list">
              {recentApplications.length ? recentApplications.map((item) => (
                <article key={item.id} className="portal-priority-item">
                  <div>
                    <h3>{item.role || "Applied Role"}</h3>
                    <p>{item.submittedAt ? `Submitted ${item.submittedAt}` : "Submission date not set"}</p>
                  </div>
                  <span className={`portal-status-pill portal-status-${statusTone(item.status)}`}>
                    {item.status || "Pending"}
                  </span>
                </article>
              )) : (
                <p className="portal-status-note">No applications found yet.</p>
              )}
            </div>
            <div className="portal-quick-grid">
              <Link to="/career/applications" className="portal-quick-card">
                <h3>Applications</h3>
                <p>Open your submissions.</p>
              </Link>
              <Link to="/career/openings" className="portal-quick-card">
                <h3>Openings</h3>
                <p>Review live opportunities.</p>
              </Link>
            </div>
          </article>

          <article className="portal-status-card">
            <div className="portal-status-head">
              <p>Documents</p>
              <span className="portal-status-pill portal-status-completed">{approvedDocuments} ready</span>
            </div>
            <h3>Approved downloads</h3>
            <p className="portal-status-note">
              Offer letters and certificates appear here once they are approved.
            </p>
            <div className="portal-priority-list">
              {approvedDocumentsList.length ? approvedDocumentsList.map((item) => (
                <article key={item.id} className="portal-priority-item">
                  <div>
                    <h3>{item.type}</h3>
                    <p>{item.title}</p>
                  </div>
                  <a className="btn btn-secondary" href={item.downloadUrl} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </article>
              )) : (
                <p className="portal-status-note">No approved documents yet.</p>
              )}
            </div>
            <div className="portal-quick-grid">
              <Link to="/career/documents" className="portal-quick-card">
                <h3>Documents</h3>
                <p>See all approved files.</p>
              </Link>
              <Link to="/portal/profile" className="portal-quick-card">
                <h3>Profile</h3>
                <p>Update your account details.</p>
              </Link>
            </div>
          </article>

          <article className="portal-status-card portal-opening-card">
            <div className="portal-status-head">
              <p>Openings</p>
              <span className="portal-status-pill portal-status-interview">Live</span>
            </div>
            <h3>Browse current roles</h3>
            <p className="portal-status-note">
              Move from opportunities into applications or a new project request.
            </p>
            <div className="portal-quick-grid">
              <Link to="/career/openings" className="portal-quick-card">
                <h3>Openings</h3>
                <p>See what is available now.</p>
              </Link>
              <Link to="/project/dashboard" className="portal-quick-card">
                <h3>Project Dashboard</h3>
                <p>Check project activity.</p>
              </Link>
            </div>
          </article>
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card portal-priority-card-focus">
            <p className="portal-priority-label">Activity</p>
            <h2>Recent Movement</h2>
            <p>Keep an eye on the latest status changes and follow-ups.</p>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Active</h3>
                <p>{activeApplications} applications still in progress.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Approved</h3>
                <p>{approvedDocuments} files ready for download.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Recent</h3>
                <p>{recentApplications.length} latest submissions shown above.</p>
              </article>
            </div>
          </article>

          <article className="portal-priority-card">
            <p className="portal-priority-label">Next Steps</p>
            <h2>Move To The Next Action</h2>
            <div className="portal-quick-grid">
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={() => navigate("/portal/profile?edit=1")}
              >
                <h3>Edit Profile</h3>
                <p>Refresh your account and contact details.</p>
              </button>
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={() => navigate("/career/applications")}
              >
                <h3>Open Applications</h3>
                <p>Review the roles you already applied for.</p>
              </button>
              <button
                type="button"
                className="portal-quick-card portal-quick-card-button"
                onClick={() => navigate("/career/documents")}
              >
                <h3>Open Documents</h3>
                <p>Download approved offer letters and certificates.</p>
              </button>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default CareerDashboardPage;
