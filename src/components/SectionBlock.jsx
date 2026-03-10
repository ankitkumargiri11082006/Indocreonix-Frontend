function SectionBlock({ title, items }) {
  return (
    <section className="content-section container">
      <h2>{title}</h2>
      <div className="card-grid">
        {items.map((item, index) => (
          <article className="info-card" key={item.title}>
            <p className="card-index">0{index + 1}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SectionBlock
