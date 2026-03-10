import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Banking App Rebuild',
    description: 'Reduced onboarding time by 40% through UX redesign and automated verification workflows.',
  },
  {
    title: 'Manufacturing Dashboard',
    description: 'Implemented IoT data ingestion and predictive analytics to reduce downtime by 23%.',
  },
  {
    title: 'E-commerce Replatforming',
    description: 'Delivered cloud-native migration that improved page speed and conversion performance.',
  },
]

function CaseStudiesPage() {
  return (
    <CompanyPage
      eyebrow="Case Studies"
      title="Proven Results Across Critical Digital Initiatives"
      subtitle="Explore real outcomes we delivered with measurable business impact."
      sectionTitle="Featured Engagements"
      sectionItems={sectionItems}
      cta={{
        title: 'Your project could be next',
        description: 'We combine technical rigor and product thinking to deliver measurable outcomes.',
        primaryLabel: 'Start Conversation',
        primaryTo: '/contact',
      }}
    />
  )
}

export default CaseStudiesPage
