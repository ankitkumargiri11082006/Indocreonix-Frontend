import { useEffect, useMemo, useState } from 'react'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'
import { apiRequest } from '../lib/apiClient'

function CaseStudiesPage() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    apiRequest('/projects/public')
      .then((result) => setProjects(result.items || []))
      .catch(() => setProjects([]))
  }, [])

  const featuredProject = useMemo(() => {
    return projects.find((project) => project.featured) || projects[0]
  }, [projects])

  const sectionItems = useMemo(() => {
    return projects.map((project) => ({
      title: project.title,
      description: project.summary,
      image: project.logo,
    }))
  }, [projects])

  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Proven Results Across Real-World Implementations"
        subtitle="A snapshot of projects delivered by Indocreonix across website development and full software systems."
        theme="theme-d"
        metrics={[
          { value: 'Web + Software', label: 'Delivery Scope' },
          { value: 'Multi-Sector', label: 'Project Types' },
          { value: 'Production Ready', label: 'Execution Quality' },
        ]}
      />

      <section className="content-section container">
        <h2>Featured Project</h2>
        {featuredProject ? (
          <article className="project-highlight-card">
            <img
              src={featuredProject.logo}
              alt={`${featuredProject.title} logo`}
              className="project-highlight-logo"
            />
            <div>
              <p className="project-highlight-tag">{featuredProject.category || 'Project Delivery'}</p>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.details || featuredProject.summary}</p>
              {featuredProject.website ? (
                <p>
                  <a href={featuredProject.website} target="_blank" rel="noreferrer" className="contact-link">
                    Visit Project Website
                  </a>
                </p>
              ) : null}
            </div>
          </article>
        ) : (
          <article className="info-card">
            <p>No projects have been published yet. Add projects from Admin panel.</p>
          </article>
        )}
      </section>

      <SectionBlock title="More Project Work by Indocreonix" items={sectionItems} />

      <CtaBanner
        title="Need a team that can deliver both website and software systems?"
        description="Connect with Indocreonix for end-to-end implementation with practical business outcomes."
        primaryLabel="Start Conversation"
        primaryTo="/contact"
      />
    </>
  )
}

export default CaseStudiesPage
