import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Engineering Blog',
    description: 'Practical notes on architecture, code quality, release planning, and engineering execution.',
  },
  {
    title: 'AI Thought Leadership',
    description: 'Implementation-focused guidance for applying AI in real workflows without unnecessary complexity.',
  },
  {
    title: 'Technology Trends',
    description: 'Business-focused perspectives on cloud, data, security, and digital transformation strategies.',
  },
]

function InsightsPage() {
  return (
    <CompanyPage
      eyebrow="Insights"
      title="Ideas, Research, and Real-World Technology Lessons"
      subtitle="Stay updated with practical technology insights from the Indocreonix engineering team."
      sectionTitle="Latest Topics"
      sectionItems={sectionItems}
      cta={{
        title: 'Want curated insights for your team?',
        description: 'Connect with us for strategic sessions and tailored technology briefings.',
        primaryLabel: 'Connect with Experts',
        primaryTo: '/contact',
      }}
    />
  )
}

export default InsightsPage
