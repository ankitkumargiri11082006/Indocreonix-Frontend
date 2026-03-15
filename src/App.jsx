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
        <Route index element={<AdminDashboardPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="clients" element={<AdminClientsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="openings" element={<AdminOpportunitiesPage />} />
        <Route path="applications" element={<AdminCareerApplicationsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="leads" element={<AdminLeadsPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="integrations" element={<AdminIntegrationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
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
