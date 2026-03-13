import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Web Applications',
    description: 'Enterprise-grade React applications, robust dashboards, and secure internal tools built for modern web standards.',
    image: '/svc_web.png'
  },
  {
    title: 'Mobile Development',
    description: 'High-performance Android and iOS applications designed with perfect UI scaling and offline capabilities.',
    image: '/svc_mobile.png'
  },
  {
    title: 'Custom Software',
    description: 'End-to-end bespoke software systems fully tailored around your operational workflow and growth goals.',
    image: '/svc_software.png'
  },
  {
    title: 'Business Automation',
    description: 'Replace manual processes with intelligent script logic, API integrations, and continuous data pipelines.',
    image: '/svc_automation.png'
  },
  {
    title: 'Cloud & DevOps',
    description: 'Cloud migration, advanced CI/CD implementation, and containerized monitoring setups for stable releases.',
    image: '/svc_cloud.png'
  },
  {
    title: 'AI & Data Solutions',
    description: 'From reporting dashboards to custom Machine Learning workflows, we deliver solutions that are data-driven.',
    image: '/svc_ai.png'
  },
]

function ServicesPage() {
  return (
    <CompanyPage
      eyebrow="Our Services"
      title="Technology Services Designed for Practical Business Outcomes"
      subtitle="We provide flexible engagement models for new builds, modernization projects, and long-term product support."
      sectionTitle="Service Capabilities"
      sectionItems={sectionItems}
      theme="theme-services"
      cta={{
        title: 'Need a tailored service plan?',
        description: 'Share your scope and timeline. We will propose a structured delivery approach for your team.',
        primaryLabel: 'Discuss Services',
        primaryTo: '/contact',
      }}
    />
  )
}

export default ServicesPage
