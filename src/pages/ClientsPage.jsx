import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import AdaptiveLogoImage from '../components/AdaptiveLogoImage'
import { apiRequest } from '../lib/apiClient'

function ClientsPage() {
  const [clientsServed, setClientsServed] = useState([])

  useEffect(() => {
    apiRequest('/clients/public')
      .then((result) => setClientsServed(result.items || []))
      .catch(() => setClientsServed([]))
  }, [])

  return (
    <>
      <PageHero
        eyebrow="Our Clients"
        title="Organizations Associated with Indocreonix"
        subtitle="A minimal client showcase using logo and name representation only."
        theme="theme-d"
        metrics={[
          { value: 'Logo + Name', label: 'Display Format' },
          { value: 'Professional', label: 'Presentation Standard' },
          { value: 'B2B Partnerships', label: 'Association Scope' },
        ]}
      />

      <section className="content-section container">
        <h2>Client Portfolio</h2>
        {clientsServed.length > 0 ? (
          <div className="clients-grid">
            {clientsServed.map((client) => (
              <article className="client-card client-card-minimal" key={client._id || client.name}>
                <AdaptiveLogoImage
                  src={client.logo}
                  alt={`${client.name} logo`}
                  frameClassName="client-card-logo-wrap"
                  imageClassName="client-card-logo"
                />
                <h3>{client.name}</h3>
              </article>
            ))}
          </div>
        ) : (
          <article className="info-card">
            <p>No clients have been published yet. Add clients from Admin panel.</p>
          </article>
        )}
      </section>

      <CtaBanner
        title="Need a technology partner for your next build?"
        description="Share your scope and timeline to receive a practical implementation proposal from Indocreonix."
        primaryLabel="Submit Project Request"
        primaryTo="/request-quote?source=clients-page"
      />
    </>
  )
}

export default ClientsPage
