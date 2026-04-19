import { useEffect, useState } from 'react'
import CompanyPage from '../components/CompanyPage'
import { apiRequest } from '../lib/apiClient'
import { serviceCatalog } from '../data/serviceCatalog'
import SEO from '../components/SEO'

function ServicesPage() {
  const [servicesOffered, setServicesOffered] = useState([])
  const [loading, setLoading] = useState(true)

  const keywordCatalogMatch = (title = '') => {
    const normalizedTitle = String(title).toLowerCase()

    if (/web|website/.test(normalizedTitle)) {
      return serviceCatalog.find((item) => item.slug === 'website-development')
    }
    if (/mobile|android|ios|app/.test(normalizedTitle)) {
      return serviceCatalog.find((item) => item.slug === 'mobile-app-development')
    }
    if (/software|saas|crm|erp|system/.test(normalizedTitle)) {
      return serviceCatalog.find((item) => item.slug === 'software-development')
    }
    if (/cloud|devops|data|ai/.test(normalizedTitle)) {
      return serviceCatalog.find((item) => item.slug === 'cloud-devops-data')
    }

    return null
  }

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
        title="Our Services | Indocreonix Tech Solutions & App Development"
        description="Explore the comprehensive suite of services by Indocreonix. From enterprise web applications to native Android app development, cloud infrastructure, and AI engineering, we are the #1 technology partner."
        keywords="indocreonix services, indocreonix web development, indocreonix android development, top IT services delhi, top software agency, leading cloud migration experts, saas development company, robust UI UX design, indo digital services"
      />
      {loading ? (
        <section className="content-section container">
          <p className="section-eyebrow">Our Services</p>
          <h2>Technology Services Designed for Practical Business Outcomes</h2>
          <p className="section-subtitle">
            Loading service capabilities and engagement options.
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
          title="Technology Services Designed for Practical Business Outcomes"
          subtitle="We provide flexible engagement models for new builds, modernization projects, and long-term product support."
          sectionTitle="Service Capabilities"
          sectionItems={sectionItems}
          sectionImageLayout="full"
          theme="theme-services"
          cta={{
            title: 'Need a tailored service execution plan?',
            description: 'Share your scope and timeline to receive a professional delivery proposal and technical estimate.',
            primaryLabel: 'Request Project Quote',
            primaryTo: '/request-quote?source=services-page',
          }}
        />
      )}
    </>
  )
}

export default ServicesPage
