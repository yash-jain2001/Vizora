const mqtt = require('mqtt')

const Alert = require('../models/Alert')

const {
  saveTemperature,
} = require('./influxServices')

const connectMQTT = (io) => {

  const client = mqtt.connect(
    'mqtt://broker.hivemq.com'
  )

  client.on('connect', () => {

    console.log('MQTT Connected')

    console.log(
      'Subscribing to: minigrafana/temperature'
    )

    client.subscribe(
      'minigrafana/temperature',
      (err) => {

        if (err) {

          console.error(
            'Subscribe Error:',
            err
          )

        } else {

          console.log(
            'Successfully subscribed to minigrafana/temperature'
          )

        }

      }
    )

  })

  client.on('error', (error) => {

    console.error(
      'MQTT Connection Error:',
      error
    )

  })

  client.on(
    'message',
    async (
      topic,
      message
    ) => {

      console.log(
        'MESSAGE RECEIVED:',
        topic,
        message.toString()
      )

      try {

        const value = Number(
          message.toString()
        )

        console.log(
          `MQTT Message: ${value}`
        )

        /* SAVE TO INFLUXDB */
        await saveTemperature(
          value
        )

        console.log(
          `Saved to InfluxDB: ${value}`
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

        /* REALTIME DASHBOARD UPDATE */
        io.emit(
          'live-data',
          liveData
        )

        /* ALERT GENERATION */
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

      } catch (error) {

        console.error(
          'MQTT Processing Error:',
          error
        )

      }

    }
  )

}

module.exports = connectMQTT