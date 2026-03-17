import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'
import { uploadMediaAsset } from '../../lib/uploadMediaAsset'

const OTHER_OPTION_VALUE = '__other__'
const projectCategoryOptions = ['General', 'Website', 'Web Application', 'Android Application', 'iOS Application', 'Custom Software']

const initialForm = {
  title: '',
  summary: '',
  details: '',
  developerName: '',
  logo: '',
  website: '',
  category: 'General',
  categoryOption: 'General',
  categoryOther: '',
  tags: '',
  featured: false,
  order: 0,
  isActive: true,
}

function AdminProjectsPage() {
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

  async function loadItems() {
    try {
      const result = await apiRequest('/projects')
      setItems(result.items || [])
    } catch (err) {
      setError(err.message)
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
    loadItems()
    loadMediaAssets()
  }, [])

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

  function resolveCategoryValue(currentForm) {
    if (currentForm.categoryOption === OTHER_OPTION_VALUE) {
      return currentForm.categoryOther.trim()
    }

    return currentForm.categoryOption || currentForm.category || 'General'
  }

  function buildFormFromItem(item) {
    const currentCategory = item.category || 'General'
    const isKnownCategory = projectCategoryOptions.includes(currentCategory)

    return {
      title: item.title,
      summary: item.summary,
      details: item.details || '',
      developerName: item.developerName || '',
      logo: item.logo || '',
      website: item.website || '',
      category: currentCategory,
      categoryOption: isKnownCategory ? currentCategory : OTHER_OPTION_VALUE,
      categoryOther: isKnownCategory ? '' : currentCategory,
      tags: (item.tags || []).join(', '),
      featured: item.featured || false,
      order: item.order || 0,
      isActive: item.isActive,
    }
  }

  async function saveItem(event) {
    event.preventDefault()
    setError('')

    try {
      const resolvedCategory = resolveCategoryValue(form)
      if (!resolvedCategory) {
        setError('Please select a category or provide a custom category')
        return
      }

      const payload = {
        ...form,
        category: resolvedCategory,
        tags: form.tags,
      }

      delete payload.categoryOption
      delete payload.categoryOther

      if (logoSource === 'url') {
        payload.logo = form.logo.trim()
      }

      if (logoSource === 'upload' && logoFile) {
        setIsUploading(true)
        const uploadedUrl = await uploadMediaAsset(logoFile, form.title)
        payload.logo = uploadedUrl
      }

      if (editingId) {
        await apiRequest(`/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest('/projects', {
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
      await apiRequest(`/projects/${id}`, { method: 'DELETE' })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-workbench">
      <article className="admin-card admin-workbench-form">
        <h3>{editingId ? 'Edit Project' : 'Add Project'}</h3>
        <p className="admin-form-intro">Build project showcases with richer summaries, tags, and strong visual branding.</p>
        <form className="admin-form-grid" onSubmit={saveItem}>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          </label>
          <label>
            Category
            <select
              className="admin-select"
              value={form.categoryOption}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  categoryOption: e.target.value,
                  categoryOther: e.target.value === OTHER_OPTION_VALUE ? prev.categoryOther : '',
                }))
              }
            >
              {projectCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value={OTHER_OPTION_VALUE}>Other (Please specify)</option>
            </select>
          </label>
          {form.categoryOption === OTHER_OPTION_VALUE ? (
            <label>
              Custom Category
              <input
                value={form.categoryOther}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryOther: e.target.value }))}
                placeholder="Enter custom project category"
                required
              />
            </label>
          ) : null}
          <label className="admin-full-row">
            Summary
            <textarea rows="3" value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} required />
          </label>
          <label className="admin-full-row">
            Details
            <textarea rows="5" value={form.details} onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))} />
          </label>
          <label>
            Developer Credit Name
            <input
              value={form.developerName}
              onChange={(e) => setForm((prev) => ({ ...prev, developerName: e.target.value }))}
              placeholder="Example: Ankit Singh"
            />
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
            <label className="admin-upload-field">
              Upload Project Logo
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
              <small>Use high-quality image/logo for best front-page visibility.</small>
            </label>
          ) : (
            <label>
              Project Logo URL
              <input
                type="url"
                value={form.logo}
                onChange={(e) => setForm((prev) => ({ ...prev, logo: e.target.value }))}
                placeholder="https://..."
              />
            </label>
          )}

          {previewUrl ? (
            <div className="admin-upload-preview">
              <p>Preview</p>
              <img src={previewUrl} alt="Project logo preview" />
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

          <label>
            Website URL
            <input value={form.website} onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))} />
          </label>
          <label>
            Tags (comma separated)
            <input value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} />
          </label>
          <label>
            Display Order
            <input type="number" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) }))} />
          </label>
          <label>
            Featured
            <select className="admin-select" value={String(form.featured)} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.value === 'true' }))}>
              <option value="false">false</option>
              <option value="true">true</option>
            </select>
          </label>
          <label>
            Active
            <select className="admin-select" value={String(form.isActive)} onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === 'true' }))}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <div className="admin-form-actions admin-full-row">
            <button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : editingId ? 'Update Project' : 'Create Project'}</button>
          </div>
        </form>
        {error ? <p className="admin-error">{error}</p> : null}
      </article>

      <article className="admin-card admin-workbench-list">
        <h3>Projects</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Developer</th>
                <th>Featured</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.developerName || '-'}</td>
                  <td>{item.featured ? 'Yes' : 'No'}</td>
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
                          setForm(buildFormFromItem(item))
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => removeItem(item._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  )
}

export default AdminProjectsPage
