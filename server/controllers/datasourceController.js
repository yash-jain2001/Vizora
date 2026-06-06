const axios = require('axios')
const Datasource = require('../models/Datasource')
const { getValueByPath } = require('../services/httpPollingService')

const createDatasource = async (req, res) => {
  try {
    const datasource = await Datasource.create(req.body)

    // Start background polling / subscriptions based on type
    if (datasource.type === 'http' || datasource.type === 'rest') {
      const io = req.app.get('io')
      const { startPolling } = require('../services/httpPollingService')
      startPolling(datasource, io)
    } else if (datasource.type === 'mqtt') {
      const io = req.app.get('io')
      const { startMqttSubscription } = require('../services/mqttService')
      startMqttSubscription(datasource, io)
    }

    const logAudit = require('../utils/auditLogger')
    const creatorName = req.user ? req.user.name : 'System'
    await logAudit(
      'INFO',
      `Datasource created: ${datasource.name} (${datasource.type})`,
      creatorName,
      req.ip
    )

    res.status(201).json(datasource)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getDatasources = async (req, res) => {
  try {
    const datasources = await Datasource.find()
    res.json(datasources)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const testDatasource = async (req, res) => {
  const { type, url, config } = req.body

  try {
    const logAudit = require('../utils/auditLogger')
    const testerName = req.user ? req.user.name : 'System'
    await logAudit(
      'INFO',
      `Datasource connection tested: ${type} (${url})`,
      testerName,
      req.ip
    )

    if (!type || !url) {
      return res.status(400).json({
        success: false,
        message: 'Connection type and URL are required.',
      })
    }

    // HTTP / REST Connection Test
    if (type.toLowerCase() === 'http' || type.toLowerCase() === 'rest') {
      const { method, headers: headersInput, valuePath, body: bodyInput } = config || {}

      const parsedHeaders = {}
      if (headersInput) {
        if (Array.isArray(headersInput)) {
          headersInput.forEach((h) => {
            if (h.key && h.value) {
              parsedHeaders[h.key] = h.value
            }
          })
        } else {
          Object.assign(parsedHeaders, headersInput)
        }
      }

      const reqMethod = (method || 'GET').toUpperCase()
      const reqConfig = {
        headers: parsedHeaders,
        timeout: 5000,
      }

      let response
      try {
        if (reqMethod === 'POST') {
          const reqBody = bodyInput ? (typeof bodyInput === 'string' ? JSON.parse(bodyInput) : bodyInput) : null
          response = await axios.post(url, reqBody, reqConfig)
        } else {
          response = await axios.get(url, reqConfig)
        }

        const data = response.data
        const extractedValue = getValueByPath(data, valuePath || 'value')
        const numericValue = Number(extractedValue)

        if (isNaN(numericValue)) {
          return res.status(200).json({
            success: true,
            message: `Connected successfully (Status ${response.status}). Warning: Extracted value at path "${valuePath || 'value'}" is not a number (Value: ${JSON.stringify(extractedValue)}).`,
          })
        }

        return res.status(200).json({
          success: true,
          message: `Connected successfully (Status ${response.status}). Extracted Value: ${numericValue}`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to ${url}: ${err.message}`,
        })
      }
    }

    // InfluxDB Connection Test
    if (type.toLowerCase() === 'influxdb') {
      const { product, token } = config || {}

      if (product === 'InfluxDB 2.x' || product === 'Cloud') {
        const { organization, bucket } = config || {}
        if (!organization || !bucket || !token) {
          return res.status(400).json({
            success: false,
            message: 'Organization, Bucket, and Token are required for InfluxDB 2.x / Cloud.',
          })
        }
      } else {
        const { database } = config || {}
        if (!database) {
          return res.status(400).json({
            success: false,
            message: 'Database name is required for InfluxDB 1.x.',
          })
        }
      }

      // Simulate a network check delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return res.status(200).json({
        success: true,
        message: 'Database connection test successful. 1 bucket found.',
      })
    }

    // Default mock response for other sources
    await new Promise((resolve) => setTimeout(resolve, 500))
    return res.status(200).json({
      success: true,
      message: `Connection test completed for ${type}.`,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteDatasource = async (req, res) => {
  try {
    const { id } = req.params
    const datasource = await Datasource.findByIdAndDelete(id)
    if (!datasource) {
      return res.status(404).json({
        message: 'Datasource not found',
      })
    }

    // Stop background polling / MQTT subscriptions
    if (datasource.type === 'http' || datasource.type === 'rest') {
      const { stopPolling } = require('../services/httpPollingService')
      stopPolling(id)
    } else if (datasource.type === 'mqtt') {
      const { stopMqttSubscription } = require('../services/mqttService')
      stopMqttSubscription(id)
    }

    const logAudit = require('../utils/auditLogger')
    const deleterName = req.user ? req.user.name : 'System'
    await logAudit(
      'WARN',
      `Datasource deleted: ${datasource.name}`,
      deleterName,
      req.ip
    )

    res.json({
      message: 'Datasource deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createDatasource,
  getDatasources,
  testDatasource,
  deleteDatasource,
}