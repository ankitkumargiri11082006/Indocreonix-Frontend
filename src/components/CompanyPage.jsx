import PageHero from './PageHero'
import SectionBlock from './SectionBlock'
import CtaBanner from './CtaBanner'

const themes = ['theme-a', 'theme-b', 'theme-c', 'theme-d', 'theme-e']

function getThemeFromTitle(title) {
  const checksum = [...title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return themes[checksum % themes.length]
}

function CompanyPage({ eyebrow, title, subtitle, sectionTitle, sectionItems, cta, theme, metrics }) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        theme={theme ?? getThemeFromTitle(title)}
        metrics={
          metrics ?? [
            { value: 'Delhi, India', label: 'Head Office' },
            { value: 'Web · Cloud · AI', label: 'Core Expertise' },
            { value: 'B2B Delivery', label: 'Engagement Model' },
          ]
        }
      />
      <SectionBlock title={sectionTitle} items={sectionItems} />
      <CtaBanner
        title={cta.title}
        description={cta.description}
        primaryLabel={cta.primaryLabel}
        primaryTo={cta.primaryTo}
      />
    </>
  )
}

export default CompanyPage
