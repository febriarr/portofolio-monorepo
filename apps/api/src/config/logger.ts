import winston from "winston"

const { combine, timestamp, colorize, printf, errors } = winston.format

const isDevelopment = process.env.NODE_ENV !== "production"

const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : ""
  return `${timestamp} [${level}]: ${stack ?? message}${metaStr}`
})

export const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "http", // debug di dev, http ke atas di prod
  format: combine(
    errors({ stack: true }), // capture stack trace
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), consoleFormat),
    }),
  ],
})
