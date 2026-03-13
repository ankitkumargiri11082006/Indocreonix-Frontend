import { Link } from 'react-router-dom'
import { companyInfo } from '../data/companyInfo'
import footerBackground from '../assets/footer-bg.svg'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="site-footer"
      style={{
        '--footer-bg-image': `url(${footerBackground})`,
      }}
    >
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/">
            <img src="/logo.png" alt="Indocreonix logo" className="brand-logo" />
            <span className="brand-text">Indocreonix</span>
          </Link>
          <p className="footer-copy">{companyInfo.tagline}</p>
        </div>

        <div>
          <h4>Company</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
            <li>
              <Link to="/case-studies">Case Studies</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-links">
            <li>
              <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
            </li>
            <li>
              <a href={`tel:${companyInfo.phones[0]}`}>+91 {companyInfo.phones[0]}</a>
            </li>
            <li>
              <a href={`tel:${companyInfo.phones[1]}`}>+91 {companyInfo.phones[1]}</a>
            </li>
            <li className="footer-address-item">
              <address className="footer-address">
                {companyInfo.addressLines[0]}
                <br />
                {companyInfo.addressLines[1]}
              </address>
            </li>
          </ul>
        </div>
      </div>
      <p className="copyright">Copyright {year} Indocreonix. All rights reserved.</p>
    </footer>
  )
}

export default Footer
