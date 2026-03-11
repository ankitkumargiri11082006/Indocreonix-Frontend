import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Financial Services Platform Upgrade',
    description: 'Redesigned user onboarding and backend workflows to improve customer experience and operations efficiency.',
  },
  {
    title: 'Operations Visibility Dashboard',
    description: 'Implemented centralized reporting across teams to improve decision-making and issue response time.',
  },
  {
    title: 'Commerce Platform Modernization',
    description: 'Migrated legacy architecture to a modern stack with better maintainability and performance.',
  },
]

function CaseStudiesPage() {
  return (
    <CompanyPage
      eyebrow="Case Studies"
      title="Proven Results Across Critical Digital Initiatives"
      subtitle="Explore selected delivery outcomes where we solved business-critical technology challenges."
      sectionTitle="Featured Engagements"
      sectionItems={sectionItems}
      cta={{
        title: 'Your project could be next',
        description: 'We combine technical rigor and business alignment to deliver outcomes that matter.',
        primaryLabel: 'Start Conversation',
        primaryTo: '/contact',
      }}
    />
  )
}

export default CaseStudiesPage
