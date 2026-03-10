import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Our Mission',
    description: 'Enable organizations to innovate confidently through reliable software, strong data foundations, and practical AI adoption.',
  },
  {
    title: 'Our Culture',
    description: 'We value ownership, transparency, and continuous learning in every project and collaboration.',
  },
  {
    title: 'Our Promise',
    description: 'Every solution is crafted for performance, security, and business outcomes, not just technical completion.',
  },
]

function AboutPage() {
  return (
    <CompanyPage
      eyebrow="About Indocreonix"
      title="A Team of Engineers, Strategists, and Problem Solvers"
      subtitle="We partner with startups and enterprises to build technology that delivers lasting value."
      sectionTitle="Who We Are"
      sectionItems={sectionItems}
      cta={{
        title: 'Build with a trusted tech partner',
        description: 'Learn how our team can support your roadmap from idea to scale.',
        primaryLabel: 'Get in Touch',
        primaryTo: '/contact',
      }}
    />
  )
}

export default AboutPage
