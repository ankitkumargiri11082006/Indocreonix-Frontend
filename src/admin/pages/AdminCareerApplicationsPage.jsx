import { Fragment, useEffect, useState } from 'react'
import { apiBaseUrl, apiRequest } from '../../lib/apiClient'
import AdminDocumentCenter from '../components/AdminDocumentCenter'
import { useDialog } from '../../components/DialogProvider'

function AdminCareerApplicationsPage() {
  const { alert, confirm, customForm } = useDialog()
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
  const [expandedRows, setExpandedRows] = useState({})

  function toggleExpandedRow(id) {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

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

  async function updateStatus(id, status, extraNote = '') {
    try {
      const body = { status };
      if (extraNote) {
        // If there's an extra note, we append it to the existing note on the backend, or just send it and let backend handle.
        // Actually, let's just fetch the item to get its current notes and append, but we don't have the item here easily.
        // I will pass the full item to this function.
      }
      await apiRequest(`/careers/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function promptStatusChange(item, newStatus) {
    if (item.status === newStatus) return;

    const result = await customForm({
      title: `Update Status`,
      message: `Change application status to ${newStatus.toUpperCase()} for ${item.fullName}?`,
      submitText: 'Confirm Update',
      fields: [
        { name: 'note', label: 'Add Admin Note (Optional)', type: 'textarea', placeholder: 'Reason for rejection, interview feedback, etc.' }
      ]
    });

    if (!result) {
      // Re-render to reset select value
      setItems((prev) => [...prev]);
      return; 
    }

    try {
      const body = { status: newStatus };
      if (result.note && result.note.trim()) {
        const existingNote = draftNotes[item._id] ?? item.adminNotes ?? '';
        const appendedNote = existingNote ? `${existingNote}\n[${newStatus.toUpperCase()}] ${result.note.trim()}` : `[${newStatus.toUpperCase()}] ${result.note.trim()}`;
        body.adminNotes = appendedNote;
        setDraftNotes(prev => ({ ...prev, [item._id]: appendedNote }));
      }

      await apiRequest(`/careers/applications/${item._id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
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
      await alert('Onboarding documents request email sent to the candidate.', 'Success')
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSendingRequest((prev) => ({ ...prev, [id]: false }))
    }
  }

  async function removeApplication(id) {
    const confirmed = await confirm('Delete this application permanently? CV will also be deleted from Cloudinary.', 'Delete Application')
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
    const confirmed = await confirm('Delete the onboarding PDF for this applicant? They will need to re-upload it.', 'Delete Document')
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

  async function askOfferLetterPayload(item) {
    const existing = item.offerLetter || {}
    return await customForm({
      title: 'Generate Offer Letter',
      submitText: 'Generate',
      fields: [
        { name: 'offerType', label: 'Offer Type', type: 'select', options: [{label: 'Internship', value: 'internship'}, {label: 'Job', value: 'job'}], defaultValue: 'internship', required: true },
        { name: 'candidateName', label: 'Candidate Name', defaultValue: existing.candidateName || item.fullName || '', required: true },
        { name: 'candidateAddress', label: 'Candidate Address', defaultValue: existing.candidateAddress || item.city || '', required: true },
        { name: 'role', label: 'Role', defaultValue: existing.role || item.opportunity?.title || item.roleType || '', required: true },
        { name: 'startDate', label: 'Start Date (e.g. May 1, 2026)', defaultValue: existing.startDate || '', required: true },
        { name: 'duration', label: 'Duration (optional)', defaultValue: existing.duration || '', condition: (data) => data.offerType === 'internship' },
        { name: 'stipend', label: 'Stipend / Salary (e.g. $1500 / month)', defaultValue: existing.stipend || '', required: true }
      ]
    });
  }

  async function askCertificatePayload(item) {
    const existing = item.certificate || {}
    return await customForm({
      title: 'Generate Certificate',
      submitText: 'Generate',
      fields: [
        { name: 'fullName', label: 'Candidate Full Name', defaultValue: existing.fullName || item.fullName || '', required: true },
        { name: 'courseTitle', label: 'Course/Role Title', defaultValue: existing.courseTitle || item.opportunity?.title || '', required: true },
        { name: 'completionDate', label: 'Completion Date (e.g. April 4, 2026)', defaultValue: existing.completionDate || '', required: true }
      ]
    });
  }

  async function sendOfferLetter(item) {
    const payload = await askOfferLetterPayload(item)
    if (!payload) return

    try {
      setError('')
      setIsSendingOffer((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/offer-letter/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await alert('Offer letter generated and marked as awaiting admin approval.', 'Success')
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
    const payload = await askCertificatePayload(item)
    if (!payload) return

    try {
      setError('')
      setIsSendingCertificate((prev) => ({ ...prev, [item._id]: true }))
      await apiRequest(`/careers/applications/${item._id}/certificate/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await alert('Certificate generated and marked as awaiting admin approval.', 'Success')
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
    const confirmed = await confirm('Delete generated offer letter for this applicant?', 'Delete Offer Letter')
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
    const confirmed = await confirm('Delete generated certificate for this applicant?', 'Delete Certificate')
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
        <table className="admin-table admin-table-applications">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Type</th>
              <th>Opening</th>
              <th>CV</th>
              <th>Status</th>
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
              const createdAtLabel = item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'
              const uaRaw = String(item.userAgent || '').trim()
              const isExpanded = Boolean(expandedRows[item._id])

              return (
                <Fragment key={item._id}>
                  <tr className={isExpanded ? 'admin-row-selected' : ''}>
                    <td>
                      <div className="admin-inline-stack" style={{ gap: '2px' }}>
                        <strong>{item.fullName}</strong>
                        <small className="admin-meta">{item.email}</small>
                      </div>
                    </td>
                    <td>{item.roleType}</td>
                    <td>{item.opportunity?.title || 'General'}</td>
                    <td>
                      <a href={item.cvUrl} target="_blank" rel="noreferrer" className="contact-link">
                        View CV
                      </a>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={item.status}
                        onChange={(e) => promptStatusChange(item, e.target.value)}
                      >
                        <option value="new">new</option>
                        <option value="reviewing">reviewing</option>
                        <option value="shortlisted">shortlisted</option>
                        <option value="rejected">rejected</option>
                        <option value="hired">hired</option>
                      </select>
                    </td>
                    <td>
                      <div className="admin-action-group admin-app-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => toggleExpandedRow(item._id)}
                        >
                          {isExpanded ? 'Hide' : 'View more'}
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => removeApplication(item._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded ? (
                    <tr className="admin-app-row-sub admin-row-selected-sub">
                      <td colSpan={6}>
                        <div className="admin-app-details">
                          <div className="admin-inline-stack" style={{ gap: '12px' }}>
                            <div className="admin-inline-stack" style={{ gap: '6px' }}>
                              <strong>Onboarding Docs</strong>
                              {item.onboardingDocsUrl ? (
                                <div className="admin-inline-stack" style={{ gap: '6px', alignItems: 'flex-start' }}>
                                  <div className="admin-action-group admin-app-actions">
                                    <a
                                      href={item.onboardingDocsUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="btn btn-secondary"
                                    >
                                      View
                                    </a>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() => removeOnboardingDocs(item._id)}
                                      disabled={isRemovingDocs[item._id]}
                                    >
                                      {isRemovingDocs[item._id] ? 'Deleting...' : 'Delete PDF'}
                                    </button>
                                  </div>
                                  <small className="admin-meta">
                                    {docsName}
                                    {docsSizeLabel ? ` · ${docsSizeLabel}` : ''}
                                    {docsUploadedAt ? ` · Uploaded ${docsUploadedAt}` : ''}
                                  </small>
                                </div>
                              ) : (
                                <div className="admin-inline-stack" style={{ gap: '6px', alignItems: 'flex-start' }}>
                                  <small className="admin-meta">Pending upload</small>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => sendOnboardingDocsRequest(item._id)}
                                    disabled={isSendingRequest[item._id]}
                                  >
                                    {isSendingRequest[item._id] ? 'Sending...' : 'Request Docs'}
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="admin-inline-stack" style={{ gap: '6px' }}>
                              <strong>Document Center</strong>
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
                            </div>
                          </div>

                          <div className="admin-inline-stack" style={{ gap: '10px' }}>
                            <div className="admin-inline-stack" style={{ gap: '6px' }}>
                              <strong>Admin Notes</strong>
                              <textarea
                                className="admin-app-notes"
                                rows="3"
                                value={draftNotes[item._id] ?? item.adminNotes ?? ''}
                                onChange={(e) =>
                                  setDraftNotes((prev) => ({ ...prev, [item._id]: e.target.value }))
                                }
                              />
                              <div className="admin-action-group admin-app-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => saveNotes(item._id)}>
                                  Save Note
                                </button>
                              </div>
                            </div>

                            <div className="admin-inline-stack" style={{ gap: '4px' }}>
                              <strong>Details</strong>
                              <small className="admin-meta">Created: {createdAtLabel}</small>
                              <small className="admin-meta">IP: {item.ip || '-'}</small>
                              <small className="admin-meta" title={uaRaw}>
                                User Agent: {uaRaw || '-'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminCareerApplicationsPage
