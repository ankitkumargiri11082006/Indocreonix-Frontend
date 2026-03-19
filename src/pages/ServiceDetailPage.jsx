import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import { getServiceBySlug } from '../data/serviceCatalog'
import SEO from '../components/SEO'

function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return (
      <section className="container content-section">
        <article className="info-card">
          <h3>Service Not Found</h3>
          <p>The requested service page is unavailable. Please explore all service categories.</p>
          <div className="info-card-actions">
            <Link className="btn btn-secondary" to="/services">
              Back to Services
            </Link>
            <Link className="btn btn-primary" to="/request-quote">
              Request Project Quote
            </Link>
          </div>
        </article>
      </section>
    )
  }

  return (
    <>
      <SEO 
        title={`${service.title} Services`}
        description={service.shortDescription || service.details}
        keywords={`${service.title}, ${serviceSlug}, tech services, indocreonix solutions, web development, app development`}
      />
      <PageHero
        eyebrow="Service Track"
        title={service.title}
        subtitle={service.details}
        theme="theme-services"
        metrics={[
          { value: '4', label: 'Specialized Engagement Tracks' },
          { value: 'Enterprise-Ready', label: 'Delivery Standard' },
          { value: 'Architecture + Build', label: 'Coverage' },
        ]}
      />

      <section className="container content-section">
        <h2>Delivery Options</h2>
        <div className="card-grid">
          {service.offerings.map((offering, index) => (
            <article className="info-card" key={offering.type}>
              <p className="card-index">0{index + 1}</p>
              <h3>{offering.type}</h3>
              <p>{offering.brief}</p>
              <div className="info-card-actions">
                <Link
                  to={`/request-quote?service=${encodeURIComponent(service.title)}&category=${encodeURIComponent(
                    offering.type,
                  )}`}
                  className="btn btn-primary"
                >
                  Request This Solution
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Need execution planning for this service?"
        description="Share goals, expected timeline, and preferred technology stack. We will propose a structured delivery model."
        primaryLabel="Start Project Request"
        primaryTo={`/request-quote?service=${encodeURIComponent(service.title)}`}
      />
    </>
  )
}

export default ServiceDetailPage
