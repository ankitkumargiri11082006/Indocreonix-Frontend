import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

const DOCS = [
  { key: 'aadhaar', label: 'Aadhaar Card', icon: '🏛️', hint: 'Front & back — PDF or clear image', accept: 'image/*,application/pdf' },
  { key: 'pan', label: 'PAN Card', icon: '📄', hint: 'Photocopy or scan — PDF or image', accept: 'image/*,application/pdf' },
  { key: 'academic', label: 'Academic Certificates', icon: '🎓', hint: 'Degree certificate & marksheets', accept: 'image/*,application/pdf' },
  { key: 'bank', label: 'Bank Passbook / Cheque', icon: '🏦', hint: 'First page showing account details', accept: 'image/*,application/pdf' },
  { key: 'photo', label: 'Passport Size Photo', icon: '🖼️', hint: '2 recent photos — JPG or PNG', accept: 'image/*' },
  { key: 'emergency', label: 'Emergency Contact Form', icon: '📞', hint: 'Name, relation & phone (any format)', accept: 'image/*,application/pdf' },
]

export default function CareerOnboardingDocsPage() {
  const [params] = useSearchParams()
  const appId = params.get('token') || ''

  const [files, setFiles] = useState({})
  const [dragOver, setDragOver] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const fileRefs = useRef({})

  useEffect(() => {
    document.title = 'Submit Onboarding Documents — Indocreonix'
  }, [])

  function handleFileChange(key, e) {
    const file = e.target.files?.[0]
    if (file) setFiles(prev => ({ ...prev, [key]: file }))
  }

  function handleDrop(key, e) {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files?.[0]
    if (file) setFiles(prev => ({ ...prev, [key]: file }))
  }

  function removeFile(key) {
    setFiles(prev => { const n = { ...prev }; delete n[key]; return n })
    if (fileRefs.current[key]) fileRefs.current[key].value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const required = ['aadhaar', 'pan', 'academic', 'bank', 'photo']
    const missing = required.filter(k => !files[k])
    if (missing.length) {
      setError(`Please upload all required documents: ${missing.map(k => DOCS.find(d => d.key === k)?.label).join(', ')}`)
      return
    }
    if (!appId) {
      setError('Invalid link — application ID is missing. Please use the link from your email.')
      return
    }

    setSubmitting(true)
    setProgress(10)

    const fd = new FormData()
    DOCS.forEach(({ key }) => { if (files[key]) fd.append(key, files[key]) })

    try {
      setProgress(40)
      const res = await fetch(`${API_BASE}/careers/applications/${appId}/submit-onboarding-docs`, {
        method: 'POST',
        body: fd,
      })
      setProgress(80)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Upload failed')
      setProgress(100)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="odp-page">
        <div className="odp-card odp-success-card">
          <div className="odp-success-icon">✅</div>
          <h1 className="odp-success-title">Documents Submitted!</h1>
          <p className="odp-success-body">
            Your onboarding documents have been received successfully.<br />
            Our HR team will review them and contact you within <strong>1–2 business days</strong>.
          </p>
          <div className="odp-success-footer">
            <span>Questions?</span>
            <a href="mailto:hr@indocreonix.com">hr@indocreonix.com</a>
          </div>
        </div>
      </div>
    )
  }

  const uploadedCount = Object.keys(files).length
  const totalDocs = DOCS.length

  return (
    <div className="odp-page">
      <div className="odp-container">

        {/* Header */}
        <div className="odp-header">
          <div className="odp-logo-badge">
            <img src="/logo.png" alt="Indocreonix" className="odp-logo" onError={e => { e.target.style.display = 'none' }} />
          </div>
          <div className="odp-eyebrow">Indocreonix Infotech</div>
          <h1 className="odp-title">Onboarding Document <span className="odp-title-highlight">Submission</span></h1>
          <p className="odp-subtitle">
            Please upload the required documents below to complete your onboarding process.
            All files are securely transmitted and stored.
          </p>

          {/* Progress bar */}
          <div className="odp-progress-wrap">
            <div className="odp-progress-bar">
              <div className="odp-progress-fill" style={{ width: `${(uploadedCount / totalDocs) * 100}%` }} />
            </div>
            <span className="odp-progress-label">{uploadedCount} of {totalDocs} documents ready</span>
          </div>
        </div>

        {/* Info banner */}
        <div className="odp-info-banner">
          <span className="odp-info-icon">🔒</span>
          <span>Your documents are encrypted during transfer and stored securely. We never share your personal information with third parties.</span>
        </div>

        {/* Form */}
        <form className="odp-form" onSubmit={handleSubmit}>
          <div className="odp-docs-grid">
            {DOCS.map(({ key, label, icon, hint, accept }) => {
              const file = files[key]
              const isRequired = ['aadhaar','pan','academic','bank','photo'].includes(key)
              return (
                <div
                  key={key}
                  className={`odp-doc-card${file ? ' odp-doc-card--filled' : ''}${dragOver === key ? ' odp-doc-card--drag' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(key) }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => handleDrop(key, e)}
                >
                  <div className="odp-doc-header">
                    <span className="odp-doc-icon">{icon}</span>
                    <div className="odp-doc-meta">
                      <div className="odp-doc-label">
                        {label}
                        {isRequired && <span className="odp-required">*</span>}
                      </div>
                      <div className="odp-doc-hint">{hint}</div>
                    </div>
                    {file && (
                      <button type="button" className="odp-doc-remove" onClick={() => removeFile(key)} title="Remove">✕</button>
                    )}
                  </div>

                  {file ? (
                    <div className="odp-doc-preview">
                      <span className="odp-doc-preview-icon">📎</span>
                      <span className="odp-doc-filename">{file.name}</span>
                      <span className="odp-doc-filesize">({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                  ) : (
                    <div className="odp-doc-dropzone" onClick={() => fileRefs.current[key]?.click()}>
                      <span className="odp-dropzone-icon">⬆️</span>
                      <span className="odp-dropzone-text">Click to browse or drag & drop</span>
                      <span className="odp-dropzone-hint">PDF, JPG, PNG — max 5 MB</span>
                    </div>
                  )}

                  <input
                    ref={el => fileRefs.current[key] = el}
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(key, e)}
                  />
                </div>
              )
            })}
          </div>

          {error && (
            <div className="odp-error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          {submitting && (
            <div className="odp-upload-progress">
              <div className="odp-upload-bar">
                <div className="odp-upload-fill" style={{ width: `${progress}%` }} />
              </div>
              <span>Uploading securely… {progress}%</span>
            </div>
          )}

          <button type="submit" className="odp-submit-btn" disabled={submitting}>
            {submitting ? (
              <><span className="odp-spinner" />Uploading Documents…</>
            ) : (
              <>📤 Submit All Documents</>
            )}
          </button>

          <p className="odp-required-note">* Required document</p>
        </form>

        {/* Footer */}
        <div className="odp-footer">
          <p>Need help? Contact us at <a href="mailto:hr@indocreonix.com">hr@indocreonix.com</a></p>
          <p>&copy; {new Date().getFullYear()} Indocreonix Infotech. All rights reserved.</p>
        </div>

      </div>
    </div>
  )
}
