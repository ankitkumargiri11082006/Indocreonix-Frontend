import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import CtaBanner from '../components/CtaBanner'
import AdaptiveLogoImage from '../components/AdaptiveLogoImage'
import { apiRequest } from '../lib/apiClient'

const PAGE_SIZE = 20

function ClientsPage() {
  const [clients, setClients] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function loadClients(nextPage = 1) {
    setLoading(true)
    setError('')
    try {
      const result = await apiRequest(`/clients/public?page=${nextPage}&limit=${PAGE_SIZE}`)
      if (nextPage === 1) {
        setClients(result.items || [])
      } else {
        setClients((prev) => [...prev, ...(result.items || [])])
      }
      setHasMore(result.hasMore)
      setPage(nextPage)
    } catch (err) {
      setError('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients(1)
    // eslint-disable-next-line
  }, [])

  function handleLoadMore() {
    if (!loading && hasMore) {
      loadClients(page + 1)
    }
  }

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
        {error && <article className="info-card error"><p>{error}</p></article>}
        <div className="clients-grid">
          {clients.length > 0
            ? clients.map((client) => (
                <article className="client-card client-card-minimal" key={client._id || client.name}>
                  <AdaptiveLogoImage
                    src={client.logo}
                    alt={`${client.name} logo`}
                    frameClassName="client-card-logo-wrap"
                    imageClassName="client-card-logo"
                  />
                  <h3>{client.name}</h3>
                </article>
              ))
            : !loading && (
                <article className="info-card">
                  <p>No clients have been published yet. Add clients from Admin panel.</p>
                </article>
              )}
          {loading &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <article className="client-card client-card-minimal skeleton" key={`skeleton-${i}`}>
                <div className="client-card-logo-wrap skeleton-box" />
                <div className="skeleton-text" style={{ width: '60%', height: 18, margin: '12px auto' }} />
              </article>
            ))}
        </div>
        {hasMore && !loading && (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <button className="btn" onClick={handleLoadMore} disabled={loading}>
              Load More
            </button>
          </div>
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
