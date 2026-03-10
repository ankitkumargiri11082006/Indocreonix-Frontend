import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'IndoFlow',
    description: 'Workflow orchestration platform for business operations with real-time visibility.',
  },
  {
    title: 'IndoSecure',
    description: 'Threat monitoring dashboard for security teams with policy automation capabilities.',
  },
  {
    title: 'IndoPulse',
    description: 'Executive analytics suite that transforms operational data into strategic KPIs.',
  },
]

function ProductsPage() {
  return (
    <CompanyPage
      eyebrow="Our Products"
      title="Purpose-Built Product Suite for Digital Enterprises"
      subtitle="Accelerate execution with modular products developed by the Indocreonix team."
      sectionTitle="Product Portfolio"
      sectionItems={sectionItems}
      cta={{
        title: 'Want a live product walkthrough?',
        description: 'See how our platforms can be integrated into your stack quickly.',
        primaryLabel: 'Request Demo',
        primaryTo: '/contact',
      }}
    />
  )
}

export default ProductsPage
