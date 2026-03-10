import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Engineering Blog',
    description: 'Practical insights on architecture, release management, and scaling engineering teams.',
  },
  {
    title: 'AI Thought Leadership',
    description: 'Guides and playbooks for adopting AI responsibly and effectively in enterprise contexts.',
  },
  {
    title: 'Technology Trends',
    description: 'Expert perspectives on cloud, security, data strategy, and product innovation.',
  },
]

function InsightsPage() {
  return (
    <CompanyPage
      eyebrow="Insights"
      title="Ideas, Research, and Real-World Technology Lessons"
      subtitle="Stay informed with practical content from the Indocreonix engineering and strategy team."
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
