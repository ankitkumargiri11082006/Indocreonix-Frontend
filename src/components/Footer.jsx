import { Link } from 'react-router-dom'
import { companyInfo } from '../data/companyInfo'
import AnimatedDeepBackground from './AnimatedDeepBackground'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <AnimatedDeepBackground photoUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80" />
      <div className="container footer-grid">
        <div className="footer-brand-wrap">
          <Link className="brand footer-brand" to="/">
            <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
            <span className="brand-text">Indocreonix</span>
          </Link>
          <p className="footer-copy">{companyInfo.tagline}</p>
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
          </ul>
        </div>

        <div>
          <h4>Resources & Careers</h4>
          <ul className="footer-links">
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
            <li>
              <Link to="/insights" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-insights" aria-hidden="true">📚</span>
                <span>Insights</span>
              </Link>
            </li>
            <li>
              <Link to="/faq" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-faq" aria-hidden="true">❓</span>
                <span>FAQ</span>
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-terms" aria-hidden="true">📜</span>
                <span>Terms and Conditions</span>
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="footer-link-with-icon">
                <span className="footer-icon footer-icon-privacy" aria-hidden="true">🔒</span>
                <span>Privacy Policy</span>
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
                <address className="footer-address">
                  {companyInfo.addressLines[0]}
                  <br />
                  {companyInfo.addressLines[1]}
                </address>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <p className="copyright">Copyright {year} Indocreonix. All rights reserved.</p>
    </footer>
  )
}

export default Footer
