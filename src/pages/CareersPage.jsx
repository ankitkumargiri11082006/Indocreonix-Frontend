import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import { apiRequest } from '../lib/apiClient'

const sectionItems = [
  {
    title: 'Real Project Exposure',
    description: 'Work on client-facing and internal projects with guidance from experienced developers and leads.',
  },
  {
    title: 'Structured Mentorship',
    description: 'Learn through code reviews, sprint collaboration, and practical technical mentorship.',
  },
  {
    title: 'Career Growth Path',
    description: 'We support early talent and experienced professionals with clear responsibilities and growth opportunities.',
  },
]

function CareersPage() {
  const [internships, setInternships] = useState([])
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    apiRequest('/careers/opportunities/public?type=internship')
      .then((result) => setInternships(result.items || []))
      .catch(() => setInternships([]))

    apiRequest('/careers/opportunities/public?type=job')
      .then((result) => setJobs(result.items || []))
      .catch(() => setJobs([]))
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build Your Career with Indocreonix"
        subtitle="We are hiring students for internships and professionals for full-time roles across our technology teams."
        theme="theme-careers"
        metrics={[
          { value: 'Internships', label: 'For Students' },
          { value: 'Full-Time Jobs', label: 'For Professionals' },
          { value: 'Hybrid Collaboration', label: 'Working Model' },
        ]}
      />

      <SectionBlock title="Why Join Us" items={sectionItems} />

      <section className="content-section container">
        <h2>Current Openings</h2>
        <div className="career-track-grid">
          <article className="info-card">
            <h3>Internship Program</h3>
            <p>
              {internships[0]?.summary ||
                'For students and fresh graduates seeking practical industry experience and mentorship.'}
            </p>
            <Link className="btn btn-primary career-track-btn" to="/careers/apply/internship">
              Apply for Internship
            </Link>
            {internships.length > 0 ? (
              <div className="career-opening-list">
                {internships.map((opening) => (
                  <article className="career-opening-card" key={opening._id}>
                    <p className="career-opening-type">Internship</p>
                    <h4>{opening.title}</h4>
                    <p>{opening.summary}</p>
                    <p className="career-opening-meta">{opening.location} • {opening.mode} • {opening.experience}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="career-opening-empty">No internship openings published yet.</p>
            )}
          </article>
          <article className="info-card">
            <h3>Full-Time Opportunities</h3>
            <p>
              {jobs[0]?.summary ||
                'For professionals who want to work on production systems and client delivery projects.'}
            </p>
            <Link className="btn btn-primary career-track-btn" to="/careers/apply/job">
              Apply for Job
            </Link>
            {jobs.length > 0 ? (
              <div className="career-opening-list">
                {jobs.map((opening) => (
                  <article className="career-opening-card" key={opening._id}>
                    <p className="career-opening-type">Job</p>
                    <h4>{opening.title}</h4>
                    <p>{opening.summary}</p>
                    <p className="career-opening-meta">{opening.location} • {opening.mode} • {opening.experience}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="career-opening-empty">No job openings published yet.</p>
            )}
          </article>
        </div>
      </section>
    </>
  )
}

export default CareersPage
