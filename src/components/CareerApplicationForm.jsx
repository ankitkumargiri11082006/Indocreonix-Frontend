import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { companyInfo } from '../data/companyInfo'
import { apiRequest, apiBaseUrl } from '../lib/apiClient'
import StatusModal from './StatusModal'
import { getPortalUser, PORTAL_TOKEN_KEY } from '../pages/portalAuthShared'

function CareerApplicationForm({ roleType, title, subtitle, successMessage }) {
  const [portalUser, setPortalUser] = useState(() => getPortalUser())

  function buildInitialData(user = null) {
    const profile = user || getPortalUser() || {}
    const locationParts = String(profile.location || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    return {
      opportunityId: '',
      fullName: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      city: locationParts[0] || '',
      qualification: '',
      skills: '',
      experience: '',
      portfolio: '',
      message: '',
      consentAccepted: false,
    }
  }

  const [formData, setFormData] = useState(() => buildInitialData(portalUser))
  const [cvFile, setCvFile] = useState(null)
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', type: 'success' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [opportunities, setOpportunities] = useState([])

  useEffect(() => {
    apiRequest(`/careers/opportunities/public?type=${roleType}`)
      .then((result) => setOpportunities(result.items || []))
      .catch(() => setOpportunities([]))
  }, [roleType])

  useEffect(() => {
    const syncPortalProfile = () => {
      const user = getPortalUser()
      setPortalUser(user)
      setFormData((previous) => ({
        ...previous,
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || previous.phone,
        city: user?.location
          ? String(user.location)
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)[0] || previous.city
          : previous.city,
      }))
    }

    window.addEventListener('portal-session-updated', syncPortalProfile)
    window.addEventListener('storage', syncPortalProfile)
    window.addEventListener('focus', syncPortalProfile)

    return () => {
      window.removeEventListener('portal-session-updated', syncPortalProfile)
      window.removeEventListener('storage', syncPortalProfile)
      window.removeEventListener('focus', syncPortalProfile)
    }
  }, [])

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (event) => {
        const portalToken = localStorage.getItem(PORTAL_TOKEN_KEY)
        if (!portalToken || !portalUser?.email) {
          setModalState({
            isOpen: true,
            title: 'Sign In Required',
            message: 'Please sign in to your portal account before applying for careers.',
            type: 'error',
          })
          return
        }

    event.preventDefault()
    if (loading) return
    setModalState({ ...modalState, isOpen: false })
    setSubmitted(false)

    if (!cvFile) {
      setModalState({
        isOpen: true,
        title: 'Missing Document',
        message: 'Please upload your CV in PDF format (max 2MB) to proceed with your application.',
        type: 'error'
      })
      return
    }

    if (cvFile.size > 2 * 1024 * 1024) {
      setModalState({
        isOpen: true,
        title: 'File Too Large',
        message: 'The CV file size exceeds our 2MB limit. Please compress your PDF and try again.',
        type: 'error'
      })
      return
    }

    if (!cvFile.name.toLowerCase().endsWith('.pdf')) {
      setModalState({
        isOpen: true,
        title: 'Invalid File Format',
        message: 'Only PDF documents are accepted for CV uploads. Please convert your file to PDF.',
        type: 'error'
      })
      return
    }

    if (!formData.consentAccepted) {
      setModalState({
        isOpen: true,
        title: 'Consent Required',
        message: 'Please review and accept Indocreonix Terms and Privacy Policy to submit your application.',
        type: 'error'
      })
      return
    }

    setLoading(true)

    const multipart = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      multipart.append(key, value)
    })
    multipart.append('roleType', roleType)
    multipart.append('cv', cvFile)

    try {
      const response = await fetch(`${apiBaseUrl()}/careers/applications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${portalToken}`,
        },
        body: multipart,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit application')
      }

      setModalState({
        isOpen: true,
        title: 'Application Received',
        message: 'Thank you for your interest in joining Indocreonix. Your application has been successfully submitted to our HR department. Our hiring team will carefully review your profile and contact you soon if your skills and experience align with our requirements.',
        type: 'success'
      })
      
      setFormData(buildInitialData(getPortalUser()))
      setCvFile(null)
      setSubmitted(true)
      // Reset file input manually if needed (omitted for simplicity as form resets)
    } catch (submissionError) {
      setModalState({
        isOpen: true,
        title: 'Application Error',
        message: submissionError.message || 'We encountered an error while submitting your application. Please try again or email your CV directly to our careers mailbox.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container career-application-wrap">
      <article className="career-form-card career-form-single">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {submitted ? <p className="form-success">{successMessage}</p> : null}

        <form onSubmit={onSubmit} className="career-form">
          {opportunities.length > 0 ? (
            <label>
              Select {roleType === 'internship' ? 'Internship' : 'Job'} Opening
              <select name="opportunityId" value={formData.opportunityId} onChange={onChange}>
                <option value="">General Application</option>
                {opportunities.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label>
            Full Name
            <input name="fullName" value={formData.fullName} onChange={onChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="email" value={formData.email} onChange={onChange} readOnly required />
          </label>
          <label>
            Mobile Number
            <input name="phone" value={formData.phone} onChange={onChange} required />
          </label>
          <label>
            Current City
            <input name="city" value={formData.city} onChange={onChange} required />
          </label>
          <label>
            Qualification
            <input name="qualification" value={formData.qualification} onChange={onChange} required />
          </label>
          <label>
            Skills / Tech Stack
            <input name="skills" value={formData.skills} onChange={onChange} required />
          </label>
          <label>
            {roleType === 'internship' ? 'Internship Duration (in months)' : 'Total Experience (in years)'}
            <input name="experience" value={formData.experience} onChange={onChange} required />
          </label>
          <label>
            Portfolio / LinkedIn Link (Optional)
            <input name="portfolio" value={formData.portfolio} onChange={onChange} placeholder="https://" />
          </label>
          <label>
            Upload CV (PDF only, max 2MB)
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setCvFile(event.target.files?.[0] || null)}
              required
            />
          </label>
          <label>
            Why are you a good fit?
            <textarea name="message" value={formData.message} onChange={onChange} rows="4" required />
          </label>
          <label className="career-consent-row">
            <input
              type="checkbox"
              name="consentAccepted"
              checked={formData.consentAccepted}
              onChange={onChange}
              required
            />
            <span>
              I agree to the Indocreonix{' '}
              <Link to="/terms-and-conditions" target="_blank" rel="noreferrer">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" target="_blank" rel="noreferrer">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading
              ? 'Submitting...'
              : roleType === 'internship'
                ? 'Submit Internship Application'
                : 'Submit Job Application'}
          </button>
        </form>

        <p className="career-form-note">
          You can also share your profile at{' '}
          <a href={`mailto:${companyInfo.careersEmail}`} className="contact-link">
            {companyInfo.careersEmail}
          </a>
          .
        </p>
      </article>

      <StatusModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </section>
  )
}

export default CareerApplicationForm