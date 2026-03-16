import { Link } from 'react-router-dom'
import AdaptiveLogoImage from './AdaptiveLogoImage'

function SectionBlock({ title, items, imageLayout = 'contained' }) {
  const isFullImageLayout = imageLayout === 'full'

  return (
    <section className="content-section container">
      <h2>{title}</h2>
      <div className="card-grid">
        {items.map((item, index) => (
          <article className="info-card" key={item.title}>
            {item.image && (
              <AdaptiveLogoImage
                src={item.image}
                alt={item.title}
                frameClassName={isFullImageLayout ? 'info-card-image-wrap info-card-image-wrap-full' : 'info-card-image-wrap'}
                imageClassName={isFullImageLayout ? 'info-card-image info-card-image-full' : 'info-card-image'}
              />
            )}
            <p className="card-index">0{index + 1}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.meta ? <p className="project-credit">{item.meta}</p> : null}
            {item.primaryLabel && item.primaryTo ? (
              <div className="info-card-actions">
                {item.primaryHref ? (
                  <a className="btn btn-primary" href={item.primaryHref} target="_blank" rel="noreferrer">
                    {item.primaryLabel}
                  </a>
                ) : (
                  <Link className="btn btn-primary" to={item.primaryTo}>
                    {item.primaryLabel}
                  </Link>
                )}
                {item.secondaryLabel && (item.secondaryTo || item.secondaryHref) ?
                  item.secondaryHref ? (
                    <a className="btn btn-secondary" href={item.secondaryHref} target="_blank" rel="noreferrer">
                      {item.secondaryLabel}
                    </a>
                  ) : (
                    <Link className="btn btn-secondary" to={item.secondaryTo}>
                      {item.secondaryLabel}
                    </Link>
                  ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default SectionBlock
