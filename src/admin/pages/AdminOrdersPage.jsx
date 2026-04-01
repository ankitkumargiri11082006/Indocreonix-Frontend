import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

const statusOptions = ['new', 'qualified', 'proposal_shared', 'in_discussion', 'won', 'lost']

function formatFileSize(bytes) {
  if (!bytes || Number.isNaN(bytes)) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [savingOrderId, setSavingOrderId] = useState('')
  const [deletingAttachmentKey, setDeletingAttachmentKey] = useState('')
  const [drafts, setDrafts] = useState({})

  async function loadOrders() {
    try {
      setError('')
      const result = await apiRequest('/orders')
      const items = result.items || []

      setOrders(items)
      setDrafts(
        items.reduce((accumulator, item) => {
          accumulator[item._id] = {
            status: item.status,
            adminNotes: item.adminNotes || '',
          }
          return accumulator
        }, {}),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const summary = useMemo(() => {
    const next = {
      total: orders.length,
      new: 0,
      inDiscussion: 0,
      won: 0,
    }

    orders.forEach((order) => {
      if (order.status === 'new') next.new += 1
      if (order.status === 'in_discussion') next.inDiscussion += 1
      if (order.status === 'won') next.won += 1
    })

    return next
  }, [orders])

  async function saveOrder(orderId) {
    const draft = drafts[orderId]
    if (!draft) return

    try {
      setSavingOrderId(orderId)
      setError('')

      await apiRequest(`/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: draft.status,
          adminNotes: draft.adminNotes,
        }),
      })

      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingOrderId('')
    }
  }

  async function deleteOrder(orderId, clientName) {
    if (!window.confirm(`Are you sure you want to permanently delete the project request from ${clientName}? This will also remove any uploaded documents from Cloudinary.`)) {
      return
    }

    try {
      setError('')
      await apiRequest(`/orders/${orderId}`, {
        method: 'DELETE',
      })
      await loadOrders()
    } catch (err) {
      setError(err.message)
    }
  }

  async function deletePrd(orderId, clientName) {
    if (!window.confirm(`Remove the PRD uploaded by ${clientName}? This frees Cloudinary storage but keeps the order.`)) {
      return
    }

    const stateKey = `prd-${orderId}`

    try {
      setDeletingAttachmentKey(stateKey)
      setError('')
      await apiRequest(`/orders/${orderId}/prd`, {
        method: 'DELETE',
      })
      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingAttachmentKey('')
    }
  }

  async function deleteSupportingDocument(orderId, documentId, documentName) {
    if (!window.confirm(`Remove supporting document "${documentName || 'File'}"? This keeps the request but deletes the file.`)) {
      return
    }

    const stateKey = `supporting-${orderId}-${documentId}`

    try {
      setDeletingAttachmentKey(stateKey)
      setError('')
      await apiRequest(`/orders/${orderId}/supporting/${documentId}`, {
        method: 'DELETE',
      })
      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingAttachmentKey('')
    }
  }

  return (
    <section className="admin-page-stack">
      <article className="admin-card wide">
        <h3>Project Orders</h3>
        <p className="admin-muted">Manage incoming project requests from products, services, and client-facing quote pages.</p>
        <div className="admin-mini-metrics">
          <div>
            <span>Total Requests</span>
            <strong>{summary.total}</strong>
          </div>
          <div>
            <span>New</span>
            <strong>{summary.new}</strong>
          </div>
          <div>
            <span>In Discussion / Won</span>
            <strong>
              {summary.inDiscussion} / {summary.won}
            </strong>
          </div>
        </div>
      </article>

      <article className="admin-card wide">
        <h3>Order Request Inbox</h3>
        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Budget & Timeline</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Admin Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const draft = drafts[order._id] || { status: order.status, adminNotes: order.adminNotes || '' }
                return (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.fullName}</strong>
                      <br />
                      <span>{order.email}</span>
                      <br />
                      <span>{order.phone}</span>
                      {order.company ? (
                        <>
                          <br />
                          <span>{order.company}</span>
                        </>
                      ) : null}
                    </td>
                    <td>
                      <strong>{order.projectCategory}</strong>
                      {order.projectSubtype ? (
                        <>
                          <br />
                          <span>{order.projectSubtype}</span>
                        </>
                      ) : null}
                      {order.requestedService ? (
                        <>
                          <br />
                          <span>Service: {order.requestedService}</span>
                        </>
                      ) : null}
                      {order.requestedProduct ? (
                        <>
                          <br />
                          <span>Product: {order.requestedProduct}</span>
                        </>
                      ) : null}
                      {order.projectReference ? (
                        <>
                          <br />
                          <span>Reference: {order.projectReference}</span>
                        </>
                      ) : null}
                    </td>
                    <td>
                      <span>{order.targetBudget || '-'}</span>
                      <br />
                      <span>{order.targetTimeline || '-'}</span>
                    </td>
                    <td>
                      {order.prdUrl || (order.supportingDocuments || []).length ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {order.prdUrl ? (
                            <div className="admin-doc-card" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 10px' }}>
                              <div className="admin-doc-label" style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '4px' }}>PRD</div>
                              <a
                                href={order.prdUrl || order.prdDownloadUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-doc-link"
                                title={order.prdOriginalName || 'Project requirements PDF'}
                                style={{ fontWeight: 600 }}
                              >
                                {order.prdOriginalName || 'Project Requirements'}
                              </a>
                              <div className="admin-doc-meta" style={{ fontSize: '12px', color: '#9ca3af' }}>
                                {formatFileSize(order.prdBytes)}
                              </div>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ marginTop: '6px' }}
                                onClick={() => deletePrd(order._id, order.fullName)}
                                disabled={deletingAttachmentKey === `prd-${order._id}`}
                              >
                                {deletingAttachmentKey === `prd-${order._id}` ? 'Removing...' : 'Remove PRD'}
                              </button>
                            </div>
                          ) : null}

                          {(order.supportingDocuments || []).map((document, index) => (
                            <div
                              key={document.publicId || document.url || index}
                              className="admin-doc-card"
                              style={{ border: '1px dashed #e5e7eb', borderRadius: '8px', padding: '8px 10px' }}
                            >
                              <div className="admin-doc-label" style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', marginBottom: '4px' }}>
                                Supporting {index + 1}
                              </div>
                              <a
                                href={document.url || document.downloadUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-doc-link"
                                title={document.name || 'Supporting document'}
                                style={{ fontWeight: 600 }}
                              >
                                {document.name || 'Supporting Document'}
                              </a>
                              <div className="admin-doc-meta" style={{ fontSize: '12px', color: '#9ca3af' }}>
                                {formatFileSize(document.bytes)}
                              </div>
                              {document._id ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ marginTop: '6px' }}
                                  onClick={() => deleteSupportingDocument(order._id, document._id, document.name)}
                                  disabled={deletingAttachmentKey === `supporting-${order._id}-${document._id}`}
                                >
                                  {deletingAttachmentKey === `supporting-${order._id}-${document._id}` ? 'Removing...' : 'Remove File'}
                                </button>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="admin-meta" style={{ color: '#9ca3af' }}>No files uploaded</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={draft.status}
                        onChange={(event) =>
                          setDrafts((previous) => ({
                            ...previous,
                            [order._id]: {
                              ...draft,
                              status: event.target.value,
                            },
                          }))
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        value={draft.adminNotes}
                        onChange={(event) =>
                          setDrafts((previous) => ({
                            ...previous,
                            [order._id]: {
                              ...draft,
                              adminNotes: event.target.value,
                            },
                          }))
                        }
                        placeholder="Qualification notes, scope comments, follow-up details"
                      />
                    </td>
                    <td>
                      <div className="admin-action-group">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => saveOrder(order._id)}
                          disabled={savingOrderId === order._id}
                        >
                          {savingOrderId === order._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => deleteOrder(order._id, order.fullName)}
                        >
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
    </section>
  )
}

export default AdminOrdersPage
