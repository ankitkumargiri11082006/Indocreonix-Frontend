import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'

const sectionItems = [
  {
    title: 'Our Mission',
    description: 'Help organizations modernize confidently through dependable engineering, clear communication, and measurable delivery outcomes.',
  },
  {
    title: 'Our Culture',
    description: 'We promote ownership, teamwork, and continuous learning so every engineer can grow while delivering quality work.',
  },
  {
    title: 'Our Promise',
    description: 'Every solution is designed for maintainability, security, and long-term business impact, not short-term patchwork.',
  },
]

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Indocreonix"
        title="A Professional Technology Team Focused on Delivery"
        subtitle="Indocreonix partners with founders and business leaders to build software that is scalable, secure, and future-ready."
        theme="theme-about"
        metrics={[
          { value: 'Delhi, India', label: 'Head Office' },
          { value: 'Web · Cloud · AI', label: 'Core Expertise' },
          { value: 'B2B Delivery', label: 'Engagement Model' },
        ]}
      />

      <section className="content-section container leadership-section">
        <h2>Leadership Team</h2>
        <div className="leadership-grid">
          <article className="leader-card">
            <div className="leader-photo-wrap">
              <img src="/founder.png" alt="Founder and CEO of Indocreonix" className="leader-photo" />
            </div>
            <p className="leader-role">Founder & CEO</p>
            <h3>Indocreonix Leadership</h3>
            <p>
              Leads company strategy and delivery excellence with a strong focus on building reliable,
              business-driven technology solutions.
            </p>
          </article>

          <article className="leader-card">
            <div className="leader-photo-wrap">
              <img src="/brand-ambassador.png" alt="Brand Ambassador of Indocreonix" className="leader-photo leader-photo-top" />
            </div>
            <p className="leader-role">Brand Ambassador</p>
            <h3>Indocreonix Brand Presence</h3>
            <p>
              Represents the company publicly and strengthens brand credibility through clear communication,
              outreach, and audience engagement.
            </p>
          </article>
        </div>
      </section>

      <SectionBlock title="Who We Are" items={sectionItems} />

      <CtaBanner
        title="Build with a trusted tech partner"
        description="Discuss your goals with our team and get a practical roadmap for implementation."
        primaryLabel="Get in Touch"
        primaryTo="/contact"
      />
    </>
  )
}

export default AboutPage
