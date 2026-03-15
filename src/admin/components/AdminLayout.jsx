import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const menuSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/admin' },
      { label: 'Analytics', to: '/admin/analytics' },
      { label: 'Audit Logs', to: '/admin/audit-logs' },
    ],
  },
  {
    title: 'Website Data',
    items: [
      { label: 'Projects', to: '/admin/projects' },
      { label: 'Clients', to: '/admin/clients' },
      { label: 'Services', to: '/admin/services' },
      { label: 'Content', to: '/admin/content' },
      { label: 'Media', to: '/admin/media' },
      { label: 'Leads', to: '/admin/leads' },
    ],
  },
  {
    title: 'Careers',
    items: [
      { label: 'Openings', to: '/admin/openings' },
      { label: 'Applications', to: '/admin/applications' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Users', to: '/admin/users' },
      { label: 'Integrations', to: '/admin/integrations' },
      { label: 'Settings', to: '/admin/settings' },
      { label: 'Profile', to: '/admin/profile' },
    ],
  },
]

const routeTitleMap = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Analytics',
  '/admin/projects': 'Projects',
  '/admin/clients': 'Clients',
  '/admin/services': 'Services',
  '/admin/openings': 'Openings',
  '/admin/applications': 'Applications',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/users': 'Users',
  '/admin/leads': 'Leads',
  '/admin/content': 'Content',
  '/admin/media': 'Media',
  '/admin/integrations': 'Integrations',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Profile',
}

function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const pageTitle = routeTitleMap[location.pathname] || 'Admin Panel'
  const topbarAvatar = user?.avatarUrl || '/logo.png'
  const activeSection =
    menuSections.find((section) =>
      section.items.some((item) => (item.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.to))),
    ) || menuSections[0]
  const allRoutes = menuSections.flatMap((section) => section.items)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="Indocreonix" />
          <div>
            <p className="admin-brand-title">Indocreonix</p>
            <p className="admin-brand-sub">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-menu">
          {menuSections.map((section) => (
            <div className="admin-menu-section" key={section.title}>
              <p className="admin-menu-section-title">{section.title}</p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) => (isActive ? 'admin-menu-link active' : 'admin-menu-link')}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="admin-logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title-wrap">
            <p className="admin-topbar-label">Admin Workspace</p>
            <h1>{pageTitle}</h1>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-topbar-quick-links" aria-label="Quick section navigation">
              {activeSection.items.slice(0, 4).map((item) => (
                <Link key={item.to} to={item.to} className="admin-topbar-quick-link">
                  {item.label}
                </Link>
              ))}
            </div>
            <label className="admin-topbar-jump-wrap">
              <span>Quick Jump</span>
              <select className="admin-topbar-jump" value={location.pathname} onChange={(event) => navigate(event.target.value)}>
                {allRoutes.map((item) => (
                  <option key={item.to} value={item.to}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">
                <img src={topbarAvatar} alt="Admin avatar" className="admin-topbar-avatar-img" />
              </div>
              <div>
                <p className="admin-topbar-user-name">{user?.name || 'Admin User'}</p>
                <p className="admin-topbar-user-role">{user?.role || 'viewer'}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default AdminLayout
