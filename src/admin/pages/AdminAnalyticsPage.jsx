import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/dashboard/analytics')
      .then((result) => setAnalytics(result))
      .catch((err) => setError(err.message))
  }, [])

  const breakdowns = analytics?.breakdowns || {}
  const totals = analytics?.totals || {}

  const cards = useMemo(
    () => [
      { label: 'Total Leads', value: totals.leads ?? '--' },
      { label: 'Total Applications', value: totals.applications ?? '--' },
      { label: 'Total Orders', value: totals.orders ?? '--' },
      { label: 'Active Services', value: totals.services ?? '--' },
      { label: 'Active Clients', value: totals.clients ?? '--' },
      { label: 'Active Projects', value: totals.projects ?? '--' },
      { label: 'Open Opportunities', value: totals.opportunities ?? '--' },
    ],
    [totals],
  )

  const charts = [
    { title: 'Leads by Status', items: breakdowns.leadsByStatus || [] },
    { title: 'Orders by Status', items: breakdowns.ordersByStatus || [] },
    { title: 'Orders by Category', items: breakdowns.ordersByCategory || [] },
    { title: 'Applications by Status', items: breakdowns.applicationsByStatus || [] },
    { title: 'Applications by Type', items: breakdowns.applicationsByType || [] },
  ]

  if (error) {
    return <p className="admin-error">{error}</p>
  }

  return (
    <div className="admin-page-grid">
      {cards.map((card) => (
        <article className="admin-card metric" key={card.label}>
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}

      {charts.map((chart) => (
        <article className="admin-card" key={chart.title}>
          <h3>{chart.title}</h3>
          <ul className="admin-list">
            {chart.items.map((item) => (
              <li key={item.key}>
                {item.key.replace(/_/g, ' ')}: {item.count}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}

export default AdminAnalyticsPage
