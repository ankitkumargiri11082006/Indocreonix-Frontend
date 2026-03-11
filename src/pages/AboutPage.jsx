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
        theme="theme-e"
        metrics={[
          { value: 'Delhi, India', label: 'Head Office' },
          { value: 'Web · Cloud · AI', label: 'Core Expertise' },
          { value: 'B2B Delivery', label: 'Engagement Model' },
        ]}
      />

      <SectionBlock title="Who We Are" items={sectionItems} />

      <section className="content-section container founder-section">
        <h2>Founder & CEO</h2>
        <article className="founder-card">
          <div className="founder-photo-wrap">
            <img src="/founder.png" alt="Founder and CEO of Indocreonix" className="founder-photo" />
          </div>
          <div className="founder-content">
            <p className="founder-role">Leadership</p>
            <h3>Founder & CEO, Indocreonix</h3>
            <p>
              Indocreonix is led with a clear vision to build dependable digital systems that solve practical
              business problems through engineering excellence, execution discipline, and long-term trust.
            </p>
            <p>
              Under this leadership, the company focuses on modern software development, cloud transformation,
              and AI-enabled solutions tailored for growing businesses and enterprise teams.
            </p>
          </div>
        </article>
      </section>

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
