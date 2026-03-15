import { useState } from 'react'

function detectLogoVariant(img) {
  const width = img.naturalWidth || 1
  const height = img.naturalHeight || 1
  const ratio = width / height

  if (ratio > 1.35) return 'wide'
  if (ratio < 0.8) return 'tall'

  const isSquareish = ratio >= 0.88 && ratio <= 1.12
  if (!isSquareish) return 'square'

  try {
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (!ctx) return 'square'

    ctx.clearRect(0, 0, size, size)
    ctx.drawImage(img, 0, 0, size, size)

    const getAlpha = (x, y) => ctx.getImageData(x, y, 1, 1).data[3]
    const corners = [
      getAlpha(2, 2),
      getAlpha(size - 3, 2),
      getAlpha(2, size - 3),
      getAlpha(size - 3, size - 3),
    ]

    const transparentCorners = corners.filter((alpha) => alpha < 18).length
    return transparentCorners >= 3 ? 'circle' : 'square'
  } catch {
    return 'square'
  }
}

function AdaptiveLogoImage({ src, alt, frameClassName, imageClassName, loading = 'lazy' }) {
  const [variant, setVariant] = useState('square')

  return (
    <div className={`${frameClassName} is-${variant}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={imageClassName}
        crossOrigin="anonymous"
        onLoad={(event) => {
          const nextVariant = detectLogoVariant(event.currentTarget)
          setVariant(nextVariant)
        }}
      />
    </div>
  )
}

export default AdaptiveLogoImage
