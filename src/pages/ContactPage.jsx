import { useState } from 'react'
import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import { companyInfo } from '../data/companyInfo'
import { apiRequest } from '../lib/apiClient'
import SEO from '../components/SEO'
import StatusModal from '../components/StatusModal'

function SocialIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M13.5 8H16V5h-2.5C10.7 5 9 6.7 9 9.5V12H7v3h2v4h3v-4h2.3l.7-3H12V9.8c0-1 .5-1.8 1.5-1.8Z" />
      </svg>
    )
  }

  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 8A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4Z" />
        <path d="M16.9 3H7.1A4.1 4.1 0 0 0 3 7.1v9.8A4.1 4.1 0 0 0 7.1 21h9.8a4.1 4.1 0 0 0 4.1-4.1V7.1A4.1 4.1 0 0 0 16.9 3Zm2.5 13.9a2.5 2.5 0 0 1-2.5 2.5H7.1a2.5 2.5 0 0 1-2.5-2.5V7.1a2.5 2.5 0 0 1 2.5-2.5h9.8a2.5 2.5 0 0 1 2.5 2.5v9.8Z" />
        <circle cx="17.3" cy="6.7" r="1.1" />
      </svg>
    )
  }

  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M18.9 4H21l-6.4 7.3L22 20h-5.8l-4.6-5.6L6.8 20H4.7l6.8-7.8L2 4h6l4.2 5.1L18.9 4Zm-1 14.3h1.6L7 5.6H5.3l12.6 12.7Z" />
      </svg>
    )
  }

  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.2 8.8A1.8 1.8 0 1 0 6.2 5.2 1.8 1.8 0 0 0 6.2 8.8Z" />
        <path d="M4.8 10.2h2.9V19H4.8v-8.8Zm4.7 0h2.8v1.2h.1c.4-.7 1.4-1.5 2.9-1.5 3.1 0 3.7 2 3.7 4.7V19h-2.9v-3.8c0-1-.1-2.2-1.4-2.2-1.4 0-1.6 1-1.6 2.1V19H9.5v-8.8Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M19.3 4.7a9 9 0 0 0-14.4 10.8L4 20l4.7-.9a9 9 0 0 0 10.6-14.4ZM12 19a7 7 0 0 1-3.6-1l-.3-.2-2.8.5.5-2.7-.2-.3A7 7 0 1 1 12 19Zm3.8-5.3c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.8c-.1.1-.3.1-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.3-.4.2-.4c.1-.1.1-.3 0-.5 0-.1-.5-1.2-.7-1.6-.2-.4-.3-.3-.5-.3h-.4c-.2 0-.5.1-.7.3-.2.2-.9.8-.9 1.9s.9 2.2 1 2.3c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.3-.6 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  )
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', type: 'success' })

  const mapsUrl = companyInfo.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyInfo.mapQuery)}`
  const whatsappUrl = `https://wa.me/91${companyInfo.whatsappNumber}`
  const socialBarItems = [
    { key: 'facebook', label: 'Facebook', href: companyInfo.socialLinks.facebook, iconClass: 'social-pill-icon-facebook' },
    { key: 'instagram', label: 'Instagram', href: companyInfo.socialLinks.instagram, iconClass: 'social-pill-icon-instagram' },
    { key: 'x', label: 'X', href: companyInfo.socialLinks.x, iconClass: 'social-pill-icon-x' },
    { key: 'linkedin', label: 'LinkedIn', href: companyInfo.socialLinks.linkedin, iconClass: 'social-pill-icon-linkedin' },
    { key: 'whatsapp', label: 'WhatsApp', href: whatsappUrl, iconClass: 'social-pill-icon-whatsapp' },
  ]

  async function submitLead(event) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      await apiRequest('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      setModalState({
        isOpen: true,
        title: 'Thank You for Contacting Indocreonix',
        message: 'Your inquiry has been received successfully. A technology consultant from our team will connect with you within the next 24 business hours with the appropriate next steps.',
        type: 'success'
      })
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    } catch (error) {
      setModalState({
        isOpen: true,
        title: 'Unable to Submit Request',
        message: error.message || 'We were unable to process your request at this time. Please retry in a few minutes or reach us directly by email or phone.',
        type: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SEO 
        title="Contact Indocreonix | Start Your Software or Digital Transformation Project"
        description="Contact Indocreonix for project consultation, technical planning, software development, modernization, and long-term technology support services."
        keywords="contact indocreonix, software project consultation, technology services contact, web app development inquiry, enterprise software partner"
      />
      <PageHero
        eyebrow="Contact"
        title="Connect with Indocreonix for Professional Technology Services"
        subtitle="Share your requirement with our team and we will guide you on the best next step for your project."
        theme="theme-contact"
        metrics={[
          { value: '<24h', label: 'Response Time' },
          { value: '2', label: 'Direct Contact Numbers' },
          { value: 'Email, Phone, Social', label: 'Communication Channels' },
        ]}
      />

      <section className="content-section container contact-grid">
        <article className="info-card contact-social-bar-card contact-social-bar-full">
          <h3>Connect on Social Media</h3>
          <p>Follow us for updates and connect quickly on WhatsApp or social media.</p>
          <div className="contact-social-bar" role="navigation" aria-label="Indocreonix social links">
            {socialBarItems.map((item) => (
              <a key={item.key} href={item.href} target="_blank" rel="noreferrer" className="social-pill">
                <span className={`social-pill-icon ${item.iconClass}`} aria-hidden="true">
                  <SocialIcon type={item.key} />
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </article>

        <article className="info-card">
          <h3>Email</h3>
          <p>
            Info:{' '}
            <a href={`mailto:${companyInfo.email}`} className="contact-link">
              {companyInfo.email}
            </a>
          </p>
          <p>
            Support:{' '}
            <a href={`mailto:${companyInfo.supportEmail}`} className="contact-link">
              {companyInfo.supportEmail}
            </a>
          </p>
          <p>
            Careers:{' '}
            <a href={`mailto:${companyInfo.careersEmail}`} className="contact-link">
              {companyInfo.careersEmail}
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
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="contact-address-link" title="Open full address in Google Maps">
            <address className="contact-address">
              {companyInfo.addressLines[0]}
              <br />
              {companyInfo.addressLines[1]}
            </address>
          </a>
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
          <p>Fill out this form and our team will get back to you with the right guidance.</p>
          <form className="admin-form-grid" onSubmit={submitLead}>
            <label>
              Name
              <input
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            <label>
              Phone
              <input
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </label>
            <label>
              Company
              <input
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
              />
            </label>
            <label className="admin-full-row">
              Message
              <textarea
                rows="5"
                placeholder="Tell us what you want to build, improve, or automate"
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                required
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Message'}
            </button>
          </form>
        </article>
      </section>

      <StatusModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />

      <CtaBanner
        title="Ready to discuss your roadmap with our consulting team?"
        description="Share your requirements and Indocreonix will propose a practical implementation approach aligned with your business priorities."
        primaryLabel="Request Project Quote"
        primaryTo="/request-quote"
      />
    </>
  )
}

export default ContactPage
