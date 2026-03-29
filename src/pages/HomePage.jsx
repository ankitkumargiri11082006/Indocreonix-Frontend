import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'
import AdaptiveLogoImage from '../components/AdaptiveLogoImage'
import { apiRequest } from '../lib/apiClient'
import SEO from '../components/SEO'
import { serviceCatalog } from '../data/serviceCatalog'

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
  const [servicesOffered, setServicesOffered] = useState([])
  const [clientsServed, setClientsServed] = useState([])
  const [projectsDelivered, setProjectsDelivered] = useState([])

  useEffect(() => {
    apiRequest('/services/public')
      .then((result) => setServicesOffered(result.items || []))
      .catch(() => setServicesOffered([]))

    apiRequest('/clients/public')
      .then((result) => setClientsServed(result.items || []))
      .catch(() => setClientsServed([]))

    apiRequest('/projects/public')
      .then((result) => setProjectsDelivered(result.items || []))
      .catch(() => setProjectsDelivered([]))
  }, [])

  const projectItems = projectsDelivered.map((project) => ({
    title: project.title,
    description: project.summary,
    image: project.logo,
    primaryLabel: 'Make Similar Project',
    primaryTo: `/request-quote?project=${encodeURIComponent(project.title)}`,
    secondaryLabel: 'Website Link',
    secondaryHref: project.website || '/contact',
    meta:
      project.developerName ||
      project.developer ||
      project.developerCredit ||
      project.developer_name
        ? `Developer Credit: ${
            project.developerName ||
            project.developer ||
            project.developerCredit ||
            project.developer_name
          }`
        : '',
  }))

  const sectionServices = serviceCatalog.map((catalogService) => {
    const dbService =
      servicesOffered.find((item) => item.title === catalogService.title) || {};

    const serviceTitle = dbService.title || catalogService.title;

    return {
      title: serviceTitle,
      description: dbService.description || catalogService.shortDescription,
      image: dbService.image || catalogService.image,
      primaryLabel: 'Details',
      primaryTo: `/services/${catalogService.slug}`,
      secondaryLabel: 'Get Quote',
      secondaryTo: `/request-quote?service=${encodeURIComponent(serviceTitle)}`,
    };
  })

  return (
    <>
      <SEO 
        title="Indocreonix | India's Leading IT Company | Web & App Solutions"
        description="Indocreonix stands as the ultimate technology partner offering top tier web development, Android & iOS app development, enterprise software, and cloud solutions. Search for Indocreonix to find the best digital solutions."
        keywords="indocreonix homepage, indocreonix.com, indocreonix reviews, indocreonix services, indo tech, indocreonix web development, top rated it agency, custom digital solutions, best android app development, reliable tech services, indocreonix infotech, indocreonix software company"
      />
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
            <Link to="/request-quote" className="btn btn-primary">
              Request Project Quote
            </Link>
            <Link to="/services" className="btn btn-secondary">
              Explore Services
            </Link>
          </>
        }
      />
      <SectionBlock
        title="What We Deliver"
        items={highlights}
        sectionClassName="home-deliver-section"
        eyebrow="Core Value"
        subtitle="Focused capabilities designed to solve practical business challenges with speed and quality."
      />
      <SectionBlock
        title="Services We Offer"
        items={sectionServices}
        imageLayout="full"
        sectionClassName="home-services-section"
        eyebrow="End-to-End Services"
        subtitle="Explore specialized technology services tailored for startups, enterprises, and growth-stage teams."
      />

      {projectItems.length > 0 ? (
        <SectionBlock
          title="Projects Delivered by Indocreonix"
          items={projectItems}
          sectionClassName="home-projects-section"
          eyebrow="Proven Outcomes"
          subtitle="A snapshot of successful digital products delivered with strong execution and measurable impact."
        />
      ) : null}

      <section className="content-section container home-clients-section">
        <p className="home-clients-eyebrow">Trusted Collaborations</p>
        <h2>Our Clients</h2>
        <p className="home-clients-subtitle">
          Organizations that trust Indocreonix to design, build, and grow their digital products.
        </p>
        {clientsServed.length > 0 ? (
          <div className="clients-grid">
            {clientsServed.map((client) => (
              <article className="client-card client-card-minimal" key={client._id || client.name}>
                <AdaptiveLogoImage
                  src={client.logo}
                  alt={`${client.name} logo`}
                  frameClassName="client-card-logo-wrap"
                  imageClassName="client-card-logo"
                />
                <h3>{client.name}</h3>
              </article>
            ))}
          </div>
        ) : (
          <article className="info-card">
            <p>No clients have been published yet. Add clients from Admin panel.</p>
          </article>
        )}
      </section>

      <CtaBanner
        title="Need a dependable technology partner for your next build?"
        description="Partner with Indocreonix to plan, build, and scale modern digital products with clear delivery ownership."
        primaryLabel="Submit Project Request"
        primaryTo="/request-quote"
      />
    </>
  )
}

export default HomePage
