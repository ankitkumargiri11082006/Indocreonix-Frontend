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

  const ga4 = analytics?.ga4 || null
  const ga4Charts = useMemo(
    () =>
      ga4?.enabled
        ? [
            { title: 'Traffic Sources', items: ga4.trafficSources || [] },
            { title: 'Top Pages', items: ga4.topPages || [] },
            { title: 'Top Countries', items: ga4.topCountries || [] },
            { title: 'Devices', items: ga4.deviceCategories || [] },
            { title: 'Realtime by Page', items: ga4.realtimeByPage || [] },
            { title: 'Realtime by Country', items: ga4.realtimeByCountry || [] },
          ]
        : [],
    [ga4],
  )

  if (error) {
    return <p className="admin-error">{error}</p>
  }

  return (
    <div className="admin-page-grid">
      {ga4?.enabled ? (
        <>
          <article className="admin-card metric" key="ga4-realtime">
            <p>Realtime Active Users</p>
            <h3>{ga4.realtimeUsers ?? 0}</h3>
            <small>Last {ga4.dateRangeDays ?? 7} days</small>
          </article>

          {ga4Charts.map((chart) => (
            <article className="admin-card" key={chart.title}>
              <h3>{chart.title}</h3>
              <ul className="admin-list">
                {chart.items.map((item) => (
                  <li key={item.label}>
                    {item.label}: {item.value}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </>
      ) : (
        <article className="admin-card">
          <h3>Google Analytics not connected</h3>
          <p>Please configure GA4 env vars on the backend to see live traffic data.</p>
        </article>
      )}
    </div>
  )
}

export default AdminAnalyticsPage
