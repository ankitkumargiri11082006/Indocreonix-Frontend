import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import PortalSidebarLayout from "./PortalSidebarLayout";
import { clearPortalSession, getPortalUser, portalRequest } from "./portalAuthShared";

function CareerDocumentsPage() {
  const [user, setUser] = useState(() => getPortalUser());
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const approvedOfferLetters = useMemo(
    () =>
      applications.filter((item) => item.offerLetter?.downloadUrl && item.offerLetter?.isApproved),
    [applications],
  );

  const approvedCertificates = useMemo(
    () =>
      applications.filter((item) => item.certificate?.downloadUrl && item.certificate?.isApproved),
    [applications],
  );

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
        <SEO title="Documents" description="Approved offer letters and certificates." noindex={true} />

        <div className="portal-dashboard-topbar">
          <div>
            <p className="portal-kicker">Documents</p>
            <h1>Approved Files</h1>
            <p>Only approved offer letters and certificates appear here.</p>
          </div>
          <div className="portal-dashboard-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/applications")}>
              Applications
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/career/dashboard")}>
              Overview
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/portal/profile")}>
              Profile
            </button>
          </div>
        </div>

        {loading ? <p className="portal-inline-note">Loading documents...</p> : null}
        {error ? <p className="portal-inline-note portal-inline-warning">{error}</p> : null}

        <div className="portal-metric-grid" aria-label="Document summary">
          <article className="portal-metric-card">
            <p>Offer Letters</p>
            <strong>{approvedOfferLetters.length}</strong>
            <span>Approved and ready to download</span>
          </article>
          <article className="portal-metric-card">
            <p>Certificates</p>
            <strong>{approvedCertificates.length}</strong>
            <span>Approved and ready to download</span>
          </article>
          <article className="portal-metric-card">
            <p>Total Ready Files</p>
            <strong>{approvedOfferLetters.length + approvedCertificates.length}</strong>
            <span>Across all your applications</span>
          </article>
          <article className="portal-metric-card portal-metric-card-highlight">
            <p>Pending Approval</p>
            <strong>
              {Math.max(
                0,
                applications.length - (approvedOfferLetters.length + approvedCertificates.length),
              )}
            </strong>
            <span>Applications still under process</span>
          </article>
        </div>

        <div className="portal-document-groups">
          <section className="portal-document-group">
            <header className="portal-document-head">
              <h3>Offer Letters</h3>
              <p>Download approved offer letters issued for your applications.</p>
            </header>
            <div className="portal-dashboard-grid">
              {approvedOfferLetters.length ? (
                approvedOfferLetters.map((item) => (
                  <article key={item.id} className="portal-status-card">
                    <div className="portal-status-head">
                      <p>{item.role || "Application"}</p>
                      <span className="portal-status-pill portal-status-delivered">Approved</span>
                    </div>
                    <p className="portal-status-date">Submitted: {item.submittedAt || "N/A"}</p>
                    <a href={item.offerLetter.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                      Download
                    </a>
                  </article>
                ))
              ) : (
                <article className="portal-status-card">
                  <p className="portal-status-note">No approved offer letters yet.</p>
                </article>
              )}
            </div>
          </section>

          <section className="portal-document-group">
            <header className="portal-document-head">
              <h3>Certificates</h3>
              <p>Access approved completion and internship certificates.</p>
            </header>
            <div className="portal-dashboard-grid">
              {approvedCertificates.length ? (
                approvedCertificates.map((item) => (
                  <article key={item.id} className="portal-status-card">
                    <div className="portal-status-head">
                      <p>{item.role || "Application"}</p>
                      <span className="portal-status-pill portal-status-delivered">Approved</span>
                    </div>
                    <p className="portal-status-date">Submitted: {item.submittedAt || "N/A"}</p>
                    <a href={item.certificate.downloadUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                      Download
                    </a>
                  </article>
                ))
              ) : (
                <article className="portal-status-card">
                  <p className="portal-status-note">No approved certificates yet.</p>
                </article>
              )}
            </div>
          </section>
        </div>

        <div className="portal-priority-grid">
          <article className="portal-priority-card">
            <p className="portal-priority-label">Document Guidance</p>
            <h2>Download and organize your files</h2>
            <div className="portal-quick-grid">
              <article className="portal-quick-card">
                <h3>Check file name and date</h3>
                <p>Each card shows role and submission date for quick identification.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Use latest approved file</h3>
                <p>Only approved versions are listed in this page for safe sharing.</p>
              </article>
              <article className="portal-quick-card">
                <h3>Track pending applications</h3>
                <p>Return to applications page for notes and status updates.</p>
              </article>
            </div>
          </article>
        </div>
      </section>
    </PortalSidebarLayout>
  );
}

export default CareerDocumentsPage;
