import { Link } from 'react-router-dom'
import {
  FiHome,
  FiInfo,
  FiBriefcase,
  FiGrid,
  FiUsers,
  FiCheckSquare,
  FiFileText,
  FiSend,
  FiBook,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCode,
  FiArrowRight,
} from 'react-icons/fi'
import { companyInfo } from '../data/companyInfo'
import AnimatedDeepBackground from './AnimatedDeepBackground'

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-v2-social-svg">
        <path
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9.5 2A1.5 1.5 0 1 0 18 5.5 1.5 1.5 0 0 0 16.5 4ZM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-v2-social-svg">
        <path
          d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H3.2l7.3-8.4L1 2h6.3l4.4 5.9L18.9 2Zm-1.1 18h1.7L6.3 4H4.5Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-v2-social-svg">
        <path
          d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.4v8Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-v2-social-svg">
        <path
          d="M6.2 8.3a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM4.7 9.8h3v9.5h-3Zm4.9 0h2.9v1.3h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7v5.1h-3v-4.5c0-1.1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3v4.6h-3Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="footer-v2-social-svg">
      <path
        d="M12 2a10 10 0 0 0-8.7 15l-1.1 4.1L6.5 20A10 10 0 1 0 12 2Zm5.4 13.8c-.2.6-1.2 1.1-1.8 1.2-.5.1-1.2.2-3.8-.9-3.3-1.4-5.5-4.9-5.7-5.2-.2-.3-1.3-1.7-1.3-3.2s.8-2.2 1.1-2.5c.3-.3.7-.4.9-.4h.7c.2 0 .5 0 .7.5.2.6.8 2 .9 2.2.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.5.6c-.2.2-.3.4-.1.8.2.4 1.1 1.9 2.5 3 .1.1 2 1.6 3.5 1.9.4.1.6 0 .8-.2l1-1.2c.3-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.5.2.5.4a2.5 2.5 0 0 1-.2 1.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  const quickLinks = [
    { label: 'Home', to: '/', icon: FiHome },
    { label: 'About', to: '/about', icon: FiInfo },
    { label: 'Services', to: '/services', icon: FiBriefcase },
    { label: 'Solutions', to: '/solutions', icon: FiGrid },
    { label: 'Clients', to: '/clients', icon: FiUsers },
    { label: 'Projects We Delivered', to: '/projects-delivered', icon: FiCheckSquare },
    { label: 'Request Quote', to: '/request-quote', icon: FiFileText },
    { label: 'Contact', to: '/contact', icon: FiSend },
    { label: 'Careers', to: '/careers', icon: FiBriefcase },
    { label: 'Internship Apply', to: '/careers/internship', icon: FiBook },
    { label: 'Job Apply', to: '/careers/job', icon: FiCode },
  ]
  const socialItems = [
    { key: 'facebook', label: 'Facebook', href: companyInfo.socialLinks.facebook },
    { key: 'instagram', label: 'Instagram', href: companyInfo.socialLinks.instagram },
    { key: 'x', label: 'X', href: companyInfo.socialLinks.x },
    { key: 'linkedin', label: 'LinkedIn', href: companyInfo.socialLinks.linkedin },
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/91${companyInfo.whatsappNumber}` },
  ]
  const contactItems = [
    { label: companyInfo.email, href: `mailto:${companyInfo.email}`, icon: FiMail },
    { label: companyInfo.supportEmail, href: `mailto:${companyInfo.supportEmail}`, icon: FiMail },
    { label: companyInfo.careersEmail, href: `mailto:${companyInfo.careersEmail}`, icon: FiMail },
    { label: `+91 ${companyInfo.phones[0]}`, href: `tel:${companyInfo.phones[0]}`, icon: FiPhone },
    { label: `+91 ${companyInfo.phones[1]}`, href: `tel:${companyInfo.phones[1]}`, icon: FiPhone },
  ]

  return (
    <footer className="site-footer footer-v2">
      <AnimatedDeepBackground photoUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80" />

      <section className="container footer-v2-cta" aria-label="Footer call to action">
        <div className="footer-v2-cta-copy">
          <p className="footer-v2-cta-kicker">Build with Indocreonix</p>
          <h3>Ready to launch your next digital product?</h3>
          <p>Let our team turn your roadmap into a fast, secure, and scalable platform.</p>
        </div>
        <div className="footer-v2-cta-actions">
          <Link to="/request-quote" className="footer-v2-cta-btn footer-v2-cta-btn-primary">
            <span>Get Free Consultation</span>
            <FiArrowRight aria-hidden="true" />
          </Link>
          <a href={`tel:${companyInfo.phones[0]}`} className="footer-v2-cta-btn footer-v2-cta-btn-secondary">
            <span>Call +91 {companyInfo.phones[0]}</span>
          </a>
        </div>
      </section>

      <div className="container footer-v2-main">
        <section className="footer-v2-column footer-v2-brand-col" aria-label="Company overview">
          <Link className="footer-v2-brand-link" to="/">
            <img src="/logo.png" alt="Indocreonix logo" className="footer-v2-brand-logo" />
            <span className="footer-v2-brand-name">Indocreonix</span>
          </Link>
          <p className="footer-v2-tagline">{companyInfo.tagline}</p>
          <p className="footer-v2-description">
            Helping businesses launch and scale secure digital platforms across web, cloud, data, and AI.
          </p>
          <div className="footer-v2-chip-row" aria-label="Company highlights">
            <span className="footer-v2-chip">Product Engineering</span>
            <span className="footer-v2-chip">Cloud & DevOps</span>
            <span className="footer-v2-chip">AI Integration</span>
          </div>

          <div className="footer-v2-links-wrap">
            <h4 className="footer-v2-title">Quick Links</h4>
            <ul className="footer-v2-link-list">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>
                    <span className="footer-v2-item-icon" aria-hidden="true"><item.icon /></span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="footer-v2-column footer-v2-contact-col" aria-label="Contact and resources">
          <div className="footer-v2-card">
            <h4 className="footer-v2-title">Contact</h4>
            <ul className="footer-v2-contact-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>
                    <span className="footer-v2-item-icon" aria-hidden="true"><item.icon /></span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={companyInfo.mapUrl} target="_blank" rel="noreferrer" className="footer-v2-address-link">
                  <span className="footer-v2-item-icon" aria-hidden="true"><FiMapPin /></span>
                  <span>
                    {companyInfo.addressLines[0]}<br />
                    {companyInfo.addressLines[1]}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <section className="footer-v2-social" aria-label="Social media links">
            <p className="footer-v2-social-title">Connect on social media</p>
            <div className="footer-v2-social-list">
              {socialItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`footer-v2-social-link footer-v2-social-${item.key}`}
                  aria-label={item.label}
                  title={item.label}
                >
                  <SocialIcon type={item.key} />
                </a>
              ))}
            </div>
          </section>
        </section>
      </div>

      <p className="footer-v2-copyright">Copyright {year} Indocreonix. All rights reserved.</p>
    </footer>
  )
}

export default Footer
