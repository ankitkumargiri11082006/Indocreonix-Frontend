import CompanyPage from '../components/CompanyPage'

const sectionItems = [
  {
    title: 'Growth Opportunities',
    description: 'Work on cutting-edge projects in AI, cloud, product engineering, and enterprise platforms.',
  },
  {
    title: 'Learning Culture',
    description: 'Access mentorship, internal knowledge sessions, and budget for certifications.',
  },
  {
    title: 'People-First Environment',
    description: 'Flexible work model, collaborative teams, and a healthy focus on sustainable delivery.',
  },
]

function CareersPage() {
  return (
    <CompanyPage
      eyebrow="Careers"
      title="Build Your Career with Indocreonix"
      subtitle="Join a team where your ideas shape meaningful products and real-world impact."
      sectionTitle="Why Join Us"
      sectionItems={sectionItems}
      cta={{
        title: 'Interested in joining our team?',
        description: 'Share your profile and we will connect with relevant opportunities.',
        primaryLabel: 'Apply Now',
        primaryTo: '/contact',
      }}
    />
  )
}

export default CareersPage
