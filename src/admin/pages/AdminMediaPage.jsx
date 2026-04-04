import { useEffect, useState } from 'react'
import { apiBaseUrl, apiRequest } from '../../lib/apiClient'

function AdminMediaPage() {
  const [assets, setAssets] = useState([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [copiedAssetId, setCopiedAssetId] = useState('')

  async function loadAssets() {
    try {
      const result = await apiRequest('/media')
      setAssets(result.assets || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  async function uploadAsset(event) {
    event.preventDefault()
    setError('')

    if (!file) {
      setError('Please choose a file')
      return
    }

    const token = localStorage.getItem('indocx_token')
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    try {
      const response = await fetch(`${apiBaseUrl()}/media`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Upload failed')
      }
      setTitle('')
      setFile(null)
      loadAssets()
    } catch (err) {
      setError(err.message)
    }
  }

  async function copyAssetUrl(assetId, assetUrl) {
    try {
      await navigator.clipboard.writeText(assetUrl)
      setCopiedAssetId(assetId)
      setTimeout(() => setCopiedAssetId(''), 1600)
    } catch {
      setError('Unable to copy URL. Please copy manually.')
    }
  }

  async function deleteAsset(assetId) {
    setError('')

    try {
      await apiRequest(`/media/${assetId}`, { method: 'DELETE' })
      setAssets((prev) => prev.filter((asset) => asset._id !== assetId))
      if (copiedAssetId === assetId) {
        setCopiedAssetId('')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-page-grid">
      <article className="admin-card">
        <h3>Upload Asset</h3>
        <form className="admin-form-grid" onSubmit={uploadAsset}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Homepage Hero" />
          </label>
          <label>
            File
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          <button type="submit" className="btn btn-primary">Upload to Cloudinary</button>
        </form>
        {error ? <p className="admin-error">{error}</p> : null}
      </article>

      <article className="admin-card wide">
        <h3>Media Library</h3>
        <div className="admin-media-grid">
          {assets.map((asset) => (
            <div key={asset._id} className="admin-media-item">
              <img src={asset.url} alt={asset.title} />
              <p>{asset.title}</p>
              <div className="admin-media-item-actions">
                <a href={asset.url} className="btn btn-secondary" target="_blank" rel="noreferrer">
                  Open
                </a>
                <button type="button" className="btn btn-secondary" onClick={() => copyAssetUrl(asset._id, asset.url)}>
                  {copiedAssetId === asset._id ? 'Copied' : 'Copy URL'}
                </button>
                <button
                  type="button"
                  className="btn btn-danger admin-media-delete"
                  onClick={() => deleteAsset(asset._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

export default AdminMediaPage
