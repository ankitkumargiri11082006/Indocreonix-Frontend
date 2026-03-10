import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'How do engagements start?',
    description: 'We begin with a discovery call, followed by technical and business scoping to align outcomes.',
  },
  {
    title: 'Do you support existing platforms?',
    description: 'Yes, we modernize and scale existing systems in addition to building new products.',
  },
  {
    title: 'What industries do you serve?',
    description: 'We work with organizations across finance, healthcare, retail, logistics, and SaaS.',
  },
]

function FaqPage() {
  return (
    <CompanyPage
      eyebrow="FAQ"
      title="Answers to Common Questions"
      subtitle="Quick clarity on process, delivery models, and technical capabilities."
      sectionTitle="Frequently Asked Questions"
      sectionItems={sectionItems}
      cta={{
        title: 'Still have questions?',
        description: 'Our team is happy to discuss your specific requirements.',
        primaryLabel: 'Contact Team',
        primaryTo: '/contact',
      }}
    />
  )
}

export default FaqPage
