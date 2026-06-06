const mqtt = require('mqtt')
const Alert = require('../models/Alert')
const Datasource = require('../models/Datasource')
const { saveMetric } = require('./influxServices')

const activeMqttClients = {}

const startMqttSubscription = (datasource, io) => {
  const { _id, name, url, topic, config } = datasource
  const idStr = _id.toString()

  // Clean up any existing connection for this datasource
  stopMqttSubscription(idStr)

  const { username, password, clientId } = config || {}
  const options = {
    connectTimeout: 5000,
    reconnectPeriod: 10000,
  }
  if (username) options.username = username
  if (password) options.password = password
  if (clientId) options.clientId = clientId

  console.log(`[MQTT] Connecting to "${name}" broker: ${url} at topic: ${topic}`)

  try {
    const client = mqtt.connect(url, options)

    client.on('connect', () => {
      console.log(`[MQTT] Connected to broker "${name}" (${url})`)
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT] Subscribe error for "${name}" on topic "${topic}":`, err)
        } else {
          console.log(`[MQTT] Subscribed to topic "${topic}" for "${name}"`)
        }
      })
    })

    client.on('error', (err) => {
      console.error(`[MQTT] Connection error for "${name}" (${url}):`, err.message)
    })

    client.on('message', async (incomingTopic, message) => {
      const msgStr = message.toString()
      console.log(`[MQTT] Message received on [${incomingTopic}] from "${name}": ${msgStr}`)

      try {
        const value = Number(msgStr)
        if (isNaN(value)) {
          console.warn(`[MQTT] Received non-numeric message on "${incomingTopic}": ${msgStr}`)
          return
        }

        const measurement = config?.measurement || 'temperature'
        const field = config?.field || 'value'

        const liveData = {
          datasourceId: idStr,
          value: value,
          time: new Date().toLocaleTimeString(),
        }

        // Emit dynamic socket feed for this specific datasource immediately
        if (io) {
          io.emit(`live-data-${idStr}`, liveData)
          // Maintain compatibility with standard live-data stream
          if (measurement === 'temperature') {
            io.emit('live-data', {
              temperature: value,
              energy: Math.floor(Math.random() * 100),
              time: liveData.time,
            })
          }
        }

        // Save to InfluxDB asynchronously in the background
        saveMetric(measurement, field, value).catch(err => {
          console.error(`[MQTT] InfluxDB save failed for "${name}":`, err.message)
        })

        /* ALERT GENERATION */
        if (value > 70) {
          try {
            const alert = await Alert.create({
              title: `High Metric value on ${name}`,
              message: `Metric value exceeded threshold: ${value} (on topic ${topic})`,
              severity: value > 90 ? 'high' : 'medium',
              value,
            })
            if (io) {
              io.emit('new-alert', alert)
            }
          } catch (alertErr) {
            console.error(`[MQTT] Alert creation failed:`, alertErr.message)
          }
        }

      } catch (error) {
        console.error(`[MQTT] Error processing message on topic "${incomingTopic}":`, error)
      }
    })

    activeMqttClients[idStr] = client
  } catch (error) {
    console.error(`[MQTT] Failed to initialize MQTT client for "${name}":`, error.message)
  }
}

const stopMqttSubscription = (id) => {
  const idStr = id.toString()
  if (activeMqttClients[idStr]) {
    try {
      activeMqttClients[idStr].end(true)
      delete activeMqttClients[idStr]
      console.log(`[MQTT] Disconnected client for datasource ID: ${idStr}`)
    } catch (error) {
      console.error(`[MQTT] Error disconnecting client for ID ${idStr}:`, error.message)
    }
  }
}

const initMqttSubscriptions = async (io) => {
  try {
    const datasources = await Datasource.find({ type: 'mqtt' })
    console.log(`[MQTT] Found ${datasources.length} MQTT datasources on startup.`)
    datasources.forEach((ds) => {
      startMqttSubscription(ds, io)
    })

    // Always connect to the default HiveMQ broker as a system fallback for out-of-the-box widgets
    console.log('[MQTT] Initializing default system MQTT subscriber on mqtt://broker.hivemq.com -> minigrafana/temperature')
    const defaultDs = {
      _id: 'default_system_mqtt',
      name: 'Default System Broker',
      url: 'mqtt://broker.hivemq.com',
      topic: 'minigrafana/temperature',
      config: {
        measurement: 'temperature',
        field: 'value'
      }
    }
    startMqttSubscription(defaultDs, io)
  } catch (error) {
    console.error('[MQTT] Initialization failed:', error.message)
  }
}

module.exports = {
  startMqttSubscription,
  stopMqttSubscription,
  initMqttSubscriptions,
}