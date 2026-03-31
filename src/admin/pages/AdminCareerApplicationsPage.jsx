import { useEffect, useState } from 'react'
import { apiBaseUrl, apiRequest } from '../../lib/apiClient'

function AdminCareerApplicationsPage() {
  const [items, setItems] = useState([])
  const [filterType, setFilterType] = useState('all')
  const [error, setError] = useState('')
  const [draftNotes, setDraftNotes] = useState({})
  const [isSendingRequest, setIsSendingRequest] = useState({})

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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Opening</th>
              <th>Email</th>
              <th>CV</th>
              <th>Docs</th>
              <th>Status</th>
              <th>Admin Notes</th>
              <th style={{ minWidth: '130px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
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
                    <a
                      href={item.onboardingDocsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="contact-link"
                      style={{ color: '#34a853', fontWeight: 700 }}
                    >
                      📄 View Docs
                    </a>
                  ) : (
                    <span style={{ color: '#9aa0a6', fontSize: '0.78rem' }}>—</span>
                  )}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => sendOnboardingDocsRequest(item._id)}
                      disabled={isSendingRequest[item._id]}
                    >
                      {isSendingRequest[item._id] ? 'Sending...' : 'Request Docs'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => removeApplication(item._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminCareerApplicationsPage
