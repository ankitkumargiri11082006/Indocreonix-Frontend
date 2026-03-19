import { useEffect, useState } from 'react'
import CompanyPage from '../components/CompanyPage'
import { apiRequest } from '../lib/apiClient'
import { serviceCatalog } from '../data/serviceCatalog'
import SEO from '../components/SEO'

function ServicesPage() {
  const [servicesOffered, setServicesOffered] = useState([])

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
    apiRequest('/services/public')
      .then((result) => setServicesOffered(result.items || []))
      .catch(() => setServicesOffered([]))
  }, [])

  const sectionItems = serviceCatalog.map((service) => {
    return {
      title: service.title,
      description: service.shortDescription,
      image: service.image,
      primaryLabel: 'View Service Details',
      primaryTo: `/services/${service.slug}`,
      secondaryLabel: 'Request Quote',
      secondaryTo: `/request-quote?service=${encodeURIComponent(service.title)}`,
    }
  })

  return (
    <>
      <SEO 
        title="Our Services | Indocreonix Tech Solutions & App Development"
        description="Explore the comprehensive suite of services by Indocreonix. From enterprise web applications to native Android app development, cloud infrastructure, and AI engineering, we are the #1 technology partner."
        keywords="indocreonix services, indocreonix web development, indocreonix android development, top IT services delhi, top software agency, leading cloud migration experts, saas development company, robust UI UX design, indo digital services"
      />
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
    </>
  )
}

export default ServicesPage
