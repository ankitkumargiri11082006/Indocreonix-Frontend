import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

const initialForm = {
  type: 'internship',
  title: '',
  summary: '',
  location: 'Remote',
  mode: 'Hybrid',
  experience: '',
  order: 0,
  isActive: true,
}

function AdminOpportunitiesPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [error, setError] = useState('')

  async function loadItems() {
    try {
      const result = await apiRequest('/careers/opportunities')
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
      if (editingId) {
        await apiRequest(`/careers/opportunities/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
      } else {
        await apiRequest('/careers/opportunities', {
          method: 'POST',
          body: JSON.stringify(form),
        })
      }
      setForm(initialForm)
      setEditingId('')
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeItem(id) {
    try {
      await apiRequest(`/careers/opportunities/${id}`, { method: 'DELETE' })
      loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="admin-workbench">
      <article className="admin-card admin-workbench-form">
        <h3>{editingId ? 'Edit Opening' : 'Create Opening'}</h3>
        <form className="admin-form-grid" onSubmit={saveItem}>
          <label>
            Type
            <select className="admin-select" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
              <option value="internship">internship</option>
              <option value="job">job</option>
            </select>
          </label>
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          </label>
          <label className="admin-full-row">
            Summary
            <textarea rows="4" value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} required />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
          </label>
          <label>
            Work Mode
            <input value={form.mode} onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))} />
          </label>
          <label>
            Experience/Duration
            <input value={form.experience} onChange={(e) => setForm((prev) => ({ ...prev, experience: e.target.value }))} />
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
            <button type="submit" className="btn btn-primary">{editingId ? 'Update Opening' : 'Create Opening'}</button>
          </div>
        </form>
        {error ? <p className="admin-error">{error}</p> : null}
      </article>

      <article className="admin-card admin-workbench-list">
        <h3>Internship & Job Controls</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Mode</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.mode}</td>
                  <td>{item.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-action-group">
                      <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(item._id); setForm({ type: item.type, title: item.title, summary: item.summary, location: item.location || 'Remote', mode: item.mode || 'Hybrid', experience: item.experience || '', order: item.order || 0, isActive: item.isActive }) }}>Edit</button>
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

export default AdminOpportunitiesPage
