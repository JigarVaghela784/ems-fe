const TO_RADIANS = Math.PI / 180

async function base64ToConvertImage(base64Image, width = 64, height = 64) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      const dataURL = canvas.toDataURL('image/png')
      resolve(dataURL)
    }
    img.onerror = function () {
      reject(new Error('Failed to load the image.'))
    }
    img.src = base64Image
  })
}

export async function canvasPreview(image, canvas, crop, scale = 1, rotate = 0, isFavicon, isLargeUpload) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'
  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY
  const rotateRads = rotate * TO_RADIANS
  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.rotate(rotateRads)
  ctx.scale(scale, scale)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight)
  let base64Image = canvas?.toDataURL('image/png')
  ctx.restore()

  if (isFavicon) {
    //TODO: favicon icon (64 * 64) code...
    base64Image = await base64ToConvertImage(base64Image)
  } else {
    const width = isLargeUpload ? 600 : 250
    const height = isLargeUpload ? 600 : 250
    base64Image = await base64ToConvertImage(base64Image, width, height)
  }

  return base64Image
}
