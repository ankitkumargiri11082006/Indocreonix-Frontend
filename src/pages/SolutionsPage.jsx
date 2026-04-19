import CompanyPage from '../components/CompanyPage'
import SEO from '../components/SEO'

const sectionItems = [
  {
    title: 'Business Process Automation',
    description: 'Automate repetitive approvals, notifications, and operational workflows to reduce manual effort and improve delivery speed.',
  },
  {
    title: 'Digital Platform Modernization',
    description: 'Transform legacy systems into modular, secure, and scalable platforms with stronger user and admin experiences.',
  },
  {
    title: 'Data-Driven Decision Systems',
    description: 'Unify business data into centralized analytics dashboards for faster, better-informed leadership decisions.',
  },
  {
    title: 'Customer Experience Optimization',
    description: 'Improve conversion, retention, and support outcomes by redesigning critical digital touchpoints and service flows.',
  },
  {
    title: 'Scalable Service Operations',
    description: 'Design systems, integrations, and governance models that support growth without compromising quality or control.',
  },
]

function SolutionsPage() {
  return (
    <>
      <SEO
        title="Solutions | Indocreonix Industry-Focused Technology Frameworks"
        description="Explore Indocreonix solution frameworks for automation, modernization, analytics, and scalable digital operations tailored to business goals."
        keywords="business automation solutions, platform modernization, digital transformation services, enterprise solution architecture, indocreonix solutions"
      />
      <CompanyPage
        eyebrow="Industry Solutions"
        title="Solution Frameworks for Growth-Focused Organizations"
        subtitle="Indocreonix combines engineering excellence with business context to deliver practical, scalable, and implementation-ready solution models."
        sectionTitle="Solution Areas"
        sectionItems={sectionItems}
        cta={{
          title: 'Looking for an industry-specific execution plan?',
          description: 'Let us map your operational priorities to a practical technology roadmap with clear implementation milestones.',
          primaryLabel: 'Request Project Quote',
          primaryTo: '/request-quote?source=solutions-page',
        }}
      />
    </>
  )
}

export default SolutionsPage
