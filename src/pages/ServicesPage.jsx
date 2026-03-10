import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Custom Software Development',
    description: 'End-to-end web, mobile, and platform engineering tailored to your business goals.',
  },
  {
    title: 'Cloud & DevOps',
    description: 'Infrastructure automation, CI/CD, and observability for reliable and efficient delivery.',
  },
  {
    title: 'Cybersecurity Services',
    description: 'Security assessments, hardening, and ongoing best-practice implementation.',
  },
]

function ServicesPage() {
  return (
    <CompanyPage
      eyebrow="Our Services"
      title="Engineering Services Built for Speed and Stability"
      subtitle="Flexible engagement models that align with your product lifecycle and team structure."
      sectionTitle="Service Capabilities"
      sectionItems={sectionItems}
      cta={{
        title: 'Need a tailored service plan?',
        description: 'We can design a delivery model that fits your timeline and budget.',
        primaryLabel: 'Discuss Services',
        primaryTo: '/contact',
      }}
    />
  )
}

export default ServicesPage
