const mqtt = require('mqtt')

const connectMQTT = (io) => {

  const client = mqtt.connect('mqtt://broker.hivemq.com')

  client.on('connect', () => {

    console.log('MQTT Connected')

    client.subscribe('minigrafana/temperature')

  })

  client.on('message', (topic, message) => {

    const value = message.toString()

    console.log(`MQTT Message: ${value}`)

    const liveData = {
      temperature: Number(value),
      energy: Math.floor(Math.random() * 100),
      time: new Date().toLocaleTimeString(),
    }

    io.emit('live-data', liveData)

  })

}

module.exports = connectMQTT