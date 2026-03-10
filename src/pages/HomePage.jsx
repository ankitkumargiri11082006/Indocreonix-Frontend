import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'

const highlights = [
  {
    title: 'AI Product Engineering',
    description: 'From concept to deployment, we build AI-powered products with robust MLOps and measurable ROI.',
  },
  {
    title: 'Cloud Modernization',
    description: 'Migrate legacy systems to resilient cloud-native architectures that scale with your growth.',
  },
  {
    title: 'Data Platforms',
    description: 'Design pipelines, governance layers, and analytics stacks that turn data into decisions.',
  },
]

function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Future-Ready Technology"
        title="Indocreonix Builds Digital Systems That Move Business Forward"
        subtitle="We are a technology company focused on product engineering, enterprise transformation, and long-term innovation partnerships."
        theme="theme-launch"
        metrics={[
          { value: '50M+', label: 'Users Served on Client Platforms' },
          { value: '11', label: 'Industry Verticals' },
          { value: '8 Weeks', label: 'Average MVP Launch Time' },
        ]}
        actions={
          <>
            <Link to="/services" className="btn btn-primary">
              Explore Services
            </Link>
            <Link to="/case-studies" className="btn btn-secondary">
              View Case Studies
            </Link>
          </>
        }
      />
      <SectionBlock title="What We Deliver" items={highlights} />
      <CtaBanner
        title="Ready to launch your next digital initiative?"
        description="Partner with Indocreonix to design, develop, and scale secure technology solutions."
        primaryLabel="Start a Project"
        primaryTo="/contact"
      />
    </>
  )
}

export default HomePage
