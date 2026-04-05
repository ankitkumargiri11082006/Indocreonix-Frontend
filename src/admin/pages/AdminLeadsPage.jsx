import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function formatUserAgent(value) {
  const raw = String(value || '').trim()
  if (!raw) return '-'
  const max = 48
  return raw.length > max ? `${raw.slice(0, max)}…` : raw
}

function AdminLeadsPage() {
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [deletingLeadId, setDeletingLeadId] = useState('')

  async function loadLeads() {
    try {
      const result = await apiRequest('/leads')
      setLeads(result.leads || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      loadLeads()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteLead(id, leadName) {
    const confirmed = window.confirm(
      `Delete lead ${leadName || ''}? This action cannot be undone.`,
    )
    if (!confirmed) return

    try {
      setDeletingLeadId(id)
      await apiRequest(`/leads/${id}`, { method: 'DELETE' })
      loadLeads()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingLeadId('')
    }
  }

  return (
    <article className="admin-card wide">
      <h3>Lead Inbox</h3>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Created</th>
              <th>IP</th>
              <th>User Agent</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company || '-'}</td>
                <td>{formatDateTime(lead.createdAt)}</td>
                <td>{lead.ip || '-'}</td>
                <td title={lead.userAgent || ''}>{formatUserAgent(lead.userAgent)}</td>
                <td>{lead.status}</td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead._id, e.target.value)}
                    className="admin-select"
                  >
                    <option value="new">new</option>
                    <option value="in_progress">in_progress</option>
                    <option value="closed">closed</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteLead(lead._id, lead.name)}
                    disabled={deletingLeadId === lead._id}
                  >
                    {deletingLeadId === lead._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminLeadsPage
