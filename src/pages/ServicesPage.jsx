import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Custom Software Development',
    description: 'End-to-end web platforms, internal tools, and customer-facing applications built around your workflow.',
  },
  {
    title: 'Cloud & DevOps',
    description: 'Cloud migration, CI/CD implementation, and monitoring setups for stable and predictable releases.',
  },
  {
    title: 'Cybersecurity Services',
    description: 'Application and infrastructure hardening with security-first practices across development and deployment.',
  },
]

function ServicesPage() {
  return (
    <CompanyPage
      eyebrow="Our Services"
      title="Technology Services Designed for Practical Business Outcomes"
      subtitle="We provide flexible engagement models for new builds, modernization projects, and long-term product support."
      sectionTitle="Service Capabilities"
      sectionItems={sectionItems}
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
