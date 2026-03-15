function AdminAnalyticsPage() {
  const charts = [
    { title: 'Traffic Sources', items: ['Organic 42%', 'Direct 31%', 'Social 17%', 'Referral 10%'] },
    { title: 'Top Services', items: ['AI Solutions', 'Cloud Engineering', 'Web Development', 'Automation'] },
    { title: 'Country Reach', items: ['India', 'UAE', 'Singapore', 'USA'] },
  ]

  return (
    <div className="admin-page-grid">
      {charts.map((chart) => (
        <article className="admin-card" key={chart.title}>
          <h3>{chart.title}</h3>
          <ul className="admin-list">
            {chart.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}

      <article className="admin-card wide">
        <h3>Weekly Overview</h3>
        <p>
          Keep this section fully customizable from backend analytics integration. Current data is placeholder-ready for tools like GA4, Mixpanel, or custom events.
        </p>
      </article>
    </div>
  )
}

export default AdminAnalyticsPage
