import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function AdminLeadsPage() {
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')

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
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company || '-'}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

export default AdminLeadsPage
