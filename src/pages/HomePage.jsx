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
  const [loadingPublicData, setLoadingPublicData] = useState(true)

  useEffect(() => {
    let mounted = true

    Promise.allSettled([
      apiRequest('/services/public', { cacheMs: 120000 }),
      apiRequest('/clients/public', { cacheMs: 120000 }),
      apiRequest('/projects/public', { cacheMs: 120000 }),
    ]).then(([servicesResult, clientsResult, projectsResult]) => {
      if (!mounted) return

      setServicesOffered(
        servicesResult.status === 'fulfilled' ? servicesResult.value.items || [] : [],
      )
      setClientsServed(
        clientsResult.status === 'fulfilled' ? clientsResult.value.items || [] : [],
      )
      setProjectsDelivered(
        projectsResult.status === 'fulfilled' ? projectsResult.value.items || [] : [],
      )
      setLoadingPublicData(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const projectItems = projectsDelivered.map((project) => ({
    title: project.title,
    description: project.summary,
    image: project.logo,
    primaryLabel: 'Clone',
    primaryTo: `/request-quote?project=${encodeURIComponent(project.title)}`,
    secondaryLabel: 'Website',
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
      primaryLabel: 'Explore',
      primaryTo: `/services/${catalogService.slug}`,
      secondaryLabel: 'Quote',
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

      {loadingPublicData ? (
        <section className="content-section container home-projects-section">
          <p className="section-eyebrow">Proven Outcomes</p>
          <h2>Projects Delivered by Indocreonix</h2>
          <p className="section-subtitle">
            Preparing recent project highlights for you.
          </p>
          <div className="card-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <article className="info-card skeleton" key={`project-skeleton-${index}`}>
                <div className="skeleton-box" style={{ height: 180, marginBottom: 14 }} />
                <div className="skeleton-text" style={{ width: '64%', height: 20, marginBottom: 12 }} />
                <div className="skeleton-text" style={{ width: '100%', height: 14, marginBottom: 8 }} />
                <div className="skeleton-text" style={{ width: '78%', height: 14 }} />
              </article>
            ))}
          </div>
        </section>
      ) : projectItems.length > 0 ? (
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
        {loadingPublicData ? (
          <div className="clients-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <article className="client-card client-card-minimal skeleton" key={`client-skeleton-${index}`}>
                <div className="client-card-logo-wrap skeleton-box" />
                <div className="skeleton-text" style={{ width: '60%', height: 18, margin: '12px auto' }} />
              </article>
            ))}
          </div>
        ) : clientsServed.length > 0 ? (
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
