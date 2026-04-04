import { useEffect, useState } from 'react'
import { apiBaseUrl, apiRequest } from '../../lib/apiClient'
import AdminDocumentCenter from '../components/AdminDocumentCenter'

function AdminCareerApplicationsPage() {
  const activeApiBase = apiBaseUrl()
  const [items, setItems] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState('')
  const [draftNotes, setDraftNotes] = useState({})
  const [isSendingRequest, setIsSendingRequest] = useState({})
  const [isRemovingDocs, setIsRemovingDocs] = useState({})
  const [isSendingOffer, setIsSendingOffer] = useState({})
  const [isSendingCertificate, setIsSendingCertificate] = useState({})
  const [isUpdatingOfferApproval, setIsUpdatingOfferApproval] = useState({})
  const [isUpdatingCertificateApproval, setIsUpdatingCertificateApproval] = useState({})
  const [isDeletingOffer, setIsDeletingOffer] = useState({})
  const [isDeletingCertificate, setIsDeletingCertificate] = useState({})

  function formatDocSize(bytes) {
    if (!bytes || Number.isNaN(bytes)) return ''
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${bytes} B`
  }

  async function loadItems() {
    try {
      const query = filterType === 'all' ? '' : `?roleType=${filterType}`
      const result = await apiRequest(`/careers/applications${query}`)
      setItems(result.items || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadItems()
  }, [filterType])

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/careers/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function saveNotes(id) {
    try {
      await apiRequest(`/careers/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNotes: draftNotes[id] || '' }),
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function sendOnboardingDocsRequest(id) {
    try {
      setError('')
      setIsSendingRequest((prev) => ({ ...prev, [id]: true }))
      await apiRequest(`/careers/applications/${id}/request-onboarding-docs`, {
        method: 'POST',
      })
      window.alert('Onboarding documents request email sent to the candidate.')
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSendingRequest((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function removeApplication(id) {
    const confirmed = window.confirm('Delete this application permanently? CV will also be deleted from Cloudinary.')
    if (!confirmed) return

    try {
      await apiRequest(`/careers/applications/${id}`, {
        method: 'DELETE',
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeOnboardingDocs(id) {
    const confirmed = window.confirm('Delete the onboarding PDF for this applicant? They will need to re-upload it.')
    if (!confirmed) return

    try {
      setError('')
      setIsRemovingDocs((prev) => ({ ...prev, [id]: true }))
      await apiRequest(`/careers/applications/${id}/onboarding-docs`, {
        method: 'DELETE',
      })
      setItems((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                onboardingDocsUrl: '',
                onboardingDocsSubmittedAt: null,
                onboardingDocsPublicId: '',
                onboardingDocsOriginalName: '',
                onboardingDocsBytes: 0,
              }
            : item
        )
      )
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRemovingDocs((prev) => ({ ...prev, [id]: false }))
    }
  }

  function askOfferLetterPayload(item) {
    const existing = item.offerLetter || {}
    const candidateName = window.prompt('Candidate name', existing.candidateName || item.fullName || '')
    if (candidateName === null) return null
    const candidateAddress = window.prompt('Candidate address', existing.candidateAddress || item.city || '')
    if (candidateAddress === null) return null
    const role = window.prompt('Role', existing.role || item.opportunity?.title || item.roleType || '')
    if (role === null) return null
    const startDate = window.prompt('Start date (example: May 1, 2026)', existing.startDate || '')
    if (startDate === null) return null
    const duration = window.prompt('Duration (example: 3 Months)', existing.duration || '')
    if (duration === null) return null
    const stipend = window.prompt('Stipend (example: $1500 / month)', existing.stipend || '')
    if (stipend === null) return null

    return {
      candidateName,
      candidateAddress,
      role,
      startDate,
      duration,
      stipend,
    }
  }

  function askCertificatePayload(item) {
    const existing = item.certificate || {}
    const fullName = window.prompt('Candidate full name', existing.fullName || item.fullName || '')
    if (fullName === null) return null
    const courseTitle = window.prompt('Course title', existing.courseTitle || item.opportunity?.title || '')
    if (courseTitle === null) return null
    const completionDate = window.prompt('Completion date (example: April 4, 2026)', existing.completionDate || '')
    if (completionDate === null) return null

    return {
      fullName,
      courseTitle,
      completionDate,
    }
  }

  async function sendOfferLetter(item) {
    const payload = askOfferLetterPayload(item)
    if (!payload) return

    try {
      setError('')
      setIsSendingOffer((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/offer-letter/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      window.alert('Offer letter generated and marked as awaiting admin approval.')
      loadItems()
    } catch (err) {
      if (Number(err?.status) === 404) {
        setError('Offer-letter API route is not available on current backend deployment. Redeploy backend with latest code and retry.')
      } else {
        setError(err.message)
      }
    } finally {
      setIsSendingOffer((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function sendCertificate(item) {
    const payload = askCertificatePayload(item)
    if (!payload) return

    try {
      setError('')
      setIsSendingCertificate((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/certificate/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      window.alert('Certificate generated and marked as awaiting admin approval.')
      loadItems()
    } catch (err) {
      if (Number(err?.status) === 404) {
        setError('Certificate API route is not available on current backend deployment. Redeploy backend with latest code and retry.')
      } else {
        setError(err.message)
      }
    } finally {
      setIsSendingCertificate((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function setOfferApproval(item, approved) {
    try {
      setError('')
      setIsUpdatingOfferApproval((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/offer-letter/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdatingOfferApproval((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function setCertificateApproval(item, approved) {
    try {
      setError('')
      setIsUpdatingCertificateApproval((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/certificate/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approved }),
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdatingCertificateApproval((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function deleteOfferLetter(item) {
    const confirmed = window.confirm('Delete generated offer letter for this applicant?')
    if (!confirmed) return

    try {
      setError('')
      setIsDeletingOffer((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/offer-letter`, {
        method: 'DELETE',
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDeletingOffer((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function deleteCertificate(item) {
    const confirmed = window.confirm('Delete generated certificate for this applicant?')
    if (!confirmed) return

    try {
      setError('')
      setIsDeletingCertificate((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/certificate`, {
        method: 'DELETE',
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsDeletingCertificate((prev) => ({ ...prev, [item._id]: false }))
    }
  }

  async function exportCsv() {
    try {
      setError('')
      const token = localStorage.getItem('indocx_token')
      const params = new URLSearchParams()
      if (filterType !== 'all') params.set('roleType', filterType)

      const response = await fetch(`${apiBaseUrl()}/careers/applications/export.csv?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to export CSV')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      link.href = url
      link.download = `career-applications-${date}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <article className="admin-card wide">
      <h3>Career Applications (CV in Cloudinary)</h3>
      <p className="admin-meta" style={{ marginTop: '-4px' }}>
        API base: {activeApiBase}
      </p>
      <div className="admin-toolbar">
        <label>
          Filter by Type
          <select className="admin-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">all</option>
            <option value="internship">internship</option>
            <option value="job">job</option>
          </select>
        </label>
        <div className="admin-form-actions">
          <button type="button" className="btn btn-primary" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Opening</th>
              <th>Email</th>
              <th>CV</th>
              <th>Onboarding Docs</th>
              <th>Document Center</th>
              <th>Status</th>
              <th>Admin Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const docsUploadedAt = item.onboardingDocsSubmittedAt
                ? new Date(item.onboardingDocsSubmittedAt).toLocaleString()
                : ''
              const docsName = item.onboardingDocsOriginalName || 'Onboarding document'
              const docsSizeLabel = formatDocSize(item.onboardingDocsBytes)
              const offerSentAt = item.offerLetter?.sentAt ? new Date(item.offerLetter.sentAt).toLocaleString() : 'Not sent'
              const certificateSentAt = item.certificate?.sentAt ? new Date(item.certificate.sentAt).toLocaleString() : 'Not sent'

              return (
                <tr key={item._id}>
                  <td>{item.fullName}</td>
                  <td>{item.roleType}</td>
                  <td>{item.opportunity?.title || 'General'}</td>
                  <td>{item.email}</td>
                  <td>
                    <a href={item.cvUrl} target="_blank" rel="noreferrer" className="contact-link">View CV</a>
                  </td>
                  <td>
                    {item.onboardingDocsUrl ? (
                      <div className="admin-inline-stack" style={{ gap: '6px', alignItems: 'flex-start' }}>
                        <a
                          href={item.onboardingDocsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="contact-link"
                        >
                          View Docs
                        </a>
                        <small className="admin-meta">
                          {docsName}
                          {docsSizeLabel ? ` · ${docsSizeLabel}` : ''}
                        </small>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeOnboardingDocs(item._id)}
                          disabled={isRemovingDocs[item._id]}
                        >
                          {isRemovingDocs[item._id] ? 'Deleting...' : 'Delete PDF'}
                        </button>
                        {docsUploadedAt ? (
                          <small className="admin-meta">Uploaded {docsUploadedAt}</small>
                        ) : null}
                      </div>
                    ) : (
                      <span className="admin-meta" style={{ color: '#9ca3af' }}>Pending upload</span>
                    )}
                  </td>
                  <td>
                    <AdminDocumentCenter
                      item={item}
                      manage={true}
                      offerMetaText={offerSentAt}
                      certificateMetaText={certificateSentAt}
                      onSendOffer={() => sendOfferLetter(item)}
                      onSendCertificate={() => sendCertificate(item)}
                      onToggleOfferApproval={() => setOfferApproval(item, !item.offerLetter?.isApproved)}
                      onToggleCertificateApproval={() => setCertificateApproval(item, !item.certificate?.isApproved)}
                      onDeleteOffer={() => deleteOfferLetter(item)}
                      onDeleteCertificate={() => deleteCertificate(item)}
                      isSendingOffer={Boolean(isSendingOffer[item._id])}
                      isSendingCertificate={Boolean(isSendingCertificate[item._id])}
                      isUpdatingOfferApproval={Boolean(isUpdatingOfferApproval[item._id])}
                      isUpdatingCertificateApproval={Boolean(isUpdatingCertificateApproval[item._id])}
                      isDeletingOffer={Boolean(isDeletingOffer[item._id])}
                      isDeletingCertificate={Boolean(isDeletingCertificate[item._id])}
                    />
                  </td>
                  <td>
                    <select className="admin-select" value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)}>
                      <option value="new">new</option>
                      <option value="reviewing">reviewing</option>
                      <option value="shortlisted">shortlisted</option>
                      <option value="rejected">rejected</option>
                      <option value="hired">hired</option>
                    </select>
                  </td>
                  <td>
                    <div className="admin-inline-stack">
                      <textarea
                        rows="2"
                        value={draftNotes[item._id] ?? item.adminNotes ?? ''}
                        onChange={(e) => setDraftNotes((prev) => ({ ...prev, [item._id]: e.target.value }))}
                      />
                      <button type="button" className="btn btn-secondary" onClick={() => saveNotes(item._id)}>
                        Save Note
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-action-group" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => sendOnboardingDocsRequest(item._id)}
                        disabled={isSendingRequest[item._id]}
                      >
                        {isSendingRequest[item._id] ? 'Sending...' : 'Request Docs'}
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => removeApplication(item._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminCareerApplicationsPage
