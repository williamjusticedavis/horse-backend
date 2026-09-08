import multer from 'multer'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Always buffer in memory — the handler resizes/compresses the image (see
// horses.handlers.ts) before writing it to R2 or the local uploads dir, so it
// needs the raw bytes rather than a path multer already wrote to disk.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'))
  },
})
