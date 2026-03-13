import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'

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
        <h2>Select Your Application Track</h2>
        <div className="career-track-grid">
          <article className="info-card">
            <h3>Internship Program</h3>
            <p>For students and fresh graduates seeking practical industry experience and mentorship.</p>
            <Link className="btn btn-primary career-track-btn" to="/careers/internship">
              Apply for Internship
            </Link>
          </article>
          <article className="info-card">
            <h3>Full-Time Opportunities</h3>
            <p>For professionals who want to work on production systems and client delivery projects.</p>
            <Link className="btn btn-primary career-track-btn" to="/careers/job">
              Apply for Job
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}

export default CareersPage
