const mqtt = require('mqtt')

const Alert = require('../models/Alert')

const connectMQTT = (io) => {

  const client = mqtt.connect(
    'mqtt://broker.hivemq.com'
  )

  client.on('connect', () => {

    console.log('MQTT Connected')

    client.subscribe(
      'vizora/temperature'
    )

  })

  client.on(
    'message',
    async (
      topic,
      message
    ) => {

      const value =
        Number(
          message.toString()
        )

      console.log(
        `MQTT Message: ${value}`
      )

      const liveData = {
        temperature: value,
        energy:
          Math.floor(
            Math.random() * 100
          ),
        time:
          new Date().toLocaleTimeString(),
      }

      /* EMIT LIVE DATA */
      io.emit(
        'live-data',
        liveData
      )

      /* ALERT CONDITION */
      if (value > 70) {

        const alert =
          await Alert.create({
            title:
              'High Temperature',
            message:
              `Temperature exceeded threshold: ${value}°C`,
            severity:
              value > 90
                ? 'high'
                : 'medium',
            value,
          })

        io.emit(
          'new-alert',
          alert
        )

      }

    }
  )

}

module.exports = connectMQTT