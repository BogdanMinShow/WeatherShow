import { CONFIG } from "./config.js"

const levels = { debug: 0, info: 1, warn: 2, error: 3 }
const currentLevel = levels[CONFIG.LOGGING.LEVEL]

export class Logger {
  constructor() {
    this.logs = []
    this.currentLevel = levels[CONFIG.LOGGING.LEVEL] || levels.info
  }

  debug(message, data = null) {
    if (this.currentLevel <= levels.debug) {
        this._log('debug', message, data)
    }
  }

  info(message, data = null) {
    if (this.currentLevel <= levels.info) {
        this._log('info', message, data)
    }
  }

  warn(message, data = null) {
    if (this.currentLevel <= levels.warn) {
        this._log('warn', message, data)
    }
  }

  error(message, error = null) {
    if (this.currentLevel <= levels.error) {
        const data = error instanceof Error ? { message: error.message, stack: error.stack } : error
      this._log('error', message, data)
    }
  }

  _log(level, message, data) {
    const timestamp = new Date().toLocaleTimeString()
    const formated = `[${timestamp}]-[${level}]: ${message}`
    const entry = { timestamp, level, message, data }

    this.logs.push(entry)

    if (this.logs.length > CONFIG.LOGGING.MAX_LOGS) {
      this.logs.shift()
    }

    if (level === 'error') {
      console.error(formated, data)
    } else if (level === 'warn') {
      console.warn(formated, data)
    } else {
      console.log(formated, data)
    }
  }

  getLogs() {
    return[...this.logs]
  }

  clearLogs() {
    this.logs=[]
  }

  show() {
    console.table(this.logs)
  }
}

export const logger = new Logger()

window.logs = {
  show: () => logger.show(),
  clear: () => logger.clearLogs(),
  get: () => logger.getLogs(),
}