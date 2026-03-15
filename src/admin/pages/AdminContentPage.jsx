import { useState } from 'react'

function AdminContentPage() {
  const [draft, setDraft] = useState({
    page: 'home',
    title: 'Future-ready digital solutions',
    subtitle: 'Customize this section for all content blocks.',
  })

  return (
    <article className="admin-card wide">
      <h3>Content Studio</h3>
      <p>Create and maintain copy for landing pages, service sections and campaign blocks.</p>
      <div className="admin-form-grid">
        <label>
          Page
          <select
            className="admin-select"
            value={draft.page}
            onChange={(e) => setDraft((prev) => ({ ...prev, page: e.target.value }))}
          >
            <option value="home">Home</option>
            <option value="services">Services</option>
            <option value="solutions">Solutions</option>
            <option value="products">Products</option>
            <option value="about">About</option>
          </select>
        </label>

        <label>
          Headline
          <input
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          />
        </label>

        <label className="admin-full-row">
          Subtitle
          <textarea
            rows="4"
            value={draft.subtitle}
            onChange={(e) => setDraft((prev) => ({ ...prev, subtitle: e.target.value }))}
          />
        </label>
      </div>
      <button type="button" className="btn btn-primary">Save Draft</button>
    </article>
  )
}

export default AdminContentPage
