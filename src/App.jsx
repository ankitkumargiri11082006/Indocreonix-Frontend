import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import RouteSkeleton from "./components/RouteSkeleton";
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import RouteSEO from "./components/RouteSEO";
import { ADMIN_BASE_PATH, adminPath } from "./admin/adminPath";
import { getPortalUser } from "./pages/portalAuthShared";
// import PwaInstallPrompt from "./components/PwaInstallPrompt";
import "./App.css";
import "./admin/Admin.css";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const SolutionsPage = lazy(() => import("./pages/SolutionsPage"));
const ClientsPage = lazy(() => import("./pages/ClientsPage"));
const ProjectRequestPage = lazy(() => import("./pages/ProjectRequestPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const CaseStudiesPage = lazy(() => import("./pages/CaseStudiesPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const CareerApplyPage = lazy(() => import("./pages/CareerApplyPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminForgotPasswordPage = lazy(() => import("./pages/AdminForgotPasswordPage"));
const PortalAccessPage = lazy(() => import("./pages/PortalAccessPage"));
const PortalForgotPasswordPage = lazy(() => import("./pages/PortalForgotPasswordPage"));
const PortalHomePage = lazy(() => import("./pages/PortalHomePage"));
const PortalProfilePage = lazy(() => import("./pages/PortalProfilePage"));
const CareerDashboardPage = lazy(() => import("./pages/CareerDashboardPage"));
const CareerApplicationsPage = lazy(() => import("./pages/CareerApplicationsPage"));
const CareerDocumentsPage = lazy(() => import("./pages/CareerDocumentsPage"));
const CareerOpeningsPage = lazy(() => import("./pages/CareerOpeningsPage"));
const ProjectDashboardPage = lazy(() => import("./pages/ProjectDashboardPage"));
const PortalProjectRequestPage = lazy(() => import("./pages/PortalProjectRequestPage"));
const TermsAndConditionsPage = lazy(() => import("./pages/TermsAndConditionsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const CareerOnboardingDocsPage = lazy(() => import("./pages/CareerOnboardingDocsPage"));

const AdminDashboardPage = lazy(() => import("./admin/pages/AdminDashboardPage"));
const AdminAnalyticsPage = lazy(() => import("./admin/pages/AdminAnalyticsPage"));
const AdminUsersPage = lazy(() => import("./admin/pages/AdminUsersPage"));
const AdminLeadsPage = lazy(() => import("./admin/pages/AdminLeadsPage"));
const AdminContentPage = lazy(() => import("./admin/pages/AdminContentPage"));
const AdminMediaPage = lazy(() => import("./admin/pages/AdminMediaPage"));
const AdminIntegrationsPage = lazy(() => import("./admin/pages/AdminIntegrationsPage"));
const AdminSettingsPage = lazy(() => import("./admin/pages/AdminSettingsPage"));
const AdminProfilePage = lazy(() => import("./admin/pages/AdminProfilePage"));
const AdminChangePasswordPage = lazy(() => import("./admin/pages/AdminChangePasswordPage"));
const AdminProjectsPage = lazy(() => import("./admin/pages/AdminProjectsPage"));
const AdminClientsPage = lazy(() => import("./admin/pages/AdminClientsPage"));
const AdminServicesPage = lazy(() => import("./admin/pages/AdminServicesPage"));
const AdminOpportunitiesPage = lazy(() => import("./admin/pages/AdminOpportunitiesPage"));
const AdminCareerApplicationsPage = lazy(() => import("./admin/pages/AdminCareerApplicationsPage"));
const AdminAuditLogsPage = lazy(() => import("./admin/pages/AdminAuditLogsPage"));
const AdminOrdersPage = lazy(() => import("./admin/pages/AdminOrdersPage"));
const AdminOrderDetailPage = lazy(() => import("./admin/pages/AdminOrderDetailPage"));
const AdminPortalControlPage = lazy(() => import("./admin/pages/AdminPortalControlPage"));

function ScrollToTopOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function PortalSessionRoute({ children }) {
  const portalUser = getPortalUser();
  if (!portalUser) {
    return <Navigate to="/portal" replace />;
  }
  return children;
}

function PortalAccessRoute({ children, access }) {
  const portalUser = getPortalUser();

  if (!portalUser) {
    return <Navigate to="/portal" replace />;
  }

  if (access === "career" && !portalUser?.access?.career) {
    return <Navigate to="/portal/home" replace />;
  }

  if (access === "project" && !portalUser?.access?.project) {
    return <Navigate to="/portal/home" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />
      <RouteSEO />
      {/* <PwaInstallPrompt /> */}

      <Suspense fallback={<RouteSkeleton />}>
        <Routes>
        <Route path={adminPath("login")} element={<LoginPage />} />
        <Route path={adminPath("signup")} element={<Navigate to={adminPath("login")} replace />} />
        <Route path={adminPath("forgot-password")} element={<AdminForgotPasswordPage />} />

        <Route path="/login" element={<Navigate to={adminPath("login")} replace />} />
        <Route path="/forgot-password" element={<Navigate to={adminPath("forgot-password")} replace />} />
        <Route path="/career/onboarding-documents" element={<CareerOnboardingDocsPage />} />

        {ADMIN_BASE_PATH !== "/admin" ? (
          <Route path="/admin/*" element={<NotFoundPage />} />
        ) : null}

        <Route
          path={ADMIN_BASE_PATH}
          element={
            <ProtectedRoute roles={["superadmin", "admin", "editor", "viewer"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute permission="dashboard">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute permission="analytics">
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute permission="projects">
                <AdminProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ProtectedRoute permission="clients">
                <AdminClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="services"
            element={
              <ProtectedRoute permission="services">
                <AdminServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute permission="orders">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:orderId"
            element={
              <ProtectedRoute permission="orders">
                <AdminOrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="openings"
            element={
              <ProtectedRoute permission="openings">
                <AdminOpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute permission="applications">
                <AdminCareerApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="audit-logs"
            element={
              <ProtectedRoute permission="auditLogs">
                <AdminAuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute permission="users">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="portal-control"
            element={
              <ProtectedRoute permission="portalControl">
                <AdminPortalControlPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="leads"
            element={
              <ProtectedRoute permission="leads">
                <AdminLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="content"
            element={
              <ProtectedRoute permission="content">
                <AdminContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="media"
            element={
              <ProtectedRoute permission="media">
                <AdminMediaPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="integrations"
            element={
              <ProtectedRoute permission="integrations">
                <AdminIntegrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute permission="settings">
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute permission="profile">
                <AdminProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="change-password"
            element={
              <ProtectedRoute permission="profile">
                <AdminChangePasswordPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/portal" element={<PortalAccessPage />} />
          <Route
            path="/portal/home"
            element={
              <PortalSessionRoute>
                <PortalHomePage />
              </PortalSessionRoute>
            }
          />
          <Route
            path="/portal/profile"
            element={
              <PortalSessionRoute>
                <PortalProfilePage />
              </PortalSessionRoute>
            }
          />
          <Route path="/portal-forgot-password" element={<PortalForgotPasswordPage />} />
          <Route
            path="/portal/signin"
            element={<Navigate to="/portal" replace />}
          />
          <Route
            path="/portal/signup"
            element={<Navigate to="/portal" replace />}
          />
          <Route
            path="/career/dashboard"
            element={
              <PortalAccessRoute access="career">
                <CareerDashboardPage />
              </PortalAccessRoute>
            }
          />
          <Route
            path="/career/applications"
            element={
              <PortalAccessRoute access="career">
                <CareerApplicationsPage />
              </PortalAccessRoute>
            }
          />
          <Route
            path="/career/documents"
            element={
              <PortalAccessRoute access="career">
                <CareerDocumentsPage />
              </PortalAccessRoute>
            }
          />
          <Route
            path="/career/openings"
            element={
              <PortalAccessRoute access="career">
                <CareerOpeningsPage />
              </PortalAccessRoute>
            }
          />
          <Route
            path="/project/dashboard"
            element={
              <PortalAccessRoute access="project">
                <ProjectDashboardPage />
              </PortalAccessRoute>
            }
          />
          <Route
            path="/portal/project/request"
            element={
              <PortalAccessRoute access="project">
                <PortalProjectRequestPage />
              </PortalAccessRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route
            path="/services/:serviceSlug"
            element={<ServiceDetailPage />}
          />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/request-quote" element={<ProjectRequestPage />} />
          <Route path="/projects-delivered" element={<CaseStudiesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route
            path="/careers/apply/:roleType"
            element={<CareerApplyPage />}
          />
          <Route
            path="/careers/internship"
            element={<Navigate to="/careers/apply/internship" replace />}
          />
          <Route
            path="/careers/job"
            element={<Navigate to="/careers/apply/job" replace />}
          />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
