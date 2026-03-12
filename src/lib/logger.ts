import pino from 'pino'
import { config } from './config'

export const logger = pino({
  level: config.logLevel ?? (config.isDev ? 'debug' : 'info'),
  // Pretty-print in development; structured JSON in production for log aggregators
  ...(config.isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
})
