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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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
          aria-controls="site-mobile-nav"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>

        <div 
          className={isMenuOpen ? 'site-nav-backdrop site-nav-backdrop-open' : 'site-nav-backdrop'}
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
        
        <nav
          id="site-mobile-nav"
          className={isMenuOpen ? 'site-nav site-nav-open' : 'site-nav'}
          aria-label="Main navigation"
        >
          
          <div className="nav-mobile-header">
            <div className="nav-mobile-brand-block">
              <img src="/logo.png" alt="Indocreonix logo" className="nav-mobile-logo" />
              <div>
                <p className="nav-mobile-title">Indocreonix</p>
                <p className="nav-mobile-tag">Build. Scale. Lead.</p>
              </div>
            </div>
            <button type="button" className="nav-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              &times;
            </button>
          </div>

          <div className="nav-mobile-scroll">
            {navItems.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                style={{ '--anim-delay': `${i * 0.04}s` }}
              >
                {item.label}
                <span className="nav-link-arrow">→</span>
              </NavLink>
            ))}
            
            <div className="nav-mobile-bottom-actions">
              <p className="nav-mobile-subtitle">Ready to launch your next product?</p>
              <a href="/contact" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Get in Touch
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
