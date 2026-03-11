import PageHero from '../components/PageHero'
import CareerApplicationForm from '../components/CareerApplicationForm'

function JobApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Job Application"
        subtitle="Apply for full-time opportunities at Indocreonix and contribute to client and internal product delivery."
        theme="theme-c"
        metrics={[
          { value: 'Professionals', label: 'Target Candidates' },
          { value: 'Full-Time Roles', label: 'Opportunity Type' },
          { value: 'Engineering Teams', label: 'Work Environment' },
        ]}
      />

      <CareerApplicationForm
        roleType="job"
        title="Apply for Job"
        subtitle="Complete this form with your latest profile details. Our hiring team will review and respond."
        successMessage="Job application submitted successfully. Our hiring team will connect with shortlisted candidates."
      />
    </>
  )
}

export default JobApplyPage