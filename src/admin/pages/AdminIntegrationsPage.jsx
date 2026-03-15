import { useState } from 'react'

function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState({
    cloudinary: true,
    mongodb: true,
    webhookUrl: '',
    slackChannel: '',
  })

  return (
    <article className="admin-card wide">
      <h3>Integrations</h3>
      <p>Configure channels and automation targets for your operations stack.</p>

      <div className="admin-form-grid">
        <label>
          Cloudinary
          <input
            type="text"
            value={integrations.cloudinary ? 'Connected' : 'Disconnected'}
            readOnly
          />
        </label>

        <label>
          MongoDB
          <input type="text" value={integrations.mongodb ? 'Connected' : 'Disconnected'} readOnly />
        </label>

        <label>
          Webhook URL
          <input
            value={integrations.webhookUrl}
            onChange={(e) => setIntegrations((prev) => ({ ...prev, webhookUrl: e.target.value }))}
            placeholder="https://hooks.example.com/..."
          />
        </label>

        <label>
          Slack Channel
          <input
            value={integrations.slackChannel}
            onChange={(e) => setIntegrations((prev) => ({ ...prev, slackChannel: e.target.value }))}
            placeholder="#sales-alerts"
          />
        </label>
      </div>

      <button type="button" className="btn btn-primary">Save Integrations</button>
    </article>
  )
}

export default AdminIntegrationsPage
