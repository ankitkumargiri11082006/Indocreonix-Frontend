import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'
import { servicesOffered } from '../data/services'
import { clientsServed } from '../data/clients'

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
        subtitle="We are a Delhi-based technology company helping startups and enterprises build modern web, Android, iOS, software, cloud, and AI-enabled products."
        theme="theme-home"
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
      <SectionBlock title="Services We Offer" items={servicesOffered} />

      <section className="content-section container">
        <h2>Our Clients</h2>
        <div className="clients-grid">
          {clientsServed.map((client) => (
            <a
              className="client-card"
              key={client.name}
              href={client.website}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${client.name} website`}
            >
              <img src={client.logo} alt={`${client.name} logo`} className="client-card-logo" loading="lazy" />
              <h3>{client.name}</h3>
            </a>
          ))}
        </div>
      </section>
      
      <section className="container">
        <div className="cloud-illustration-wrapper">
          <img 
            src="/cloud_isometric.png" 
            alt="Cloud Architecture Isometric Illustration" 
            className="cloud-illustration"
            loading="lazy"
          />
        </div>
      </section>

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
