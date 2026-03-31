import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const MAX_MB = 5
const MAX_BYTES = MAX_MB * 1024 * 1024

export default function CareerOnboardingDocsPage() {
  const [params] = useSearchParams()
  const appId = params.get('token') || ''

  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    document.title = 'Submit Onboarding Documents — Indocreonix'
  }, [])

  function pickFile(chosen) {
    setError('')
    if (!chosen) return
    if (chosen.type !== 'application/pdf') {
      setError('Only PDF files are accepted. Please merge all your documents into one PDF.')
      return
    }
    if (chosen.size > MAX_BYTES) {
      setError(`File is too large (${(chosen.size / 1024 / 1024).toFixed(1)} MB). Maximum size is ${MAX_MB} MB.`)
      return
    }
    setFile(chosen)
  }

  function handleInputChange(e) { pickFile(e.target.files?.[0]) }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  function removeFile() {
    setFile(null)
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!file) { setError('Please select your PDF document first.'); return }
    if (!appId) { setError('Invalid link. Please use the link from your email.'); return }

    setSubmitting(true)
    setProgress(15)

    const fd = new FormData()
    fd.append('documents', file)

    try {
      setProgress(40)
      const res = await fetch(`${API_BASE}/careers/applications/${appId}/submit-onboarding-docs`, {
        method: 'POST',
        body: fd,
      })
      setProgress(85)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Upload failed. Please try again.')
      setProgress(100)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Success state ── */
  if (done) {
    return (
      <div className="odp-page">
        <div className="odp-card">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h1 className="odp-card-title">Documents Received!</h1>
          <p className="odp-card-body">
            Your onboarding document has been submitted successfully.<br />
            Our HR team will review it and contact you within <strong>1–2 working days</strong>.
          </p>
          <div className="odp-card-footer">
            Questions? &nbsp;<a href="mailto:hr@indocreonix.com">hr@indocreonix.com</a>
          </div>
        </div>
      </div>
    )
  }

  /* ── Invalid link state ── */
  if (!appId) {
    return (
      <div className="odp-page">
        <div className="odp-card" style={{ borderColor: 'rgba(248,113,113,0.4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 className="odp-card-title">Invalid Link</h1>
          <p className="odp-card-body">
            This link is missing a required parameter.<br />
            Please use the <strong>Upload Documents</strong> button from the HR email.
          </p>
          <div className="odp-card-footer">
            <a href="mailto:hr@indocreonix.com">hr@indocreonix.com</a>
          </div>
        </div>
      </div>
    )
  }

  const pct = file ? Math.round((file.size / MAX_BYTES) * 100) : 0

  /* ── Main form ── */
  return (
    <div className="odp-page">
      <div className="odp-wrap">

        {/* Header */}
        <div className="odp-header">
          <img
            src="/logo.png"
            alt="Indocreonix"
            className="odp-logo"
            onError={e => { e.target.style.display = 'none' }}
          />
          <p className="odp-eyebrow">Indocreonix Infotech · HR Portal</p>
          <h1 className="odp-title">
            Submit Your<br />
            <span className="odp-highlight">Onboarding Documents</span>
          </h1>
          <p className="odp-subtitle">
            Merge all required documents into a <strong>single PDF</strong> and upload it below.<br />
            Aadhaar · PAN · Certificates · Bank Passbook · Passport Photo
          </p>
        </div>

        {/* Upload card */}
        <form className="odp-form" onSubmit={handleSubmit}>

          {!file ? (
            /* Drop zone */
            <div
              className={`odp-dropzone${dragOver ? ' odp-dropzone--active' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="odp-dz-icon">📄</div>
              <p className="odp-dz-main">Click to select or drag &amp; drop your PDF</p>
              <p className="odp-dz-sub">PDF only &mdash; maximum {MAX_MB} MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            /* File preview */
            <div className="odp-preview">
              <div className="odp-preview-icon">📎</div>
              <div className="odp-preview-info">
                <div className="odp-preview-name">{file.name}</div>
                <div className="odp-preview-meta">
                  {(file.size / 1024 / 1024).toFixed(2)} MB &mdash; PDF document
                </div>
                {/* Size bar */}
                <div className="odp-size-bar">
                  <div className="odp-size-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
              <button type="button" className="odp-remove" onClick={removeFile} title="Remove">✕</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="odp-error">⚠️&nbsp; {error}</div>
          )}

          {/* Upload progress */}
          {submitting && (
            <div className="odp-upload-progress">
              <div className="odp-upload-track">
                <div className="odp-upload-fill" style={{ width: `${progress}%` }} />
              </div>
              <span>Uploading… {progress}%</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="odp-submit"
            disabled={submitting || !file}
          >
            {submitting
              ? <><span className="odp-spin" /> Uploading…</>
              : <>📤&nbsp; Submit Document</>
            }
          </button>

          <p className="odp-note">
            🔒 All files are encrypted in transit and stored securely.
          </p>
        </form>

        {/* Footer */}
        <p className="odp-footer">
          Need help? &nbsp;<a href="mailto:hr@indocreonix.com">hr@indocreonix.com</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          &copy; {new Date().getFullYear()} Indocreonix Infotech
        </p>
      </div>
    </div>
  )
}
