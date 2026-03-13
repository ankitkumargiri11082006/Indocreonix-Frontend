import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import { companyInfo } from '../data/companyInfo'

function ContactPage() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    companyInfo.mapQuery,
  )}`

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Connect with Indocreonix"
        subtitle="Reach our team directly for project discussions, partnerships, and business inquiries."
        theme="theme-contact"
        metrics={[
          { value: '<24h', label: 'Response Time' },
          { value: '2', label: 'Direct Contact Numbers' },
          { value: 'Delhi', label: 'Primary Office Location' },
        ]}
      />

      <section className="content-section container contact-grid">
        <article className="info-card">
          <h3>Email</h3>
          <p>
            <a href={`mailto:${companyInfo.email}`} className="contact-link">
              {companyInfo.email}
            </a>
          </p>
        </article>
        <article className="info-card">
          <h3>Mobile</h3>
          <p>
            <a href={`tel:${companyInfo.phones[0]}`} className="contact-link">
              +91 {companyInfo.phones[0]}
            </a>
          </p>
          <p>
            <a href={`tel:${companyInfo.phones[1]}`} className="contact-link">
              +91 {companyInfo.phones[1]}
            </a>
          </p>
        </article>
        <article className="info-card">
          <h3>Address</h3>
          <address className="contact-address">
            {companyInfo.addressLines[0]}
            <br />
            {companyInfo.addressLines[1]}
          </address>
          <p>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="contact-link">
              Open in Google Maps
            </a>
          </p>
        </article>
      </section>

      <section className="container contact-actions">
        <a className="btn btn-primary" href={`mailto:${companyInfo.email}`}>
          Email Us
        </a>
        <a className="btn btn-secondary" href={`tel:${companyInfo.phones[0]}`}>
          Call {companyInfo.phones[0]}
        </a>
        <a className="btn btn-secondary" href={mapsUrl} target="_blank" rel="noreferrer">
          Visit Office Route
        </a>
      </section>

      <CtaBanner
        title="Ready to discuss your roadmap with our team?"
        description="Send us your requirement and Indocreonix will share a practical execution plan."
        primaryLabel="Talk to Indocreonix"
        primaryTo="/contact"
      />
    </>
  )
}

export default ContactPage
