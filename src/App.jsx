import { Navigate, Route, Routes } from 'react-router-dom'
import PageLayout from './components/PageLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import SolutionsPage from './pages/SolutionsPage'
import ProductsPage from './pages/ProductsPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CareersPage from './pages/CareersPage'
import InternshipApplyPage from './pages/InternshipApplyPage'
import JobApplyPage from './pages/JobApplyPage'
import InsightsPage from './pages/InsightsPage'
import FaqPage from './pages/FaqPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
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
import AdminProjectsPage from './admin/pages/AdminProjectsPage'
import AdminClientsPage from './admin/pages/AdminClientsPage'
import AdminServicesPage from './admin/pages/AdminServicesPage'
import AdminOpportunitiesPage from './admin/pages/AdminOpportunitiesPage'
import AdminCareerApplicationsPage from './admin/pages/AdminCareerApplicationsPage'
import AdminAuditLogsPage from './admin/pages/AdminAuditLogsPage'
import './App.css'
import './admin/Admin.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

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
      </Route>

      <Route element={<PageLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/internship" element={<InternshipApplyPage />} />
        <Route path="/careers/job" element={<JobApplyPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
