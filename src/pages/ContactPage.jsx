import { useState } from 'react'
import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import { companyInfo } from '../data/companyInfo'
import { apiRequest } from '../lib/apiClient'

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [status, setStatus] = useState({ error: '', success: '' })

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    companyInfo.mapQuery,
  )}`

  async function submitLead(event) {
    event.preventDefault()
    setStatus({ error: '', success: '' })

    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      setStatus({ error: '', success: 'Your message has been submitted successfully.' })
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    } catch (error) {
      setStatus({ error: error.message, success: '' })
    }
  }

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

      <section className="container content-section">
        <article className="info-card">
          <h3>Send a Message</h3>
          <form className="admin-form-grid" onSubmit={submitLead}>
            <label>
              Name
              <input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone
              <input
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </label>
            <label>
              Company
              <input
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
              />
            </label>
            <label className="admin-full-row">
              Message
              <textarea
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
          {status.success ? <p className="admin-success">{status.success}</p> : null}
          {status.error ? <p className="admin-error">{status.error}</p> : null}
        </article>
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
