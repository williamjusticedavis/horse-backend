import multer from 'multer'
import { mkdirSync } from 'fs'
import { join, extname } from 'path'
import { config } from './config'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

let storage: multer.StorageEngine
if (config.r2) {
  storage = multer.memoryStorage()
} else {
  const UPLOADS_DIR = join(process.cwd(), 'uploads')
  mkdirSync(UPLOADS_DIR, { recursive: true })
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = extname(file.originalname).toLowerCase()
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
    },
  })
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG, PNG, WebP and GIF images are allowed'))
  },
})
