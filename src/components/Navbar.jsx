import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Products', path: '/products' },
  { label: 'Case Studies', path: '/case-studies' },
  { label: 'Careers', path: '/careers' },
  { label: 'Insights', path: '/insights' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
]

function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
          <span className="brand-text">Indocreonix</span>
        </NavLink>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
