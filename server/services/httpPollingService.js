const axios = require('axios')
const Datasource = require('../models/Datasource')
const { saveMetric } = require('./influxServices')

// Keep track of active intervals: key is datasource ID, value is interval reference
const activePolls = {}

/**
 * Resolves a nested JSON path string (e.g. "main.temp") on an object.
 */
const getValueByPath = (obj, path) => {
  if (!path) return obj
  return path.split('.').reduce((acc, part) => {
    if (acc && acc[part] !== undefined) {
      return acc[part]
    }
    return undefined
  }, obj)
}

/**
 * Convert headers array or object to clean headers object
 */
const parseHeaders = (headersInput) => {
  if (!headersInput) return {}
  if (Array.isArray(headersInput)) {
    const headers = {}
    headersInput.forEach((h) => {
      if (h.key && h.value) {
        headers[h.key] = h.value
      }
    })
    return headers
  }
  return headersInput
}

/**
 * Starts periodic polling for a single HTTP/REST datasource.
 */
const startPolling = (datasource, io) => {
  const { _id, name, url, config } = datasource
  const idStr = _id.toString()

  // Clean up any existing interval for this datasource
  stopPolling(idStr)

  const method = (config.method || 'GET').toUpperCase()
  const intervalSeconds = Number(config.interval) || 10
  const valuePath = config.valuePath || 'value'
  const measurement = config.measurement || 'temperature'
  const field = config.field || 'value'
  const headers = parseHeaders(config.headers)
  const body = config.body ? (typeof config.body === 'string' ? JSON.parse(config.body) : config.body) : null

  console.log(`[HTTP Polling] Starting polling for "${name}" every ${intervalSeconds}s -> ${url}`)

  const pollAction = async () => {
    try {
      let response
      const requestConfig = {
        headers,
        timeout: 5000,
      }

      if (method === 'POST') {
        response = await axios.post(url, body, requestConfig)
      } else {
        response = await axios.get(url, requestConfig)
      }

      const rawData = response.data
      const rawValue = getValueByPath(rawData, valuePath)
      const numericValue = Number(rawValue)

      if (isNaN(numericValue)) {
        console.warn(`[HTTP Polling] "${name}" warning: Extracted value at path "${valuePath}" is not a number:`, rawValue)
        return
      }

      console.log(`[HTTP Polling] "${name}" fetched value: ${numericValue} (from path "${valuePath}")`)

      // Write to InfluxDB
      await saveMetric(measurement, field, numericValue)

      // Emit to socket clients if it's temperature telemetry
      if (io && measurement === 'temperature') {
        const liveData = {
          temperature: numericValue,
          energy: Math.floor(Math.random() * 100),
          time: new Date().toLocaleTimeString(),
        }
        io.emit('live-data', liveData)
      }

    } catch (error) {
      console.error(`[HTTP Polling] "${name}" error:`, error.message)
    }
  }

  // Run immediately once
  pollAction()

  // Schedule interval
  activePolls[idStr] = setInterval(pollAction, intervalSeconds * 1000)
}

/**
 * Stops periodic polling for a datasource.
 */
const stopPolling = (id) => {
  const idStr = id.toString()
  if (activePolls[idStr]) {
    clearInterval(activePolls[idStr])
    delete activePolls[idStr]
    console.log(`[HTTP Polling] Stopped polling for datasource: ${idStr}`)
  }
}

/**
 * Initializes polling for all registered HTTP/REST datasources on startup.
 */
const initPolling = async (io) => {
  try {
    const datasources = await Datasource.find({ type: { $in: ['http', 'rest'] } })
    console.log(`[HTTP Polling] Found ${datasources.length} HTTP/REST datasources to poll.`)
    datasources.forEach((ds) => {
      startPolling(ds, io)
    })
  } catch (error) {
    console.error('[HTTP Polling] Initialization failed:', error.message)
  }
}

module.exports = {
  startPolling,
  stopPolling,
  initPolling,
  getValueByPath,
  parseHeaders,
}
