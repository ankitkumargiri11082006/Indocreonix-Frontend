import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Workflow Management System',
    description: 'A configurable platform for approvals, task tracking, and cross-team process visibility.',
  },
  {
    title: 'Business Operations Dashboard',
    description: 'Unified dashboards for KPI tracking, team performance, and operational reporting.',
  },
  {
    title: 'AI-Enabled Service Assistant',
    description: 'A support assistant layer for internal knowledge search, response drafting, and service automation.',
  },
]

function ProductsPage() {
  return (
    <CompanyPage
      eyebrow="Our Products"
      title="Productized Solutions for Faster Deployment"
      subtitle="Use our implementation-ready solution modules to accelerate delivery and reduce development overhead."
      sectionTitle="Product Portfolio"
      sectionItems={sectionItems}
      cta={{
        title: 'Want a live product walkthrough?',
        description: 'Connect with our team for a walkthrough based on your business use case.',
        primaryLabel: 'Request Demo',
        primaryTo: '/contact',
      }}
    />
  )
}

export default ProductsPage
