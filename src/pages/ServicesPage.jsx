import { useEffect, useState } from 'react'
import CompanyPage from '../components/CompanyPage'
import { apiRequest } from '../lib/apiClient'
import { serviceCatalog } from '../data/serviceCatalog'
import SEO from '../components/SEO'

function ServicesPage() {
  const [servicesOffered, setServicesOffered] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/services/public', { cacheMs: 120000 })
      .then((result) => setServicesOffered(result.items || []))
      .catch(() => setServicesOffered([]))
      .finally(() => setLoading(false))
  }, [])

  const sectionItems = serviceCatalog.map((catalogService) => {
    // Attempt to override with DB record matching the title
    const dbService = servicesOffered.find((s) => s.title === catalogService.title) || {}
    
    return {
      title: dbService.title || catalogService.title,
      description: dbService.description || catalogService.shortDescription,
      image: dbService.image || catalogService.image,
      primaryLabel: 'Details',
      primaryTo: `/services/${catalogService.slug}`,
      secondaryLabel: 'Get Quote',
      secondaryTo: `/request-quote?service=${encodeURIComponent(dbService.title || catalogService.title)}`,
    }
  })

  return (
    <>
      <SEO 
        title="Services | Indocreonix Professional Technology Solutions"
        description="Explore Indocreonix service capabilities across custom software engineering, web and mobile development, cloud modernization, DevOps, automation, and AI enablement."
        keywords="indocreonix services, custom software development, web and app development company, cloud devops services, business automation solutions, ai integration services, technology consulting"
      />
      {loading ? (
        <section className="content-section container">
          <p className="section-eyebrow">Our Services</p>
          <h2>Technology Services Designed for Strategic Business Outcomes</h2>
          <p className="section-subtitle">
            Loading service options and engagement details.
          </p>
          <div className="card-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <article className="info-card skeleton" key={`service-skeleton-${index}`}>
                <div className="skeleton-box" style={{ height: 160, marginBottom: 14 }} />
                <div className="skeleton-text" style={{ width: '58%', height: 18, marginBottom: 12 }} />
                <div className="skeleton-text" style={{ width: '100%', height: 14, marginBottom: 8 }} />
                <div className="skeleton-text" style={{ width: '82%', height: 14 }} />
              </article>
            ))}
          </div>
        </section>
      ) : (
        <CompanyPage
          eyebrow="Our Services"
          title="Technology Services Designed for Strategic Business Outcomes"
          subtitle="From first idea to final launch and support, we provide end-to-end technology services tailored to your business goals."
          sectionTitle="Service Capabilities"
          sectionItems={sectionItems}
          sectionImageLayout="full"
          theme="theme-services"
          cta={{
            title: 'Need a tailored service engagement model?',
            description: 'Share your project needs and timeline to receive a clear plan, budget direction, and delivery approach.',
            primaryLabel: 'Request Project Quote',
            primaryTo: '/request-quote?source=services-page',
          }}
        />
      )}
    </>
  )
}

export default ServicesPage
