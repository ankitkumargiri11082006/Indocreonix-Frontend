import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieNotice from './CookieNotice'

function PageLayout() {
  const location = useLocation()
  const isPortalRoute =
    location.pathname.startsWith('/portal') ||
    location.pathname.startsWith('/career/dashboard') ||
    location.pathname.startsWith('/career/applications') ||
    location.pathname.startsWith('/career/documents') ||
    location.pathname.startsWith('/career/openings') ||
    location.pathname.startsWith('/career/onboarding-documents') ||
    location.pathname.startsWith('/project/dashboard') ||
    location.pathname.startsWith('/portal/project/request')

  const isPortalDashboardRoute =
    location.pathname.startsWith('/portal/home') ||
    location.pathname.startsWith('/portal/profile') ||
    location.pathname.startsWith('/career/dashboard') ||
    location.pathname.startsWith('/career/applications') ||
    location.pathname.startsWith('/career/documents') ||
    location.pathname.startsWith('/career/openings') ||
    location.pathname.startsWith('/career/onboarding-documents') ||
    location.pathname.startsWith('/project/dashboard') ||
    location.pathname.startsWith('/portal/project/request')

  return (
    <div
      className={
        isPortalDashboardRoute
          ? 'site-shell site-shell-portal-dashboard'
          : 'site-shell'
      }
    >
      <Navbar />
      <main className="site-main">
        <Outlet />
      </main>
      {isPortalRoute ? null : <Footer />}
      {isPortalRoute ? null : <CookieNotice />}
    </div>
  )
}

export default PageLayout
