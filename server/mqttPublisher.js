const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', () => {

  console.log('Publisher Connected')

  setInterval(() => {

    const randomTemp = Math.floor(Math.random() * 100)

    client.publish(
      'minigrafana/temperature',
      randomTemp.toString()
    )

    console.log(`Published: ${randomTemp}`)

  }, 3000)

})