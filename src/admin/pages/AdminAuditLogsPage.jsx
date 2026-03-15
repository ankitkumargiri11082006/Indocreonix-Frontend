import { Fragment, useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function AdminAuditLogsPage() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 20 })
  const [filters, setFilters] = useState({ action: '', actorEmail: '', from: '', to: '' })
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState('')

  async function loadLogs(page = 1) {
    try {
      setError('')
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(pagination.limit || 20))
      if (filters.action.trim()) params.set('action', filters.action.trim())
      if (filters.actorEmail.trim()) params.set('actorEmail', filters.actorEmail.trim())
      if (filters.from) params.set('from', filters.from)
      if (filters.to) params.set('to', filters.to)

      const result = await apiRequest(`/audit-logs?${params.toString()}`)
      setItems(result.items || [])
      setPagination(result.pagination || { page: 1, totalPages: 1, total: 0, limit: 20 })
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadLogs(1)
  }, [])

  function applyFilters(event) {
    event.preventDefault()
    loadLogs(1)
  }

  return (
    <article className="admin-card wide">
      <h3>Audit Logs</h3>
      <p>Track admin-sensitive actions like exports and status updates.</p>

      <form className="admin-form-grid" onSubmit={applyFilters}>
        <label>
          Action
          <input
            value={filters.action}
            onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
            placeholder="EXPORT_CAREER_APPLICATIONS_CSV"
          />
        </label>

        <label>
          Actor Email
          <input
            value={filters.actorEmail}
            onChange={(e) => setFilters((prev) => ({ ...prev, actorEmail: e.target.value }))}
            placeholder="admin@company.com"
          />
        </label>

        <label>
          From Date
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
          />
        </label>

        <label>
          To Date
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
          />
        </label>

        <button type="submit" className="btn btn-primary">Apply Filters</button>
      </form>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isExpanded = expandedId === item._id

              return (
                <Fragment key={item._id}>
                  <tr>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                    <td>{item.action}</td>
                    <td>{item.entity}</td>
                    <td>{item.entityId || '-'}</td>
                    <td>{item.actor?.email || '-'}</td>
                    <td>{item.actor?.role || '-'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setExpandedId((prev) => (prev === item._id ? '' : item._id))}
                      >
                        {isExpanded ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="audit-log-detail-box">
                          <div className="audit-log-detail-grid">
                            <div>
                              <p className="audit-log-detail-label">IP</p>
                              <p>{item.ip || '-'}</p>
                            </div>
                            <div>
                              <p className="audit-log-detail-label">User Agent</p>
                              <p>{item.userAgent || '-'}</p>
                            </div>
                          </div>
                          <p className="audit-log-detail-label">Metadata</p>
                          <pre className="audit-log-detail-pre">{JSON.stringify(item.metadata || {}, null, 2)}</pre>
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

      <div className="admin-pagination">
        <div className="admin-action-group">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={pagination.page <= 1}
            onClick={() => loadLogs(pagination.page - 1)}
          >
            Previous
          </button>
        </div>
        <p>
          Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
        </p>
        <div className="admin-action-group end">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => loadLogs(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </article>
  )
}

export default AdminAuditLogsPage
