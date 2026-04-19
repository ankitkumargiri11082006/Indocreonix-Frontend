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
    title: 'Product Discovery & Technical Planning',
    description: 'We align business objectives, user journeys, and architecture decisions before development begins, reducing delivery risk and rework.',
  },
  {
    title: 'Custom Engineering Execution',
    description: 'From web platforms and mobile apps to internal systems, we deliver maintainable solutions with strong coding and security practices.',
  },
  {
    title: 'Cloud, DevOps, and Reliability',
    description: 'We strengthen release pipelines, uptime, and performance so your platform can scale consistently under real usage conditions.',
  },
  {
    title: 'Data, Automation, and AI Adoption',
    description: 'We implement practical data and AI workflows that improve decision speed, reduce repetitive work, and unlock measurable efficiency.',
  },
]

const deliveryModel = [
  {
    title: '1. We Understand Your Goal',
    description: 'We start by understanding your business objective, target users, and project priorities so the solution is built around your needs.',
  },
  {
    title: '2. We Plan the Right Solution',
    description: 'You get a clear project plan with scope, milestones, timeline, and recommended technology choices.',
  },
  {
    title: '3. We Build and Test',
    description: 'Our team develops your product in milestones, shares regular progress updates, and validates quality before launch.',
  },
  {
    title: '4. We Launch and Support',
    description: 'After go-live, we continue with support, improvements, and performance monitoring to keep your platform stable and growing.',
  },
]

const trustHighlights = [
  {
    title: 'Clear Communication',
    description: 'You always know project status, next milestones, and decisions needed from your side.',
  },
  {
    title: 'On-Time Delivery Focus',
    description: 'We plan in realistic phases so features are delivered in priority order without unnecessary delays.',
  },
  {
    title: 'Long-Term Support',
    description: 'We stay available after launch for fixes, upgrades, and ongoing technical guidance.',
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
        title="Indocreonix | Professional Software, Web, App, Cloud & AI Services"
        description="Indocreonix is a professional technology services company delivering custom software, web engineering, mobile applications, cloud modernization, automation, and AI-driven solutions for growth-focused businesses."
        keywords="indocreonix, software development company, web development services, mobile app development, cloud and devops services, ai solutions company, technology partner india, enterprise software services"
      />
      <PageHero
        eyebrow="Professional Technology Services"
        title="A Dependable Engineering Partner for Business-Critical Digital Products"
        subtitle="Indocreonix helps you plan, build, and scale websites, mobile apps, business software, cloud platforms, and AI-enabled solutions with a clear process and reliable support."
        theme="theme-home"
        metrics={[
          { value: 'Delhi, India', label: 'Headquartered In' },
          { value: 'B2B Services', label: 'Primary Focus' },
          { value: 'Discovery to Support', label: 'Delivery Coverage' },
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
        eyebrow="Core Capabilities"
        subtitle="Service areas designed to solve practical business problems and support long-term growth."
      />
      <SectionBlock
        title="How We Engage"
        items={deliveryModel}
        sectionClassName="home-deliver-section"
        eyebrow="Execution Framework"
        subtitle="A simple step-by-step delivery model that keeps your team informed from planning to launch."
      />
      <SectionBlock
        title="Why Clients Choose Indocreonix"
        items={trustHighlights}
        sectionClassName="home-deliver-section"
        eyebrow="Client Experience"
        subtitle="A professional engagement style focused on transparency, speed, and dependable execution."
      />
      <SectionBlock
        title="Services We Offer"
        items={sectionServices}
        imageLayout="full"
        sectionClassName="home-services-section"
        eyebrow="End-to-End Services"
        subtitle="Explore professional service tracks tailored for startups, SMEs, and enterprises with evolving digital priorities."
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
        title="Need a professional team to execute your next digital initiative?"
        description="Tell us what you want to build and our team will share a practical plan, timeline, and recommended next steps."
        primaryLabel="Submit Project Request"
        primaryTo="/request-quote"
      />
    </>
  )
}

export default HomePage
