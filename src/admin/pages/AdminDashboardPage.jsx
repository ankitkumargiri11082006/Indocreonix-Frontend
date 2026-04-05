import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../lib/apiClient'
import { adminPath } from '../adminPath'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/dashboard/stats')
      .then((result) => setStats(result))
      .catch((err) => setError(err.message))
  }, [])

  if (error) {
    return <p className="admin-error">{error}</p>
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '--' },
    { label: 'Active Users', value: stats?.activeUsers ?? '--' },
    { label: 'Total Leads', value: stats?.totalLeads ?? '--' },
    { label: 'New Leads', value: stats?.newLeads ?? '--' },
    { label: 'Total Applications', value: stats?.totalApplications ?? '--' },
    { label: 'New Applications', value: stats?.newApplications ?? '--' },
    { label: 'Media Assets', value: stats?.mediaCount ?? '--' },
  ]

  const quickActions = [
    { label: 'Manage Projects', to: adminPath('projects') },
    { label: 'Manage Clients', to: adminPath('clients') },
    { label: 'Manage Services', to: adminPath('services') },
    { label: 'Manage Openings', to: adminPath('openings') },
    { label: 'Review Applications', to: adminPath('applications') },
    { label: 'Brand Settings', to: adminPath('settings') },
  ]

  return (
    <div className="admin-page-grid">
      {cards.map((card) => (
        <article className="admin-card metric" key={card.label}>
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}

      <article className="admin-card wide">
        <h3>Performance</h3>
        <div className="admin-mini-metrics">
          <div>
            <span>Visitors Growth</span>
            <strong>{stats?.growth?.visitors ?? 0}%</strong>
          </div>
          <div>
            <span>Leads Growth</span>
            <strong>{stats?.growth?.leads ?? 0}%</strong>
          </div>
          <div>
            <span>Conversion Rate</span>
            <strong>{stats?.growth?.conversions ?? 0}%</strong>
          </div>
        </div>
      </article>

      <article className="admin-card wide">
        <h3>Quick Actions</h3>
        <div className="admin-quick-actions-grid">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="admin-quick-action-card">
              {action.label}
            </Link>
          ))}
        </div>
      </article>
    </div>
  )
}

export default AdminDashboardPage
