import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'
import { uploadMediaAsset } from '../../lib/uploadMediaAsset'

const initialForm = {
  title: '',
  description: '',
  image: '',
  order: 0,
  isActive: true,
}

function AdminServicesPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')

  async function loadItems() {
    try {
      const result = await apiRequest('/services')
      setItems(result.items || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function saveItem(event) {
    event.preventDefault()
    setError('')

    try {
      const payload = { ...form }

      if (imageFile) {
        setIsUploading(true)
        const uploadedUrl = await uploadMediaAsset(imageFile, form.title)
        payload.image = uploadedUrl
      }

      if (editingId) {
        await apiRequest(`/services/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest('/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      setForm(initialForm)
      setImageFile(null)
      setEditingId('')
      loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  async function removeItem(id) {
    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-workbench">
      <article className="admin-card admin-workbench-form">
        <h3>{editingId ? 'Edit Service' : 'Add Service'}</h3>
        <p className="admin-form-intro">Add a service with a clean icon/image and clear business-focused description.</p>
        <form className="admin-form-grid" onSubmit={saveItem}>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          </label>
          <label className="admin-upload-field">
            Upload Image
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <small>Recommended: square PNG/WebP with transparent background.</small>
          </label>
          {form.image || imageFile ? (
            <div className="admin-upload-preview admin-full-row">
              <p>Preview</p>
              <img src={imageFile ? URL.createObjectURL(imageFile) : form.image} alt="Service preview" />
            </div>
          ) : null}
          <label className="admin-full-row">
            Description
            <textarea rows="4" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} required />
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
            <button type="submit" className="btn btn-primary" disabled={isUploading}>{isUploading ? 'Uploading...' : editingId ? 'Update Service' : 'Create Service'}</button>
          </div>
        </form>
        {error ? <p className="admin-error">{error}</p> : null}
      </article>

      <article className="admin-card admin-workbench-list">
        <h3>Service Catalog</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Order</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.order}</td>
                  <td>{item.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-action-group">
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(item._id); setImageFile(null); setForm({ title: item.title, description: item.description, image: item.image || '', order: item.order || 0, isActive: item.isActive }) }}>Edit</button>
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

export default AdminServicesPage
