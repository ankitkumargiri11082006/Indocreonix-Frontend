import PageHero from '../components/PageHero'
import CareerApplicationForm from '../components/CareerApplicationForm'

function InternshipApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Internship Application"
        subtitle="Apply for internship opportunities at Indocreonix and gain practical experience on real projects."
        theme="theme-c"
        metrics={[
          { value: 'Students', label: 'Eligible Candidates' },
          { value: 'Mentored Work', label: 'Learning Model' },
          { value: 'Project-Based', label: 'Experience Type' },
        ]}
      />

      <CareerApplicationForm
        roleType="internship"
        title="Apply for Internship"
        subtitle="Complete this form with accurate details. Our team will review and contact shortlisted candidates."
        successMessage="Internship application submitted successfully. Our team will review and connect with you."
      />
    </>
  )
}

export default InternshipApplyPage