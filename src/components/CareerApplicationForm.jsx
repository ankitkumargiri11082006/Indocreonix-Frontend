import { useState } from 'react'
import { companyInfo } from '../data/companyInfo'

function CareerApplicationForm({ roleType, title, subtitle, successMessage }) {
  const initialData = {
    fullName: '',
    email: '',
    phone: '',
    city: '',
    qualification: '',
    skills: '',
    experience: '',
    portfolio: '',
    message: '',
  }

  const [formData, setFormData] = useState(initialData)
  const [submitted, setSubmitted] = useState(false)

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setFormData(initialData)
  }

  return (
    <section className="container career-application-wrap">
      <article className="career-form-card career-form-single">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {submitted ? <p className="form-success">{successMessage}</p> : null}

        <form onSubmit={onSubmit} className="career-form">
          <label>
            Full Name
            <input name="fullName" value={formData.fullName} onChange={onChange} required />
          </label>
          <label>
            Email Address
            <input type="email" name="email" value={formData.email} onChange={onChange} required />
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
            Resume / Portfolio Link
            <input name="portfolio" value={formData.portfolio} onChange={onChange} placeholder="https://" required />
          </label>
          <label>
            Why are you a good fit?
            <textarea name="message" value={formData.message} onChange={onChange} rows="4" required />
          </label>
          <button type="submit" className="btn btn-primary">
            {roleType === 'internship' ? 'Submit Internship Application' : 'Submit Job Application'}
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
    </section>
  )
}

export default CareerApplicationForm