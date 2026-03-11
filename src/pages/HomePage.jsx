import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'

const highlights = [
  {
    title: 'Custom Software Delivery',
    description: 'We build secure web and business applications tailored to your operations, users, and growth goals.',
  },
  {
    title: 'Cloud & DevOps Enablement',
    description: 'Our team modernizes deployment pipelines, improves reliability, and helps teams ship faster with confidence.',
  },
  {
    title: 'Data & AI Solutions',
    description: 'From reporting dashboards to AI-assisted workflows, we design solutions that are practical and maintainable.',
  },
]

function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Future-Ready Technology"
        title="Indocreonix Delivers Reliable Technology for Real Business Needs"
        subtitle="We are a Delhi-based technology company helping startups and enterprises build modern software, cloud platforms, and AI-enabled products."
        theme="theme-launch"
        metrics={[
          { value: 'Delhi, India', label: 'Headquartered In' },
          { value: 'B2B Technology', label: 'Primary Focus' },
          { value: 'Jobs + Internships', label: 'Career Openings' },
        ]}
        actions={
          <>
            <Link to="/services" className="btn btn-primary">
              Explore Services
            </Link>
            <Link to="/careers" className="btn btn-secondary">
              Join Our Team
            </Link>
          </>
        }
      />
      <SectionBlock title="What We Deliver" items={highlights} />
      <CtaBanner
        title="Need a dependable technology partner for your next build?"
        description="Partner with Indocreonix to plan, build, and scale modern digital products with clear delivery ownership."
        primaryLabel="Start a Project"
        primaryTo="/contact"
      />
    </>
  )
}

export default HomePage
