// Logger configuration
const logger = {
  error: (...args) => console.error(`[${new Date()}]`, ...args),
  warn: (...args) => console.warn(`[${new Date()}]`, ...args),
  info: (...args) => console.info(`[${new Date()}]`, ...args),
  debug: (...args) => console.debug(`[${new Date()}]`, ...args),
};

module.exports = { logger };
