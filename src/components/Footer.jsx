import { Link } from 'react-router-dom'
import { companyInfo } from '../data/companyInfo'
import AnimatedDeepBackground from './AnimatedDeepBackground'

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-svg">
        <path
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9.5 2A1.5 1.5 0 1 0 18 5.5 1.5 1.5 0 0 0 16.5 4ZM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-svg">
        <path
          d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.4L1 2h6.3l4.4 5.9L18.9 2Zm-1.1 18h1.7L6.3 4H4.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-svg">
        <path
          d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.4v8Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-svg">
        <path
          d="M6.2 8.3a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM4.7 9.8h3v9.5h-3Zm4.9 0h2.9v1.3h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7v5.1h-3v-4.5c0-1.1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.6h-3Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-social-svg">
      <path
        d="M12 2a10 10 0 0 0-8.7 15l-1.1 4.1L6.5 20A10 10 0 1 0 12 2Zm5.4 13.8c-.2.6-1.2 1.1-1.8 1.2-.5.1-1.2.2-3.8-.9-3.3-1.4-5.5-4.9-5.7-5.2-.2-.3-1.3-1.7-1.3-3.2s.8-2.2 1.1-2.5c.3-.3.7-.4.9-.4h.7c.2 0 .5 0 .7.5.2.6.8 2 .9 2.2.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.5.6c-.2.2-.3.4-.1.8.2.4 1.1 1.9 2.5 3 .1.1 2 1.6 3.5 1.9.4.1.6 0 .8-.2l1-1.2c.3-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.5.2.5.4a2.5 2.5 0 0 1-.2 1.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  const socialItems = [
    { key: 'facebook', label: 'Facebook', href: companyInfo.socialLinks.facebook },
    { key: 'instagram', label: 'Instagram', href: companyInfo.socialLinks.instagram },
    { key: 'x', label: 'X', href: companyInfo.socialLinks.x },
    { key: 'linkedin', label: 'LinkedIn', href: companyInfo.socialLinks.linkedin },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/91${companyInfo.whatsappNumber}` },
  ]
  const resourceItems = [
    { label: 'Insights', to: '/insights', icon: '📘' },
    { label: 'FAQ', to: '/faq', icon: '❓' },
    { label: 'Terms & Conditions', to: '/terms-and-conditions', icon: '📜' },
    { label: 'Privacy Policy', to: '/privacy-policy', icon: '🔒' },
  ]

  const renderSocialStrip = (extraClassName = '') => (
    <section className={`footer-social-strip ${extraClassName}`.trim()} aria-label="Social media links">
      <p className="footer-social-title">CONNECT ON SOCIAL MEDIA</p>
      <div className="footer-social-orbs">
        {socialItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`footer-social-orb footer-social-orb-${item.key}`}
            aria-label={item.label}
            title={item.label}
          >
            <SocialIcon type={item.key} />
          </a>
        ))}
      </div>
    </section>
  )

  return (
    <footer className="site-footer">
      <AnimatedDeepBackground photoUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80" />
      <div className="container footer-grid">
        <div className="footer-brand-wrap">
          <Link className="brand footer-brand" to="/">
            <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
            <span className="brand-text">Indocreonix</span>
          </Link>
          <p className="footer-tagline">{companyInfo.tagline}</p>
          <p className="footer-copy">Helping customers build scalable digital experiences with modern web, cloud, data, and AI.</p>
          {renderSocialStrip('footer-social-strip-desktop')}
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-home" aria-hidden="true">🏠</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-about" aria-hidden="true">ℹ️</span>
                <span>About</span>
              </Link>
            </li>
            <li>
              <Link to="/services" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-services" aria-hidden="true">🛠️</span>
                <span>Services</span>
              </Link>
            </li>
            <li>
              <Link to="/solutions" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-solutions" aria-hidden="true">🧩</span>
                <span>Solutions</span>
              </Link>
            </li>
            <li>
              <Link to="/clients" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-clients" aria-hidden="true">🤝</span>
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link to="/projects-delivered" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-projects" aria-hidden="true">✅</span>
                <span>Projects We Delivered</span>
              </Link>
            </li>
            <li>
              <Link to="/request-quote" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-quote" aria-hidden="true">🧾</span>
                <span>Request Quote</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-contact" aria-hidden="true">📩</span>
                <span>Contact</span>
              </Link>
            </li>
            <li>
              <Link to="/careers" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-careers" aria-hidden="true">💼</span>
                <span>Careers</span>
              </Link>
            </li>
            <li>
              <Link to="/careers/internship" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-internship" aria-hidden="true">🎓</span>
                <span>Internship Apply</span>
              </Link>
            </li>
            <li>
              <Link to="/careers/job" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-job" aria-hidden="true">🧑‍💻</span>
                <span>Job Apply</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-links">
            <li>
              <a href={`mailto:${companyInfo.email}`} className="footer-link-with-icon">
                <span className="footer-icon footer-icon-email" aria-hidden="true">✉️</span>
                <span>{companyInfo.email}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.supportEmail}`} className="footer-link-with-icon">
                <span className="footer-icon footer-icon-email" aria-hidden="true">✉️</span>
                <span>{companyInfo.supportEmail}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.careersEmail}`} className="footer-link-with-icon">
                <span className="footer-icon footer-icon-email" aria-hidden="true">✉️</span>
                <span>{companyInfo.careersEmail}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${companyInfo.phones[0]}`} className="footer-link-with-icon">
                <span className="footer-icon footer-icon-phone-1" aria-hidden="true">📞</span>
                <span>+91 {companyInfo.phones[0]}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${companyInfo.phones[1]}`} className="footer-link-with-icon">
                <span className="footer-icon footer-icon-phone-2" aria-hidden="true">📞</span>
                <span>+91 {companyInfo.phones[1]}</span>
              </a>
            </li>
            <li className="footer-address-item">
              <div className="footer-link-with-icon">
                <span className="footer-icon footer-icon-location" aria-hidden="true">📍</span>
                <a
                  href={companyInfo.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link-with-icon footer-address-inline-link"
                  title="Open address in Google Maps"
                >
                  <address className="footer-address">
                    {companyInfo.addressLines[0]}
                    <br />
                    {companyInfo.addressLines[1]}
                  </address>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <section className="container footer-resources-highlight" aria-label="Helpful resources">
        <div className="footer-resources-highlight-copy">
          <p className="footer-resources-kicker">Resource Hub</p>
          <h3>Need quick answers and updates?</h3>
          <p>Browse our most useful pages in one place.</p>
        </div>
        <div className="footer-resources-pills">
          {resourceItems.map((item) => (
            <Link key={item.to} to={item.to} className="footer-resource-pill">
              <span className="footer-resource-pill-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
      {renderSocialStrip('container footer-social-strip-mobile')}
      <p className="copyright">Copyright {year} Indocreonix. All rights reserved.</p>
    </footer>
  )
}

export default Footer
