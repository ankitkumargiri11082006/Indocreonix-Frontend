import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../../lib/apiClient'
import {
  orderStatusOptions,
  formatOrderDateLabel,
  getOrderStatusLabel,
} from '../lib/orderHelpers'

function summarizeText(text = '', limit = 140) {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.length <= limit) return trimmed
  return `${trimmed.slice(0, limit).trim()}...`
}

function getPreviewChips(order) {
  return [
    { label: 'Category', value: order.projectCategory || '—' },
    { label: 'Service', value: order.requestedService || 'Not specified' },
    { label: 'Budget', value: order.targetBudget || 'Not shared' },
    { label: 'Timeline', value: order.targetTimeline || 'Not shared' },
  ]
}

function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [savingOrderId, setSavingOrderId] = useState('')
  const [drafts, setDrafts] = useState({})
  const [statusFilter, setStatusFilter] = useState('all')

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
      qualified: 0,
      proposal_shared: 0,
      in_discussion: 0,
      won: 0,
      lost: 0,
    }

    orders.forEach((order) => {
      if (order.status && typeof next[order.status] === 'number') {
        next[order.status] += 1
      }
    })

    return next
  }, [orders])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((order) => order.status === statusFilter)
  }, [orders, statusFilter])

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
        }),
      })

      await loadOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingOrderId('')
    }
  }

  return (
    <section className="admin-page-stack">
      <article className="admin-card wide">
        <h3>Project Orders</h3>
        <p className="admin-muted">Track new requests, stay on top of conversations, and nudge high-intent leads.</p>
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
            <span>In Pipeline</span>
            <strong>{summary.qualified + summary.proposal_shared + summary.in_discussion}</strong>
          </div>
        </div>
      </article>

      <article className="admin-card wide">
        <div className="admin-orders-toolbar">
          <div>
            <h3>Order Request Inbox</h3>
            <p className="admin-muted">Preview essentials at a glance, then drill into a dedicated workspace per request.</p>
          </div>
          <div className="admin-orders-toolbar-meta">
            <span>
              Showing {filteredOrders.length} of {orders.length}
            </span>
            <span>Last sync {formatOrderDateLabel(new Date())}</span>
          </div>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-status-chip-row" role="tablist">
          {['all', ...orderStatusOptions].map((statusKey) => {
            const label = statusKey === 'all' ? 'All' : getOrderStatusLabel(statusKey)
            const count = statusKey === 'all' ? summary.total : summary[statusKey] || 0
            return (
              <button
                key={statusKey}
                type="button"
                className={statusFilter === statusKey ? 'admin-status-chip active' : 'admin-status-chip'}
                onClick={() => setStatusFilter(statusKey)}
              >
                <span>{label}</span>
                <strong>{count}</strong>
              </button>
            )
          })}
        </div>

        <div className="admin-order-row-list">
          {filteredOrders.length ? (
            filteredOrders.map((order) => {
              const draft = drafts[order._id] || { status: order.status }
              const chips = getPreviewChips(order)
              const notesPreview = summarizeText(order.adminNotes, 120)
              const summaryPreview = summarizeText(order.projectSummary, 160)

              return (
                <article key={order._id} className="admin-order-inline-row">
                  <div className="admin-order-inline-col">
                    <p className="admin-order-client">{order.fullName}</p>
                    <p className="admin-order-meta">
                      {order.email}
                      {order.phone ? ` • ${order.phone}` : ''}
                    </p>
                    {order.company ? <p className="admin-order-meta">{order.company}</p> : null}
                  </div>

                  <div className="admin-order-inline-col chips">
                    {chips.map((chip) => (
                      <div key={chip.label} className="admin-order-inline-chip">
                        <span>{chip.label}</span>
                        <strong>{chip.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="admin-order-inline-col summary">
                    <p>
                      {summaryPreview || notesPreview || 'No summary provided'}
                    </p>
                    <span>Created {formatOrderDateLabel(order.createdAt)}</span>
                  </div>

                  <div className="admin-order-inline-col actions">
                    <span className={`admin-status-badge status-${order.status}`}>{getOrderStatusLabel(order.status)}</span>
                    <select
                      className="admin-select compact"
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
                      {orderStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getOrderStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                    <div className="admin-order-inline-actions">
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
                        onClick={() => navigate(`/admin/orders/${order._id}`, { state: { order } })}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="admin-empty-state">
              <h4>No orders match this filter</h4>
              <p className="admin-muted">Switch to a different status or check back after the web leads sync.</p>
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

export default AdminOrdersPage
