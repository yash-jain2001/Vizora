const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const http = require('http')

const { Server } =
  require('socket.io')

const connectDB =
  require('./config/db')

const { initMqttSubscriptions } =
  require('./services/mqttService')

const { initPolling } =
  require('./services/httpPollingService')

connectDB()

const app = express()

const server =
  http.createServer(app)

const io = new Server(server, {
  cors: {
    origin:
      'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Share socket.io instance with Express controllers
app.set('io', io)

// Initialize MQTT subscription
initMqttSubscriptions(io)

// Initialize HTTP background polling
initPolling(io)

app.use(cors())
app.use(express.json())

app.use(
  '/api/dashboard',
  require('./routes/dashboardRoutes')
)

app.use(
  '/api/datasources',
  require('./routes/datasourceRoutes')
)

app.use(
  '/api/auth',
  require('./routes/authRoutes')
)

app.use(
  '/api/dashboards',
  require('./routes/dashboardCrudRoutes')
)

app.use(
  '/api/alerts',
  require('./routes/alertRoutes')
)

app.use(
  '/api/history',
  require('./routes/historyRoutes')
)

app.use(
  '/api/admin',
  require('./routes/adminRoutes')
)

app.use(
  '/api/erp',
  require('./routes/erpRoutes')
)

app.use(
  '/api/home-automation',
  require('./routes/homeAutomationRoutes')
)

io.on(
  'connection',
  (socket) => {

    console.log(
      'Client Connected'
    )

    socket.on(
      'disconnect',
      () => {

        console.log(
          'Client Disconnected'
        )

      }
    )

  }
)

app.get('/', (req, res) => {

  res.send(
    'Mini Grafana Backend Running 🚀'
  )

})

const PORT =
  process.env.PORT || 5000

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  )

})
