function PageHero({ eyebrow, title, subtitle, actions, theme = 'theme-a', metrics = [] }) {
  return (
    <section className={`page-hero ${theme}`}>
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        {actions ? <div className="hero-actions">{actions}</div> : null}
        {metrics.length > 0 ? (
          <div className="hero-metrics">
            {metrics.map((metric) => (
              <article className="metric-chip" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PageHero
