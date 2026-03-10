import { Link } from 'react-router-dom'

function CtaBanner({ title, description, primaryLabel = 'Talk to Us', primaryTo = '/contact' }) {
  return (
    <section className="cta-banner container">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link to={primaryTo} className="btn btn-primary">
        {primaryLabel}
      </Link>
    </section>
  )
}

export default CtaBanner
