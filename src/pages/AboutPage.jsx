import PageHero from '../components/PageHero'
import SectionBlock from '../components/SectionBlock'
import CtaBanner from '../components/CtaBanner'
import SEO from '../components/SEO'

const sectionItems = [
  {
    title: 'Our Mission',
    description: 'Enable organizations to modernize with confidence through dependable engineering, transparent collaboration, and measurable business outcomes.',
  },
  {
    title: 'Our Culture',
    description: 'We foster ownership, accountability, and continuous learning so teams can deliver high-quality work without compromising reliability.',
  },
  {
    title: 'Our Promise',
    description: 'Every implementation is built for maintainability, security, and sustained business value rather than short-lived technical fixes.',
  },
]

const differentiators = [
  {
    title: 'Business-First Engineering',
    description: 'We map technical decisions directly to business priorities so your investment translates into tangible operational and growth impact.',
  },
  {
    title: 'Structured Delivery Governance',
    description: 'With clear milestones, progress visibility, and quality checkpoints, stakeholders stay informed and aligned throughout delivery.',
  },
  {
    title: 'Long-Term Technology Partnership',
    description: 'Beyond launch, we continue to optimize, support, and evolve your platform as user needs and market conditions change.',
  },
]

function AboutPage() {
  return (
    <>
      <SEO 
        title="About Indocreonix | Professional Engineering & Delivery Team"
        description="Learn about Indocreonix, a professional technology services company focused on scalable software engineering, transparent delivery, and long-term client success."
        keywords="about indocreonix, software engineering company india, professional technology partner, web cloud ai experts, custom software team"
      />
      <PageHero
        eyebrow="About Indocreonix"
        title="A Professional Technology Team Focused on Reliable Delivery"
        subtitle="Indocreonix partners with founders, operations leaders, and enterprise stakeholders to build secure, scalable, and maintainable digital systems."
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
            <h3>Mr. Avinash Puri</h3>
            <p>
              Leads strategy and delivery governance with a strong emphasis on building resilient,
              business-aligned technology platforms.
            </p>
          </article>

          <article className="leader-card">
            <div className="leader-photo-wrap">
              <img src="/brand-ambassador.png" alt="Brand Ambassador of Indocreonix" className="leader-photo leader-photo-top" />
            </div>
            <p className="leader-role">Brand Ambassador</p>
            <h3>Mr. Rahul Pandey</h3>
            <p>
              Represents the company publicly and strengthens brand trust through professional communication,
              strategic outreach, and stakeholder engagement.
            </p>
          </article>
        </div>
      </section>

      <SectionBlock title="Who We Are" items={sectionItems} />
      <SectionBlock
        title="Why Organizations Work With Us"
        items={differentiators}
        eyebrow="Our Differentiators"
        subtitle="A delivery philosophy built around quality engineering, predictable execution, and long-term partnership value."
      />

      <CtaBanner
        title="Build with a trusted long-term technology partner"
        description="Discuss your goals with our team and receive a practical roadmap aligned to your timeline, budget, and growth plans."
        primaryLabel="Get in Touch"
        primaryTo="/contact"
      />
    </>
  )
}

export default AboutPage
