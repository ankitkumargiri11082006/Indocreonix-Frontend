import { useEffect, useState } from 'react'
import { apiBaseUrl, apiRequest } from '../../lib/apiClient'

function AdminMediaPage() {
  const [assets, setAssets] = useState([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')

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
            <a key={asset._id} href={asset.url} className="admin-media-item" target="_blank" rel="noreferrer">
              <img src={asset.url} alt={asset.title} />
              <p>{asset.title}</p>
            </a>
          ))}
        </div>
      </article>
    </div>
  )
}

export default AdminMediaPage
