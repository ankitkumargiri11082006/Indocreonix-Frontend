import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'FinTech Transformation',
    description: 'Modern payment experiences, secure transaction workflows, and compliance-ready systems.',
  },
  {
    title: 'HealthTech Platforms',
    description: 'Interoperable and scalable digital health ecosystems focused on data privacy and access.',
  },
  {
    title: 'Retail Intelligence',
    description: 'Personalized commerce, inventory optimization, and omnichannel analytics.',
  },
]

function SolutionsPage() {
  return (
    <CompanyPage
      eyebrow="Industry Solutions"
      title="Domain-Focused Solutions for Complex Industries"
      subtitle="Indocreonix brings technology and industry understanding together for faster outcomes."
      sectionTitle="Solution Areas"
      sectionItems={sectionItems}
      cta={{
        title: 'Looking for an industry-specific approach?',
        description: 'Let us map your challenges to a practical technology strategy.',
        primaryLabel: 'Book a Consultation',
        primaryTo: '/contact',
      }}
    />
  )
}

export default SolutionsPage
