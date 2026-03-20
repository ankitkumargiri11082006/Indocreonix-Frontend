import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageLayout from './components/PageLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import SolutionsPage from './pages/SolutionsPage'
import ClientsPage from './pages/ClientsPage'
import ProjectRequestPage from './pages/ProjectRequestPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CareersPage from './pages/CareersPage'
import CareerApplyPage from './pages/CareerApplyPage'
import InsightsPage from './pages/InsightsPage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import TermsAndConditionsPage from './pages/TermsAndConditionsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import AdminLayout from './admin/components/AdminLayout'
import ProtectedRoute from './admin/components/ProtectedRoute'
import AdminDashboardPage from './admin/pages/AdminDashboardPage'
import AdminAnalyticsPage from './admin/pages/AdminAnalyticsPage'
import AdminUsersPage from './admin/pages/AdminUsersPage'
import AdminLeadsPage from './admin/pages/AdminLeadsPage'
import AdminContentPage from './admin/pages/AdminContentPage'
import AdminMediaPage from './admin/pages/AdminMediaPage'
import AdminIntegrationsPage from './admin/pages/AdminIntegrationsPage'
import AdminSettingsPage from './admin/pages/AdminSettingsPage'
import AdminProfilePage from './admin/pages/AdminProfilePage'
import AdminChangePasswordPage from './admin/pages/AdminChangePasswordPage'
import AdminProjectsPage from './admin/pages/AdminProjectsPage'
import AdminClientsPage from './admin/pages/AdminClientsPage'
import AdminServicesPage from './admin/pages/AdminServicesPage'
import AdminOpportunitiesPage from './admin/pages/AdminOpportunitiesPage'
import AdminCareerApplicationsPage from './admin/pages/AdminCareerApplicationsPage'
import AdminAuditLogsPage from './admin/pages/AdminAuditLogsPage'
import AdminOrdersPage from './admin/pages/AdminOrdersPage'
import './App.css'
import './admin/Admin.css'

function ScrollToTopOnRouteChange() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return null
}

function App() {
  return (
    <>
      <ScrollToTopOnRouteChange />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['superadmin', 'admin', 'editor', 'viewer']}>
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceSlug" element={<ServiceDetailPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/request-quote" element={<ProjectRequestPage />} />
          <Route path="/projects-delivered" element={<CaseStudiesPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/apply/:roleType" element={<CareerApplyPage />} />
          <Route path="/careers/internship" element={<Navigate to="/careers/apply/internship" replace />} />
          <Route path="/careers/job" element={<Navigate to="/careers/apply/job" replace />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
