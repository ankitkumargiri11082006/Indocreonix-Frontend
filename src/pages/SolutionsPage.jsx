import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Business Process Automation',
    description: 'Automate approvals, reporting, and operational workflows to reduce manual effort and delays.',
  },
  {
    title: 'Digital Platform Modernization',
    description: 'Upgrade legacy systems into modular, secure platforms with improved user and admin experience.',
  },
  {
    title: 'Data-Driven Decision Systems',
    description: 'Integrate business data into centralized dashboards for faster, better-informed decisions.',
  },
]

function SolutionsPage() {
  return (
    <CompanyPage
      eyebrow="Industry Solutions"
      title="Solution Frameworks for Growing Organizations"
      subtitle="Indocreonix combines engineering expertise with business understanding to deliver usable, scalable systems."
      sectionTitle="Solution Areas"
      sectionItems={sectionItems}
      cta={{
        title: 'Looking for an industry-specific approach?',
        description: 'Let us map your operational challenges to a practical, implementation-ready technology plan.',
        primaryLabel: 'Book a Consultation',
        primaryTo: '/contact',
      }}
    />
  )
}

export default SolutionsPage
