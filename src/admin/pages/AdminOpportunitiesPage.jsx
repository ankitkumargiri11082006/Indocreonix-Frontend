import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/apiClient'

const OTHER_OPTION_VALUE = '__other__'
const locationOptions = ['Remote', 'Delhi NCR', 'Bangalore', 'Mumbai', 'Hybrid']
const modeOptions = ['Onsite', 'Remote', 'Hybrid']

const initialForm = {
  type: 'internship',
  title: '',
  summary: '',
  location: 'Remote',
  locationOption: 'Remote',
  locationOther: '',
  mode: 'Hybrid',
  modeOption: 'Hybrid',
  modeOther: '',
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

  function resolveFieldValue(optionValue, otherValue, fallbackValue) {
    if (optionValue === OTHER_OPTION_VALUE) {
      return otherValue.trim()
    }

    return optionValue || fallbackValue || ''
  }

  function buildFormFromItem(item) {
    const currentLocation = item.location || 'Remote'
    const currentMode = item.mode || 'Hybrid'

    const isKnownLocation = locationOptions.includes(currentLocation)
    const isKnownMode = modeOptions.includes(currentMode)

    return {
      type: item.type,
      title: item.title,
      summary: item.summary,
      location: currentLocation,
      locationOption: isKnownLocation ? currentLocation : OTHER_OPTION_VALUE,
      locationOther: isKnownLocation ? '' : currentLocation,
      mode: currentMode,
      modeOption: isKnownMode ? currentMode : OTHER_OPTION_VALUE,
      modeOther: isKnownMode ? '' : currentMode,
      experience: item.experience || '',
      order: item.order || 0,
      isActive: item.isActive,
    }
  }

  async function saveItem(event) {
    event.preventDefault()
    setError('')

    try {
      const resolvedLocation = resolveFieldValue(form.locationOption, form.locationOther, form.location)
      const resolvedMode = resolveFieldValue(form.modeOption, form.modeOther, form.mode)

      if (!resolvedLocation) {
        setError('Please select location or provide a custom location')
        return
      }

      if (!resolvedMode) {
        setError('Please select work mode or provide a custom mode')
        return
      }

      const payload = {
        ...form,
        location: resolvedLocation,
        mode: resolvedMode,
      }

      delete payload.locationOption
      delete payload.locationOther
      delete payload.modeOption
      delete payload.modeOther

      if (editingId) {
        await apiRequest(`/careers/opportunities/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiRequest('/careers/opportunities', {
          method: 'POST',
          body: JSON.stringify(payload),
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
            <select
              className="admin-select"
              value={form.locationOption}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  locationOption: e.target.value,
                  locationOther: e.target.value === OTHER_OPTION_VALUE ? prev.locationOther : '',
                }))
              }
            >
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value={OTHER_OPTION_VALUE}>Other (Please specify)</option>
            </select>
          </label>
          {form.locationOption === OTHER_OPTION_VALUE ? (
            <label>
              Custom Location
              <input
                value={form.locationOther}
                onChange={(e) => setForm((prev) => ({ ...prev, locationOther: e.target.value }))}
                placeholder="Enter custom location"
                required
              />
            </label>
          ) : null}
          <label>
            Work Mode
            <select
              className="admin-select"
              value={form.modeOption}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  modeOption: e.target.value,
                  modeOther: e.target.value === OTHER_OPTION_VALUE ? prev.modeOther : '',
                }))
              }
            >
              {modeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value={OTHER_OPTION_VALUE}>Other (Please specify)</option>
            </select>
          </label>
          {form.modeOption === OTHER_OPTION_VALUE ? (
            <label>
              Custom Work Mode
              <input
                value={form.modeOther}
                onChange={(e) => setForm((prev) => ({ ...prev, modeOther: e.target.value }))}
                placeholder="Enter custom work mode"
                required
              />
            </label>
          ) : null}
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
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingId(item._id)
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

export default AdminOpportunitiesPage
