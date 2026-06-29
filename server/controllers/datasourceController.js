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

        try {
          const { InfluxDB } = require('@influxdata/influxdb-client')
          // Create client with dynamic URL and token
          const client = new InfluxDB({ url, token, timeout: 5000 })
          const queryApi = client.getQueryApi(organization)
          
          // Test query to list buckets to verify both token, org, and endpoint URL are correct
          await queryApi.collectRows('buckets() |> limit(n: 1)')

          return res.status(200).json({
            success: true,
            message: `Successfully connected to InfluxDB 2.x / Cloud at ${url}. Credentials are valid.`,
          })
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `Failed to connect to InfluxDB 2.x / Cloud at ${url}: ${err.message}`,
          })
        }
      } else {
        const { database, username, password } = config || {}
        if (!database) {
          return res.status(400).json({
            success: false,
            message: 'Database name is required for InfluxDB 1.x.',
          })
        }

        try {
          const reqConfig = { timeout: 5000 }
          if (username && password) {
            reqConfig.auth = { username, password }
          }
          // Query standard ping endpoint of InfluxDB 1.x
          const response = await axios.get(`${url}/ping`, reqConfig)
          if (response.status === 200 || response.status === 204) {
            return res.status(200).json({
              success: true,
              message: `Successfully connected to InfluxDB 1.x server at ${url}.`,
            })
          } else {
            return res.status(400).json({
              success: false,
              message: `Failed to connect to InfluxDB 1.x server at ${url} (status: ${response.status}).`,
            })
          }
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `Failed to connect to InfluxDB 1.x at ${url}: ${err.message}`,
          })
        }
      }
    }

    // MQTT Connection Test
    if (type.toLowerCase() === 'mqtt') {
      const mqtt = require('mqtt')
      return new Promise((resolve) => {
        const client = mqtt.connect(url, {
          username: config?.username || undefined,
          password: config?.password || undefined,
          connectTimeout: 4000,
          reconnectPeriod: 0,
        })

        let resolved = false
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true
            client.end(true)
            resolve(res.status(400).json({
              success: false,
              message: `Connection timeout: Failed to connect to MQTT broker at ${url}`,
            }))
          }
        }, 5000)

        client.on('connect', () => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            client.end(true)
            resolve(res.status(200).json({
              success: true,
              message: `Successfully connected to MQTT Broker at ${url}`,
            }))
          }
        })

        client.on('error', (err) => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            client.end(true)
            resolve(res.status(400).json({
              success: false,
              message: `Failed to connect to MQTT broker at ${url}: ${err.message}`,
            }))
          }
        })
      })
    }

    // Prometheus Connection Test
    if (type.toLowerCase() === 'prometheus') {
      try {
        const response = await axios.get(`${url}/api/v1/query?query=up`, { timeout: 5000 })
        if (response.data && response.data.status === 'success') {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Prometheus at ${url}.`,
          })
        } else {
          return res.status(400).json({
            success: false,
            message: `Connected to server at ${url}, but it did not return a valid Prometheus API response.`,
          })
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Prometheus at ${url}: ${err.message}`,
        })
      }
    }

    // PostgreSQL Connection Test
    if (type.toLowerCase() === 'postgresql') {
      const { Client } = require('pg')
      let pgClient;
      try {
        pgClient = new Client({
          connectionString: url,
          user: config?.username || undefined,
          password: config?.password || undefined,
          database: config?.database || undefined,
          connectionTimeoutMillis: 5000,
        })
        await pgClient.connect()
        await pgClient.query('SELECT 1')
        await pgClient.end()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to PostgreSQL database.`,
        })
      } catch (err) {
        if (pgClient) {
          try { await pgClient.end() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to PostgreSQL database: ${err.message}`,
        })
      }
    }

    // Loki Connection Test
    if (type.toLowerCase() === 'loki') {
      try {
        // Loki ready endpoint
        const response = await axios.get(`${url}/ready`, { timeout: 5000 })
        if (response.status === 200 && response.data.trim() === 'ready') {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Loki server at ${url} (Ready).`,
          })
        }

        // Alternative labels check
        const labelsResponse = await axios.get(`${url}/loki/api/v1/labels`, { timeout: 5000 })
        if (labelsResponse.status === 200) {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Loki server at ${url}.`,
          })
        }

        return res.status(400).json({
          success: false,
          message: `Connected to ${url}, but Loki responded with status ${response.status}.`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Loki server at ${url}: ${err.message}`,
        })
      }
    }

    // WebSocket Connection Test
    if (type.toLowerCase() === 'websocket') {
      const WebSocket = require('ws')
      return new Promise((resolve) => {
        let ws;
        try {
          ws = new WebSocket(url, {
            handshakeTimeout: 5000,
          })
        } catch (err) {
          return resolve(res.status(400).json({
            success: false,
            message: `Invalid WebSocket URL: ${err.message}`,
          }))
        }

        let resolved = false
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true
            ws.terminate()
            resolve(res.status(400).json({
              success: false,
              message: `Connection timeout: Failed to connect to WebSocket server at ${url}`,
            }))
          }
        }, 5000)

        ws.on('open', () => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            ws.close()
            resolve(res.status(200).json({
              success: true,
              message: `Successfully connected to WebSocket server at ${url}`,
            }))
          }
        })

        ws.on('error', (err) => {
          if (!resolved) {
            resolved = true
            clearTimeout(timeout)
            ws.terminate()
            resolve(res.status(400).json({
              success: false,
              message: `Failed to connect to WebSocket server at ${url}: ${err.message}`,
            }))
          }
        })
      })
    }

    // CSV Connection Test
    if (type.toLowerCase() === 'csv') {
      const fs = require('fs')
      const path = require('path')
      try {
        const resolvedPath = path.resolve(url)
        if (!fs.existsSync(resolvedPath)) {
          return res.status(400).json({
            success: false,
            message: `CSV file not found at path: ${url}`,
          })
        }

        const stats = fs.statSync(resolvedPath)
        if (!stats.isFile()) {
          return res.status(400).json({
            success: false,
            message: `Path exists but is not a file: ${url}`,
          })
        }

        // Test readability
        const fd = fs.openSync(resolvedPath, 'r')
        fs.closeSync(fd)

        return res.status(200).json({
          success: true,
          message: `CSV file found and is readable at ${url} (${(stats.size / 1024).toFixed(2)} KB).`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to access CSV file at ${url}: ${err.message}`,
        })
      }
    }

    // MySQL Connection Test
    if (type.toLowerCase() === 'mysql') {
      const mysql = require('mysql2/promise')
      let connection;
      try {
        let host = 'localhost';
        let port = 3306;
        if (url) {
          const match = url.match(/^(?:mysql:\/\/)?([^:/]+)(?::(\d+))?/i);
          if (match) {
            host = match[1];
            port = match[2] ? parseInt(match[2], 10) : 3306;
          }
        }
        connection = await mysql.createConnection({
          host,
          port,
          user: config?.username || 'root',
          password: config?.password || '',
          database: config?.database || undefined,
          connectTimeout: 5000,
        })
        await connection.query('SELECT 1')
        await connection.end()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to MySQL database.`,
        })
      } catch (err) {
        if (connection) {
          try { await connection.end() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to MySQL database: ${err.message}`,
        })
      }
    }

    // MongoDB Connection Test
    if (type.toLowerCase() === 'mongodb') {
      const { MongoClient } = require('mongodb')
      let client;
      try {
        client = new MongoClient(url, { connectTimeoutMS: 5000 })
        await client.connect()
        const dbName = config?.database || 'admin'
        await client.db(dbName).command({ ping: 1 })
        await client.close()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to MongoDB database.`,
        })
      } catch (err) {
        if (client) {
          try { await client.close() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to MongoDB database: ${err.message}`,
        })
      }
    }

    // Microsoft SQL Server Connection Test
    if (type.toLowerCase() === 'mssql') {
      const sql = require('mssql')
      try {
        let server = url;
        let port = 1433;
        if (url) {
          const match = url.match(/^(?:mssql:\/\/)?([^:/]+)(?::(\d+))?/i);
          if (match) {
            server = match[1];
            port = match[2] ? parseInt(match[2], 10) : 1433;
          }
        }
        const mssqlConfig = {
          server,
          port,
          user: config?.username || '',
          password: config?.password || '',
          database: config?.database || 'master',
          connectionTimeout: 5000,
          requestTimeout: 5000,
          options: {
            encrypt: true,
            trustServerCertificate: true,
          }
        }
        const pool = await sql.connect(mssqlConfig)
        await pool.request().query('SELECT 1')
        await pool.close()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to Microsoft SQL Server database.`,
        })
      } catch (err) {
        try { await sql.close() } catch (_) {}
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Microsoft SQL Server database: ${err.message}`,
        })
      }
    }

    // Elasticsearch Connection Test
    if (type.toLowerCase() === 'elasticsearch') {
      try {
        const reqConfig = { timeout: 5000 }
        if (config?.username && config?.password) {
          reqConfig.auth = {
            username: config.username,
            password: config.password,
          }
        }
        const response = await axios.get(url, reqConfig)
        if (response.data && (response.data.version || response.data.tagline === 'You Know, for Search')) {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Elasticsearch cluster (Version: ${response.data.version?.number || 'Unknown'}).`,
          })
        }
        return res.status(200).json({
          success: true,
          message: `Connected to endpoint, but node tagline did not match Elasticsearch. Status: ${response.status}`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Elasticsearch at ${url}: ${err.message}`,
        })
      }
    }

    // Redis Connection Test
    if (type.toLowerCase() === 'redis') {
      const { createClient } = require('redis')
      let client;
      try {
        const redisUrl = url.startsWith('redis://') ? url : `redis://${url}`;
        client = createClient({
          url: redisUrl,
          password: config?.password || undefined,
          socket: { connectTimeout: 5000 },
        })
        await client.connect()
        await client.ping()
        await client.disconnect()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to Redis database.`,
        })
      } catch (err) {
        if (client) {
          try { await client.disconnect() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Redis database: ${err.message}`,
        })
      }
    }

    // SQLite Connection Test
    if (type.toLowerCase() === 'sqlite') {
      const fs = require('fs')
      const path = require('path')
      try {
        const resolvedPath = path.resolve(url)
        if (!fs.existsSync(resolvedPath)) {
          return res.status(400).json({
            success: false,
            message: `SQLite database file not found at path: ${url}`,
          })
        }

        const buffer = Buffer.alloc(16)
        const fd = fs.openSync(resolvedPath, 'r')
        fs.readSync(fd, buffer, 0, 16, 0)
        fs.closeSync(fd)

        if (buffer.toString('utf8', 0, 15) !== 'SQLite format 3') {
          return res.status(400).json({
            success: false,
            message: `File at path ${url} exists, but is not a valid SQLite database file.`,
          })
        }

        const stats = fs.statSync(resolvedPath)
        return res.status(200).json({
          success: true,
          message: `SQLite database file found and validated successfully (${(stats.size / 1024).toFixed(2)} KB).`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to validate SQLite file: ${err.message}`,
        })
      }
    }

    // ClickHouse Connection Test
    if (type.toLowerCase() === 'clickhouse') {
      try {
        const reqConfig = { timeout: 5000 }
        if (config?.username && config?.password) {
          reqConfig.headers = {
            'X-ClickHouse-User': config.username,
            'X-ClickHouse-Key': config.password,
          }
        }
        const pingUrl = url.endsWith('/ping') ? url : `${url.replace(/\/$/, '')}/ping`
        const response = await axios.get(pingUrl, reqConfig)
        if (response.status === 200 && response.data.toString().trim() === 'Ok.') {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to ClickHouse server.`,
          })
        }
        const queryUrl = url.endsWith('/') ? url : `${url.replace(/\/$/, '')}/`
        const queryResponse = await axios.post(queryUrl, 'SELECT 1', reqConfig)
        if (queryResponse.status === 200) {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to ClickHouse server (Query tested).`,
          })
        }
        return res.status(400).json({
          success: false,
          message: `Connected to ClickHouse but received response: ${response.data}`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to ClickHouse database: ${err.message}`,
        })
      }
    }

    // Cassandra Connection Test
    if (type.toLowerCase() === 'cassandra') {
      const cassandra = require('cassandra-driver')
      let client;
      try {
        let contactPoints = [url];
        if (url) {
          const cleanUrl = url.replace(/^(?:cassandra:\/\/)?/i, '')
          contactPoints = [cleanUrl.split(':')[0]]
        }
        const authProvider = (config?.username && config?.password)
          ? new cassandra.auth.PlainTextAuthProvider(config.username, config.password)
          : undefined;

        client = new cassandra.Client({
          contactPoints,
          localDataCenter: config?.organization || 'datacenter1',
          keyspace: config?.database || undefined,
          authProvider,
          socketOptions: { connectTimeout: 5000 },
        })
        await client.connect()
        await client.execute('SELECT now() FROM system.local')
        await client.shutdown()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to Apache Cassandra.`,
        })
      } catch (err) {
        if (client) {
          try { await client.shutdown() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Cassandra keyspace: ${err.message}`,
        })
      }
    }

    // Oracle Connection Test
    if (type.toLowerCase() === 'oracle') {
      const oracledb = require('oracledb')
      let connection;
      try {
        connection = await oracledb.getConnection({
          user: config?.username || '',
          password: config?.password || '',
          connectString: url,
        })
        await connection.execute('SELECT 1 FROM DUAL')
        await connection.close()
        return res.status(200).json({
          success: true,
          message: `Successfully connected to Oracle Database.`,
        })
      } catch (err) {
        if (connection) {
          try { await connection.close() } catch (_) {}
        }
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Oracle Database: ${err.message}`,
        })
      }
    }

    // Graphite Connection Test
    if (type.toLowerCase() === 'graphite') {
      try {
        const findUrl = `${url.replace(/\/$/, '')}/metrics/find?query=*`
        const response = await axios.get(findUrl, { timeout: 5000 })
        if (response.status === 200 && Array.isArray(response.data)) {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Graphite metrics server (Found ${response.data.length} root metrics).`,
          })
        }
        const renderUrl = `${url.replace(/\/$/, '')}/render?target=up`
        const renderResponse = await axios.get(renderUrl, { timeout: 5000 })
        if (renderResponse.status === 200) {
          return res.status(200).json({
            success: true,
            message: `Successfully connected to Graphite metrics server.`,
          })
        }
        return res.status(400).json({
          success: false,
          message: `Connected to Graphite server, but query returned status ${response.status}.`,
        })
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Failed to connect to Graphite server at ${url}: ${err.message}`,
        })
      }
    }
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