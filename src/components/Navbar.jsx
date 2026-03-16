import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const primaryNavItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Careers', path: '/careers' },
  { label: 'Projects We Delivered', path: '/projects-delivered' },
  { label: 'Get Quote', path: '/request-quote' },
  { label: 'Contact', path: '/contact' },
]

const groupedNavItems = [
  {
    label: 'Company',
    items: [
      { label: 'Solutions', path: '/solutions' },
      { label: 'Clients', path: '/clients' },
      { label: 'Terms and Conditions', path: '/terms-and-conditions' },
      { label: 'Privacy Policy', path: '/privacy-policy' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Insights', path: '/insights' },
      { label: 'FAQ', path: '/faq' },
    ],
  },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDesktopGroup, setOpenDesktopGroup] = useState(null)
  const [openMobileGroup, setOpenMobileGroup] = useState(null)
  const location = useLocation()
  const navPanelRef = useRef(null)
  const navToggleRef = useRef(null)

  useEffect(() => {
    setIsMenuOpen(false)
    setOpenMobileGroup(null)
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

  useEffect(() => {
    if (!isMenuOpen) return

    const onPointerDown = (event) => {
      const target = event.target
      if (navPanelRef.current?.contains(target) || navToggleRef.current?.contains(target)) {
        return
      }
      setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [isMenuOpen])

  function isPathSelected(path) {
    if (path === '/') return location.pathname === '/'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  function isGroupActive(group) {
    return group.items.some((item) => isPathSelected(item.path))
  }

  function onDesktopGroupToggle(groupLabel) {
    setOpenDesktopGroup((prev) => (prev === groupLabel ? null : groupLabel))
  }

  function isMobileGroupOpen(group) {
    if (openMobileGroup) return openMobileGroup === group.label
    return isGroupActive(group)
  }

  function onMobileGroupToggle(groupLabel) {
    setOpenMobileGroup((prev) => (prev === groupLabel ? null : groupLabel))
  }

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
          <span className="brand-text">Indocreonix</span>
        </NavLink>

        <button
          ref={navToggleRef}
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
          ref={navPanelRef}
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
            {primaryNavItems.map((item, i) => (
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

            <div className="nav-group-list">
              {groupedNavItems.map((group) => (
                <div
                  key={group.label}
                  className={isMobileGroupOpen(group) ? 'nav-group-block nav-group-block-open' : 'nav-group-block'}
                >
                  <button
                    type="button"
                    className="nav-group-title"
                    aria-expanded={isMobileGroupOpen(group)}
                    onClick={() => onMobileGroupToggle(group.label)}
                  >
                    <span className="nav-group-title-copy">
                      <span className="nav-group-label">{group.label}</span>
                      <span className="nav-group-hint">Tap to expand</span>
                    </span>
                    <span className="nav-group-caret">▾</span>
                  </button>
                  <div className={isMobileGroupOpen(group) ? 'nav-group-items nav-group-items-open' : 'nav-group-items'}>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          isActive ? 'nav-link nav-link-sub nav-link-active' : 'nav-link nav-link-sub'
                        }
                      >
                        {item.label}
                        <span className="nav-link-arrow">→</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="nav-mobile-bottom-actions">
              <p className="nav-mobile-subtitle">Ready to launch your next product?</p>
              <a href="/request-quote" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Request Project Quote
              </a>
            </div>
          </div>

          <div className="site-nav-desktop-groups" aria-label="Secondary navigation">
            {groupedNavItems.map((group) => (
              <div
                className={openDesktopGroup === group.label ? 'nav-dropdown nav-dropdown-open' : 'nav-dropdown'}
                key={group.label}
                onMouseEnter={() => setOpenDesktopGroup(group.label)}
                onMouseLeave={() => setOpenDesktopGroup(null)}
                onFocusCapture={() => setOpenDesktopGroup(group.label)}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenDesktopGroup(null)
                  }
                }}
              >
                <button
                  type="button"
                  className={isGroupActive(group) ? 'nav-dropdown-trigger nav-dropdown-trigger-active' : 'nav-dropdown-trigger'}
                  aria-expanded={openDesktopGroup === group.label}
                  aria-haspopup="true"
                  onClick={() => onDesktopGroupToggle(group.label)}
                >
                  {group.label}
                  <span className="nav-dropdown-caret">▾</span>
                </button>
                <div className="nav-dropdown-menu">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        isActive ? 'nav-dropdown-item nav-dropdown-item-active' : 'nav-dropdown-item'
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
