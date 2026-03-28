function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        reject(new Error("Invalid image data."));
        return;
      }

      const image = new Image();
      image.onerror = () => reject(new Error("Could not process image."));
      image.onload = () => resolve(image);
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not export compressed image."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not encode image."));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("Invalid encoded image data."));
        return;
      }
      resolve(result);
    };
    reader.readAsDataURL(blob);
  });
}

export async function prepareAvatarDataUrl(file, options = {}) {
  const {
    maxWidth = 320,
    maxHeight = 320,
    startQuality = 0.82,
    minQuality = 0.45,
    maxBytes = 70 * 1024,
  } = options;

  const image = await loadImageFromFile(file);
  const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Image editor is not available in this browser.");
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  let quality = startQuality;
  let bestBlob = await canvasToBlob(canvas, quality);

  while (bestBlob.size > maxBytes && quality > minQuality) {
    quality = Math.max(minQuality, Number((quality - 0.08).toFixed(2)));
    bestBlob = await canvasToBlob(canvas, quality);
    if (quality <= minQuality) break;
  }

  return blobToDataUrl(bestBlob);
}
