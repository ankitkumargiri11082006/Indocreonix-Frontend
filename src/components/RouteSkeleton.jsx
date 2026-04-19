function RouteSkeleton() {
  return (
    <section className="route-skeleton container" aria-label="Loading page">
      <div className="route-skeleton-hero skeleton" />
      <div className="route-skeleton-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <article className="route-skeleton-card skeleton" key={`route-skeleton-${index}`}>
            <div className="route-skeleton-line skeleton-text" style={{ width: "72%", height: 18 }} />
            <div className="route-skeleton-line skeleton-text" style={{ width: "100%", height: 14 }} />
            <div className="route-skeleton-line skeleton-text" style={{ width: "86%", height: 14 }} />
          </article>
        ))}
      </div>
    </section>
  );
}

export default RouteSkeleton;
