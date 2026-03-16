import PageHero from '../components/PageHero'

function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        subtitle="These Terms and Conditions govern all use of Indocreonix services, website access, and candidate applications."
        theme="theme-b"
        metrics={[
          { value: 'Binding', label: 'Agreement Type' },
          { value: 'Strict', label: 'Data & Security Rules' },
          { value: 'Indocreonix', label: 'Brand & Service Owner' },
        ]}
      />

      <section className="content-section container legal-page">
        <article className="info-card legal-section">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By using the Indocreonix website, submitting inquiries, requesting project quotes, or applying for internships/jobs,
            you agree to these Terms and Conditions. If you do not agree, you must not use Indocreonix services or submit data.
          </p>
          <p>
            These Terms apply to all visitors, clients, applicants, vendors, and any party interacting with Indocreonix digital
            properties, communication channels, and service workflows. You confirm that you are legally competent to accept this
            agreement and that all information submitted to Indocreonix is accurate and lawful.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>2. Service Scope and Client Responsibility</h3>
          <p>
            Indocreonix provides software, web, mobile, cloud, and related technical services. Clients are responsible for
            submitting accurate requirements, legal content, and lawful instructions. Indocreonix may reject any request that is
            unlawful, misleading, abusive, or non-compliant with applicable regulations.
          </p>
          <p>
            Project timelines, milestones, and deliverables are finalized through written communication or signed commercial
            agreements. Clients must provide approvals, credentials, and dependencies on time; delays in client-side approvals or
            unavailable third-party resources may impact delivery schedules without creating default liability for Indocreonix.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>3. Intellectual Property</h3>
          <p>
            Unless otherwise defined in a signed contract, all Indocreonix brand assets, website content, frameworks,
            methodologies, and pre-existing technical components remain property of Indocreonix. Third-party licenses remain
            subject to their original terms.
          </p>
          <p>
            Client-provided materials remain the property of the client or their licensors. The client represents that they have
            all required rights to share such materials with Indocreonix. Indocreonix may suspend work if ownership, licensing,
            or lawful usage of supplied assets is unclear or disputed.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>4. Strict Data Security Obligations</h3>
          <p>
            Any user interacting with Indocreonix systems must not attempt unauthorized access, data scraping, credential abuse,
            malware distribution, reverse engineering, or interference with service availability. Violations can result in access
            termination, legal action, and reporting to authorities.
          </p>
          <p>
            Any detected suspicious activity may be logged, investigated, and preserved for legal enforcement. Indocreonix may
            immediately block IPs, user accounts, requests, uploads, or integrations considered malicious, abusive, or harmful to
            platform integrity, confidentiality, and operational continuity.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>5. Candidate Applications (Jobs and Internships)</h3>
          <p>
            All applicants to Indocreonix must provide true and complete information. CVs, contact details, and form entries are
            reviewed for recruitment evaluation only. Indocreonix may reject or remove applications that contain false,
            manipulated, or fraudulent information.
          </p>
          <p>
            For internship and job applications, acceptance of Indocreonix legal terms and privacy policy is mandatory.
            Applications submitted without explicit consent are invalid. Indocreonix may verify candidate-provided information and
            disqualify applications where data authenticity, ownership, or eligibility cannot be validated.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>6. Payments, Commercial Terms, and Suspension Rights</h3>
          <p>
            Commercial engagements, invoices, taxes, and payment milestones are governed by the applicable proposal or contract.
            In case of delayed payments, Indocreonix may pause project execution, revoke non-final delivery access, or defer
            support and maintenance activities until dues are settled.
          </p>
          <p>
            Any custom scope additions, integration changes, or post-approval modifications may require revised timelines and
            additional commercial approval. Work beyond agreed scope is not automatically included unless documented by both
            parties.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>7. Warranties and Limitation of Liability</h3>
          <p>
            Indocreonix provides services using commercially reasonable professional standards. Except where expressly committed in
            writing, services, website content, and informational material are provided on an "as available" basis without
            implied guarantees of uninterrupted operation, universal compatibility, or specific business outcomes.
          </p>
          <p>
            To the maximum extent permitted by law, Indocreonix is not liable for indirect, incidental, consequential, punitive,
            reputational, or data-loss damages arising from third-party outages, client misconfigurations, external platform
            changes, or unauthorized acts by users beyond Indocreonix control.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>8. Indemnity and Legal Compliance</h3>
          <p>
            You agree to defend and indemnify Indocreonix against claims, losses, penalties, and costs arising from your breach
            of these Terms, unlawful instructions, misuse of services, or violation of third-party rights, including intellectual
            property, privacy, and regulatory rights.
          </p>
          <p>
            You are solely responsible for ensuring that your use of Indocreonix services complies with applicable laws,
            regulations, industry standards, and internal governance obligations relevant to your organization and jurisdiction.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>9. Termination and Restriction of Access</h3>
          <p>
            Indocreonix may suspend or terminate access to website features, application workflows, or service interactions where
            there is legal risk, policy violation, attempted abuse, non-payment, or behavior harmful to operational security.
          </p>
          <p>
            Termination does not waive accrued rights, dues, or legal remedies available to Indocreonix under contract or law.
            Clauses related to confidentiality, liability, indemnity, and legal enforcement continue to survive termination.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>10. Updates, Governing Framework, and Notices</h3>
          <p>
            Indocreonix may update, suspend, or modify services, website content, and legal terms when required for operational,
            legal, or security reasons. Continued use after updates means acceptance of revised terms.
          </p>
          <p>
            In case of conflict between these website terms and a signed client agreement, the signed agreement controls for that
            engagement scope. Official legal notices should be sent through published Indocreonix business communication channels.
          </p>
        </article>

        <article className="info-card legal-section">
          <h3>11. Contact for Legal Notices</h3>
          <p>
            For legal concerns about Indocreonix terms, data handling, or policy interpretation, contact us through the official
            contact details listed on the Indocreonix website.
          </p>
          <p>
            To help faster resolution, include your full name, organization (if any), related project/application reference,
            contact information, and a clear description of the legal request or compliance concern.
          </p>
        </article>
      </section>
    </>
  )
}

export default TermsAndConditionsPage
