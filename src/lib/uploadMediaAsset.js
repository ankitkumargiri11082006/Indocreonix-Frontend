import { apiRequest } from './apiClient'

export async function uploadMediaAsset(file, title = '') {
  if (!file) return ''

  const formData = new FormData()
  formData.append('title', title || file.name)
  formData.append('file', file)

  const result = await apiRequest('/media', {
    method: 'POST',
    body: formData,
  })

  return result?.asset?.url || ''
}
