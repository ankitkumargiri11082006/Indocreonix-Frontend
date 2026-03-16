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

  const featuredProjects = useMemo(() => {
    const markedFeatured = projects.filter((project) => project.featured)
    if (markedFeatured.length > 0) {
      return markedFeatured
    }

    return projects.slice(0, 3)
  }, [projects])

  const sectionItems = useMemo(() => {
    return projects.map((project) => ({
      title: project.title,
      description: project.summary,
      image: project.logo,
      primaryLabel: 'Make Similar Project',
      primaryTo: `/request-quote?project=${encodeURIComponent(project.title)}`,
      secondaryLabel: 'Website Link',
      secondaryHref: project.website || '/contact',
      meta: (project.developerName || project.developer || project.developerCredit || project.developer_name)
        ? `Developer Credit: ${project.developerName || project.developer || project.developerCredit || project.developer_name}`
        : '',
    }))
  }, [projects])

  return (
    <>
      <PageHero
        eyebrow="Projects We Delivered"
        title="Projects We Delivered for Real-World Businesses"
        subtitle="A snapshot of projects delivered by Indocreonix across website development and full software systems."
        theme="theme-d"
        metrics={[
          { value: 'Web + Software', label: 'Delivery Scope' },
          { value: 'Multi-Sector', label: 'Project Types' },
          { value: 'Production Ready', label: 'Execution Quality' },
        ]}
      />

      <section className="content-section container">
        <h2>Featured Projects</h2>
        {featuredProjects.length > 0 ? (
          <div className="project-highlight-grid">
            {featuredProjects.map((project) => (
              <article className="project-highlight-card" key={project._id || project.title}>
                <img
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="project-highlight-logo"
                />
                <div>
                  <p className="project-highlight-tag">{project.category || 'Project Delivery'}</p>
                  <h3>{project.title}</h3>
                  <p>{project.details || project.summary}</p>
                  {project.developerName || project.developer || project.developerCredit || project.developer_name ? (
                    <p className="project-credit">
                      Developer Credit: {project.developerName || project.developer || project.developerCredit || project.developer_name}
                    </p>
                  ) : null}
                  <p>
                    <a
                      href={`/request-quote?project=${encodeURIComponent(project.title)}`}
                      className="contact-link"
                    >
                      Make Similar Project
                    </a>
                  </p>
                  <p>
                    <a href={project.website || '/contact'} target="_blank" rel="noreferrer" className="contact-link">
                      Website Link
                    </a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <article className="info-card">
            <p>No projects have been published yet. Add projects from Admin panel.</p>
          </article>
        )}
      </section>

      {sectionItems.length > 0 ? <SectionBlock title="All Projects We Delivered" items={sectionItems} /> : null}

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
