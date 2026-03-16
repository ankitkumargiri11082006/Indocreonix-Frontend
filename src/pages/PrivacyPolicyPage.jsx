import PageHero from '../components/PageHero'

function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="This Privacy Policy explains how Indocreonix collects, uses, stores, and protects personal data."
        theme="theme-a"
        metrics={[
          { value: 'Strict', label: 'Data Handling Standard' },
          { value: 'Recruitment + Client', label: 'Primary Use Cases' },
          { value: 'Indocreonix', label: 'Data Controller' },
        ]}
      />

      <section className="content-section container legal-page">
        <article className="info-card legal-section">
          <h3>1. Policy Scope</h3>
          <p>
            This policy applies to all personal data collected by Indocreonix through website forms, contact requests, project
            inquiry forms, and career applications for internships and jobs.
          </p>
          <p>
            This policy covers online and form-based interactions managed by Indocreonix and applies to prospective clients,
            existing clients, job applicants, internship applicants, vendors, and other data subjects who share personal
            information through official Indocreonix channels.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>2. Data Collected</h3>
          <p>
            Indocreonix may collect name, email, phone number, city, qualification, skills, work/internship experience,
            portfolio links, CV documents, and communication content that you voluntarily submit.
          </p>
          <p>
            We may also collect operational metadata such as timestamps, request identifiers, device/browser context, and basic
            interaction logs used for security review, fraud prevention, troubleshooting, and service quality assurance.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>3. Strict Purpose Limitation</h3>
          <p>
            Indocreonix uses personal data strictly for business communication, project scoping, candidate evaluation,
            recruitment workflow, security logging, and legal compliance. Data is not sold to third parties.
          </p>
          <p>
            Personal data is processed only for clear, legitimate, and limited business purposes. Any use outside those purposes
            requires a valid legal basis, operational necessity, or explicit consent from the data subject where applicable.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>4. Security and Access Control</h3>
          <p>
            Indocreonix applies strict technical and administrative controls, including restricted administrative access,
            authentication checks, audit logging, and secure storage providers. Unauthorized internal or external access is
            prohibited and investigated.
          </p>
          <p>
            Access to personal data is limited to authorized personnel with role-based need. Security events may trigger account
            restrictions, forensic analysis, internal escalation, and, where required, regulatory or legal reporting.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>5. Candidate Data (Internship and Job Applications)</h3>
          <p>
            Job and internship applicants must explicitly consent before submission. Indocreonix processes candidate data only for
            hiring review, communication, and status tracking. Submission without consent is not accepted.
          </p>
          <p>
            Candidate profile details, uploaded CVs, and application notes are used only for recruitment operations, shortlist
            decisions, interview management, and official hiring communication. Indocreonix may reject applications that include
            false, misleading, or unauthorized third-party personal data.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>6. Data Sharing and Processors</h3>
          <p>
            Indocreonix may use trusted service providers (for hosting, storage, communication, analytics, or infrastructure)
            strictly for operational support under confidentiality and security obligations. Data is never sold for commercial
            resale or uncontrolled marketing use.
          </p>
          <p>
            Where data sharing is required by law, valid legal process, or enforcement request, Indocreonix may disclose only the
            minimum necessary information to comply with legal obligations and protect rights, safety, and service security.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>7. Retention and Deletion</h3>
          <p>
            Indocreonix retains personal data only for as long as needed for operational and legal purposes. Data may be deleted
            or anonymized when no longer necessary, subject to legal record-keeping obligations.
          </p>
          <p>
            Retention periods may vary by purpose, legal obligations, dispute handling, and audit requirements. When practical,
            Indocreonix applies deletion, archival controls, or anonymization to reduce privacy risk while maintaining compliance.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>8. Your Rights</h3>
          <p>
            You may request access, correction, or deletion of your personal data held by Indocreonix, subject to verification and
            applicable legal requirements.
          </p>
          <p>
            Depending on jurisdiction and applicable law, you may also request restriction of processing, object to specific data
            uses, or request data portability. Indocreonix may require reasonable identity verification before acting on requests.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>9. Cookies, Tracking, and Communications</h3>
          <p>
            Indocreonix may use essential technical signals and limited interaction tracking to maintain security, understand
            website usage trends, and improve service quality. We avoid unnecessary personal profiling and do not sell behavioral
            data.
          </p>
          <p>
            Business communications sent by Indocreonix are limited to relevant service updates, inquiry responses, hiring
            communication, and compliance-related notices connected to your interaction.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>10. Cross-Border Processing and Legal Compliance</h3>
          <p>
            Where technical infrastructure or authorized processors operate across regions, Indocreonix applies reasonable
            safeguards for secure transfer and lawful processing of personal data consistent with applicable requirements.
          </p>
          <p>
            Indocreonix continuously reviews policy and controls to align with evolving legal obligations, security risks, and
            responsible data governance expectations.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>11. Policy Updates</h3>
          <p>
            Indocreonix may revise this Privacy Policy to reflect legal, technical, or operational changes. Updated versions are
            effective when published on the website.
          </p>
          <p>
            Continued use of Indocreonix services after updates indicates acceptance of the revised policy. Material changes may
            be highlighted on the website to support transparent communication.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>12. Contact for Privacy Requests</h3>
          <p>
            For any privacy concern, correction request, data access request, or deletion request related to Indocreonix personal
            data processing, use the official contact details available on the Indocreonix website and include sufficient details
            for secure identity verification and request handling.
          </p>
        </article>
      </section>
    </>
  )
}

export default PrivacyPolicyPage
