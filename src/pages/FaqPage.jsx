import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'How do engagements start?',
    description: 'We start with a discovery discussion and then share a practical scope, timeline, and delivery plan.',
  },
  {
    title: 'Do you support existing platforms?',
    description: 'Yes. We support, stabilize, and modernize existing systems as well as build new solutions.',
  },
  {
    title: 'Do you offer both internships and full-time jobs?',
    description: 'Yes. Visit the Careers page to apply separately for Internship or Job opportunities using dedicated forms.',
  },
]

function FaqPage() {
  return (
    <CompanyPage
      eyebrow="FAQ"
      title="Answers to Common Questions"
      subtitle="Quick clarity on our process, delivery model, and hiring opportunities."
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
