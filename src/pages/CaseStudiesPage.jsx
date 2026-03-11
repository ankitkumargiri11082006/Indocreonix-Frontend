import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'

const sectionItems = [
  {
    title: 'Multi-Industry Project Delivery',
    description: 'Indocreonix has delivered websites, internal tools, and business software for organizations across different sectors.',
  },
  {
    title: 'Web + Software Implementation',
    description: 'From public-facing websites to full operational systems, we build practical, maintainable digital products.',
  },
  {
    title: 'Reliable Long-Term Support',
    description: 'Our delivery approach includes implementation quality, handover clarity, and post-launch support where required.',
  },
]

function CaseStudiesPage() {
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
        <article className="project-highlight-card">
          <img
            src="https://res.cloudinary.com/dmmll82la/image/upload/v1766683651/ddka-logo_ywnhyh.png"
            alt="Dhanbad District Kabaddi Association logo"
            className="project-highlight-logo"
          />
          <div>
            <p className="project-highlight-tag">Sports Organization Technology Delivery</p>
            <h3>Dhanbad District Kabaddi Association (DDKA)</h3>
            <p>
              Indocreonix built the official website for Dhanbad District Kabaddi Association and delivered a full
              software system to store and manage kabaddi player data for the district.
            </p>
          </div>
        </article>
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
