import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
          <span className="brand-text">Indocreonix</span>
        </NavLink>

        <button
          type="button"
          className={isMenuOpen ? 'nav-toggle nav-toggle-open' : 'nav-toggle'}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <nav className={isMenuOpen ? 'site-nav site-nav-open' : 'site-nav'} aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="nav-mobile-logo-card" aria-hidden={!isMenuOpen}>
            <img src="/logo.png" alt="Indocreonix brand logo" className="nav-mobile-logo" />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
