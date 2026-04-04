import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { apiRequest } from '../../lib/apiClient'
import {
  orderStatusOptions,
  formatOrderDateLabel,
  formatOrderFileSize,
  getOrderStatusLabel,
} from '../lib/orderHelpers'

function AdminOrderDetailPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const initialOrder = location.state?.order || null
  const [order, setOrder] = useState(initialOrder)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(!initialOrder)
  const [saving, setSaving] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState(false)
  const [deletingAttachmentKey, setDeletingAttachmentKey] = useState('')
  const [draft, setDraft] = useState({
    status: initialOrder?.status || '',
    adminNotes: initialOrder?.adminNotes || '',
  })

  async function loadOrder(options = {}) {
    const { allowListFallback = true } = options
    try {
      setLoading(true)
      setError('')
      const result = await apiRequest(`/orders/${orderId}`)
      const item = result.item
      setOrder(item)
      setDraft({
        status: item.status,
        adminNotes: item.adminNotes || '',
      })
    } catch (err) {
      if (allowListFallback && err.status === 404) {
        try {
          const listResult = await apiRequest('/orders')
          const fallbackOrder = (listResult.items || []).find((entry) => entry._id === orderId)
          if (fallbackOrder) {
            setOrder(fallbackOrder)
            setDraft({
              status: fallbackOrder.status,
              adminNotes: fallbackOrder.adminNotes || '',
            })
            setError('')
            return
          }
          setError('Order not found in inbox. Return to orders list.')
          return
        } catch (fallbackErr) {
          setError(fallbackErr.message)
          return
        }
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder({ allowListFallback: Boolean(initialOrder) })
  }, [orderId])

  useEffect(() => {
    if (order) {
      setDraft({
        status: order.status || '',
        adminNotes: order.adminNotes || '',
      })
    }
  }, [order])

  async function saveOrder() {
    if (!order) return

    try {
      setSaving(true)
      setError('')
      await apiRequest(`/orders/${order._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: draft.status,
          adminNotes: draft.adminNotes,
        }),
      })
      await loadOrder()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteOrder() {
    if (!order) return
    const confirmed = window.confirm(
      `Delete the project request from ${order.fullName}? This removes all attachments.`,
    )
    if (!confirmed) return

    try {
      setDeletingOrder(true)
      setError('')
      await apiRequest(`/orders/${order._id}`, { method: 'DELETE' })
      navigate('/admin/orders')
    } catch (err) {
      setError(err.message)
      setDeletingOrder(false)
    }
  }

  async function deletePrd() {
    if (!order) return
    const confirmed = window.confirm('Remove the PRD? The order will remain without the document.')
    if (!confirmed) return

    try {
      const stateKey = `prd-${order._id}`
      setDeletingAttachmentKey(stateKey)
      setError('')
      await apiRequest(`/orders/${order._id}/prd`, { method: 'DELETE' })
      await loadOrder()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingAttachmentKey('')
    }
  }

  async function deleteSupportingDocument(documentId, documentName) {
    if (!order) return
    const confirmed = window.confirm(
      `Remove supporting document "${documentName || 'File'}"? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      const stateKey = `supporting-${order._id}-${documentId}`
      setDeletingAttachmentKey(stateKey)
      setError('')
      await apiRequest(`/orders/${order._id}/supporting/${documentId}`, { method: 'DELETE' })
      await loadOrder()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingAttachmentKey('')
    }
  }

  if (loading && !order) {
    return (
      <section className="admin-page-stack">
        <article className="admin-card wide">
          <p className="admin-muted">Loading order details...</p>
        </article>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="admin-page-stack">
        <article className="admin-card wide">
          <h3>Order not found</h3>
          <p className="admin-muted">Return to the inbox to select a different request.</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/orders')}>
            Back to Orders
          </button>
        </article>
      </section>
    )
  }

  const supportingDocuments = order.supportingDocuments || []

  const overviewSections = [
    {
      title: 'Client',
      items: [
        { label: 'Name', value: order.fullName },
        { label: 'Email', value: order.email },
        { label: 'Phone', value: order.phone || 'Not shared' },
        { label: 'Company', value: order.company || 'Not provided' },
      ],
    },
    {
      title: 'Scope',
      items: [
        { label: 'Category', value: order.projectCategory || '—' },
        { label: 'Subtype', value: order.projectSubtype || '—' },
        { label: 'Service', value: order.requestedService || 'Not specified' },
        { label: 'Product', value: order.requestedProduct || 'Not specified' },
        { label: 'Reference', value: order.projectReference || '—' },
      ],
    },
    {
      title: 'Logistics',
      items: [
        { label: 'Budget', value: order.targetBudget || 'Not shared' },
        { label: 'Timeline', value: order.targetTimeline || 'Not shared' },
        { label: 'Stage', value: getOrderStatusLabel(order.status) },
        { label: 'Last Updated', value: formatOrderDateLabel(order.updatedAt || order.createdAt) },
      ],
    },
  ]

  const narrativeBlocks = [
    { title: 'Project Summary', value: order.projectSummary || 'No description provided.' },
    { title: 'Business Goals', value: order.businessGoals || 'No goals shared.' },
    { title: 'Key Features', value: order.featureRequirements || 'No feature requirements listed.' },
  ]

  return (
    <section className="admin-page-stack">
      <article className="admin-card wide admin-order-detail-headline">
        <div>
          <button type="button" className="admin-link-btn" onClick={() => navigate('/admin/orders')}>
            Back to inbox
          </button>
          <h3>{order.fullName}</h3>
          <p className="admin-order-meta">Order ID {order._id}</p>
          <p className="admin-order-meta">
            Created {formatOrderDateLabel(order.createdAt)} · Last updated {formatOrderDateLabel(order.updatedAt || order.createdAt)}
          </p>
          <div className="admin-order-quickfacts">
            {order.projectCategory ? <span>{order.projectCategory}</span> : null}
            {order.requestedService ? <span>{order.requestedService}</span> : null}
            {order.targetTimeline ? <span>{order.targetTimeline}</span> : null}
            {order.targetBudget ? <span>Budget {order.targetBudget}</span> : null}
          </div>
        </div>
        <div className="admin-order-detail-headline-actions">
          <span className={`admin-status-badge status-${order.status}`}>{getOrderStatusLabel(order.status)}</span>
        </div>
      </article>

      {error ? <p className="admin-error">{error}</p> : null}

      <article className="admin-card wide">
        <div className="admin-order-detail-grid two-column">
          <div className="admin-order-detail-column primary">
            <div className="admin-order-overview-grid">
              {overviewSections.map((section) => (
                <section key={section.title} className="admin-order-overview-card">
                  <p className="admin-order-section-title">{section.title}</p>
                  <dl className="admin-order-overview-list">
                    {section.items.map((item) => (
                      <div key={`${section.title}-${item.label}`}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            <section className="admin-order-section tight">
              <p className="admin-order-section-title">Narrative</p>
              <div className="admin-order-narrative-grid">
                {narrativeBlocks.map((block) => (
                  <article key={block.title}>
                    <h4>{block.title}</h4>
                    <p>{block.value}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="admin-order-detail-column secondary">
            <section className="admin-order-section tight">
              <p className="admin-order-section-title">Documents</p>
              {order.prdUrl || supportingDocuments.length ? (
                <div className="admin-order-docs-table">
                  {order.prdUrl ? (
                    <div className="admin-order-doc-row">
                      <div>
                        <p className="admin-doc-label">PRD</p>
                        <a href={order.prdUrl || order.prdDownloadUrl || '#'} target="_blank" rel="noreferrer" className="admin-doc-link">
                          {order.prdOriginalName || 'Project Requirements'}
                        </a>
                        <span className="admin-doc-meta">{formatOrderFileSize(order.prdBytes)}</span>
                      </div>
                      <div className="admin-order-inline-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={deletePrd}
                          disabled={deletingAttachmentKey === `prd-${order._id}`}
                        >
                          {deletingAttachmentKey === `prd-${order._id}` ? 'Removing...' : 'Remove'}
                        </button>
                        <a className="btn btn-primary" href={order.prdDownloadUrl || order.prdUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {supportingDocuments.map((document, index) => (
                    <div key={document._id || document.publicId || index} className="admin-order-doc-row subtle">
                      <div>
                        <p className="admin-doc-label">Supporting {index + 1}</p>
                        <a href={document.url || document.downloadUrl || '#'} target="_blank" rel="noreferrer" className="admin-doc-link">
                          {document.name || 'Supporting Document'}
                        </a>
                        <span className="admin-doc-meta">{formatOrderFileSize(document.bytes)}</span>
                      </div>
                      <div className="admin-order-inline-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => deleteSupportingDocument(document._id, document.name)}
                          disabled={deletingAttachmentKey === `supporting-${order._id}-${document._id}`}
                        >
                          {deletingAttachmentKey === `supporting-${order._id}-${document._id}` ? 'Removing...' : 'Remove'}
                        </button>
                        <a className="btn btn-primary" href={document.downloadUrl || document.url} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="admin-order-meta">No files uploaded</p>
              )}
            </section>

            <section className="admin-order-section tight">
              <p className="admin-order-section-title">Status & Notes</p>
              <div className="admin-order-status-grid">
                <label>
                  <span>Stage</span>
                  <select
                    className="admin-select"
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {getOrderStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Internal notes</span>
                  <textarea
                    className="admin-notes-area"
                    value={draft.adminNotes}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        adminNotes: event.target.value,
                      }))
                    }
                    placeholder="Qualification notes, scope comments, follow-up details"
                  />
                </label>
              </div>
              <div className="admin-action-group end">
                <button type="button" className="btn btn-primary" onClick={saveOrder} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/orders')}>
                  Back to inbox
                </button>
              </div>
            </section>

            <section className="admin-order-section tight admin-order-danger-zone">
              <p className="admin-order-section-title">Danger zone</p>
              <p className="admin-order-meta">Deleting this request removes all uploaded files permanently.</p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteOrder}
                disabled={deletingOrder}
              >
                {deletingOrder ? 'Deleting...' : 'Delete request'}
              </button>
            </section>
          </div>
        </div>
      </article>
    </section>
  )
}

export default AdminOrderDetailPage