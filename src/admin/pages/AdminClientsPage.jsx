import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'
import { uploadMediaAsset } from '../../lib/uploadMediaAsset'

const initialForm = {
  name: '',
  logo: '',
  website: '',
  description: '',
  order: 0,
  isActive: true,
}

function AdminClientsPage() {

  const PAGE_SIZE = 30
  const [items, setItems] = useState([])
  const [mediaAssets, setMediaAssets] = useState([])
  const [form, setForm] = useState(initialForm)
  const [logoSource, setLogoSource] = useState('upload')
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [copiedAssetUrl, setCopiedAssetUrl] = useState('')
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  async function loadItems(nextPage = 1) {
    setLoading(true)
    setError('')
    try {
      const result = await apiRequest(`/clients?page=${nextPage}&limit=${PAGE_SIZE}`)
      if (nextPage === 1) {
        setItems(result.items || [])
      } else {
        setItems((prev) => [...prev, ...(result.items || [])])
      }
      setHasMore(result.hasMore)
      setPage(nextPage)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadMediaAssets() {
    try {
      const result = await apiRequest('/media')
      setMediaAssets(result.assets || [])
    } catch {
      setMediaAssets([])
    }
  }


  useEffect(() => {
    loadItems(1)
    loadMediaAssets()
    // eslint-disable-next-line
  }, [])

  function handleLoadMore() {
    if (!loading && hasMore) {
      loadItems(page + 1)
    }
  }

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl('')
      return undefined
    }

    const objectUrl = URL.createObjectURL(logoFile)
    setLogoPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [logoFile])

  async function copyAssetUrl(url) {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedAssetUrl(url)
      setTimeout(() => setCopiedAssetUrl(''), 1600)
    } catch {
      setError('Unable to copy URL. Please copy manually.')
    }
  }

  async function saveItem(event) {
    event.preventDefault()
    setError('')

    try {
      const payload = { ...form }

      if (logoSource === 'url') {
        payload.logo = form.logo.trim()
      }

      if (logoSource === 'upload' && logoFile) {
        setIsUploading(true)
        const uploadedUrl = await uploadMediaAsset(logoFile, form.name)
        payload.logo = uploadedUrl
      }

      if (editingId) {
        await apiRequest(`/clients/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest('/clients', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      setForm(initialForm)
      setLogoSource('upload')
      setLogoFile(null)
      setEditingId('')
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const previewUrl = logoSource === 'upload' ? logoPreviewUrl || form.logo : form.logo

  async function removeItem(id) {
    try {
      await apiRequest(`/clients/${id}`, { method: 'DELETE' })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-workbench">
      <article className="admin-card admin-workbench-form">
        <h3>{editingId ? 'Edit Client' : 'Add Client'}</h3>
        <p className="admin-form-intro">Create polished client entries with logo, website, and short profile details.</p>
        <form className="admin-form-grid" onSubmit={saveItem}>
          <label>
            Client Name
            <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
          </label>
          <label>
            Website
            <input value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} />
          </label>

          <label>
            Logo Source
            <select
              className="admin-select"
              value={logoSource}
              onChange={(e) => {
                const nextSource = e.target.value
                setLogoSource(nextSource)
                if (nextSource === 'url') {
                  setLogoFile(null)
                }
              }}
            >
              <option value="upload">Upload New File</option>
              <option value="url">Use Image URL</option>
            </select>
          </label>

          {logoSource === 'upload' ? (
            <label className="admin-upload-field admin-full-row">
              Upload Client Logo
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
              <small>Best results: clean logo with transparent background.</small>
            </label>
          ) : (
            <label className="admin-full-row">
              Client Logo URL
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
                placeholder="https://..."
              />
            </label>
          )}

          {previewUrl ? (
            <div className="admin-upload-preview admin-full-row">
              <p>Preview</p>
              <img src={previewUrl} alt="Client logo preview" />
            </div>
          ) : null}

          {mediaAssets.length ? (
            <div className="admin-media-reuse admin-full-row">
              <p>Reuse from Media Library</p>
              <div className="admin-media-reuse-grid">
                {mediaAssets.slice(0, 2).map((asset) => (
                  <div key={asset._id} className="admin-media-reuse-item">
                    <img src={asset.url} alt={asset.title || 'Media asset'} />
                    <div className="admin-media-reuse-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setLogoSource('url')
                          setLogoFile(null)
                          setForm((prev) => ({ ...prev, logo: asset.url }))
                        }}
                      >
                        Use URL
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => copyAssetUrl(asset.url)}>
                        {copiedAssetUrl === asset.url ? 'Copied' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <label className="admin-full-row">
            Description
            <textarea rows="3" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          </label>
          <label>
            Display Order
            <input type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))} />
          </label>
          <label>
            Active
            <select className="admin-select" value={String(form.isActive)} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === 'true' }))}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <div className="admin-form-actions admin-full-row">
            <button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : editingId ? 'Update Client' : 'Create Client'}</button>
          </div>
        </form>
        {error ? <p className="admin-error">{error}</p> : null}
      </article>

      <article className="admin-card admin-workbench-list">
        <h3>Clients</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Website</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.website || '-'}</td>
                  <td>{item.order}</td>
                  <td>{item.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-action-group">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingId(item._id)
                          setLogoFile(null)
                          setLogoSource(item.logo ? 'url' : 'upload')
                          setForm({
                            name: item.name,
                            logo: item.logo || '',
                            website: item.website || '',
                            description: item.description || '',
                            order: item.order || 0,
                            isActive: item.isActive,
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => removeItem(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading &&
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr className="skeleton" key={`skeleton-${i}`}>
                    <td colSpan={5}>
                      <div style={{ height: 24, background: '#eee', borderRadius: 4, margin: '6px 0' }} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {hasMore && !loading && (
          <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <button className="btn" onClick={handleLoadMore} disabled={loading}>
              Load More
            </button>
          </div>
        )}
      </article>
    </div>
  )
}

export default AdminClientsPage
