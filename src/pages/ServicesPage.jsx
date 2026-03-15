import { useEffect, useState } from 'react'
import CompanyPage from '../components/CompanyPage'
import { apiRequest } from '../lib/apiClient'

function ServicesPage() {
  const [servicesOffered, setServicesOffered] = useState([])

  useEffect(() => {
    apiRequest('/services/public')
      .then((result) => setServicesOffered(result.items || []))
      .catch(() => setServicesOffered([]))
  }, [])

  return (
    <CompanyPage
      eyebrow="Our Services"
      title="Technology Services Designed for Practical Business Outcomes"
      subtitle="We provide flexible engagement models for new builds, modernization projects, and long-term product support."
      sectionTitle="Service Capabilities"
      sectionItems={servicesOffered}
      theme="theme-services"
      cta={{
        title: 'Need a tailored service plan?',
        description: 'Share your scope and timeline. We will propose a structured delivery approach for your team.',
        primaryLabel: 'Discuss Services',
        primaryTo: '/contact',
      }}
    />
  )
}

export default ServicesPage
