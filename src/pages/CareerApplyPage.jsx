import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import CareerApplicationForm from '../components/CareerApplicationForm'
import { getPortalUser } from './portalAuthShared'
import PortalAccessPage from './PortalAccessPage'

const roleConfigMap = {
  internship: {
    heroTitle: 'Internship Application',
    heroSubtitle: 'Apply for internship opportunities at Indocreonix and gain practical experience on real projects.',
    metrics: [
      { value: 'Students', label: 'Eligible Candidates' },
      { value: 'Mentored Work', label: 'Learning Model' },
      { value: 'Project-Based', label: 'Experience Type' },
    ],
    formTitle: 'Apply for Internship',
    formSubtitle: 'Complete this form with accurate details. Our team will review and contact shortlisted candidates.',
    successMessage: 'Internship application submitted successfully. Our team will review and connect with you.',
  },
  job: {
    heroTitle: 'Job Application',
    heroSubtitle: 'Apply for full-time opportunities at Indocreonix and contribute to client and internal product delivery.',
    metrics: [
      { value: 'Professionals', label: 'Target Candidates' },
      { value: 'Full-Time Roles', label: 'Opportunity Type' },
      { value: 'Engineering Teams', label: 'Work Environment' },
    ],
    formTitle: 'Apply for Job',
    formSubtitle: 'Complete this form with your latest profile details. Our hiring team will review and respond.',
    successMessage: 'Job application submitted successfully. Our hiring team will connect with shortlisted candidates.',
  },
}

function CareerApplyPage() {
  const { roleType } = useParams()
  const config = roleConfigMap[roleType]
  const [portalUser, setPortalUser] = useState(() => getPortalUser())

  if (!config) {
    return <Navigate to="/careers" replace />
  }

  if (!portalUser) {
    return (
      <>
        <PageHero
          eyebrow="Careers"
          title={`${config.heroTitle} Access`}
          subtitle="Sign in or sign up first to continue your application. Once authenticated, your application process will continue normally."
          theme="theme-c"
          metrics={config.metrics}
        />

        <PortalAccessPage
          embedded={true}
          nextPath={`/careers/apply/${roleType}`}
          onAuthenticated={(user) => setPortalUser(user)}
        />
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
        theme="theme-c"
        metrics={config.metrics}
      />

      <CareerApplicationForm
        roleType={roleType}
        title={config.formTitle}
        subtitle={config.formSubtitle}
        successMessage={config.successMessage}
      />
    </>
  )
}

export default CareerApplyPage
