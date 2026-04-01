export const orderStatusOptions = ['new', 'qualified', 'proposal_shared', 'in_discussion', 'won', 'lost']

export function formatOrderFileSize(bytes) {
  if (!bytes || Number.isNaN(bytes)) return ''
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

export function formatOrderDateLabel(value) {
  if (!value) return '—'
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  } catch (error) {
    console.warn('Unable to format order date', error)
    return '—'
  }
}

export function getOrderStatusLabel(value) {
  if (!value) return 'Unknown'
  return value.replace(/_/g, ' ')
}
