const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const http = require('http')

const { Server } = require('socket.io')

const connectDB = require('./config/db')

dotenv.config()

connectDB()

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

/* ROUTES */
app.use('/api/dashboard', require('./routes/dashboardRoutes'))

/* SOCKET CONNECTION */
io.on('connection', (socket) => {

  console.log('Client Connected')

  setInterval(() => {

    const liveData = {
      temperature: Math.floor(Math.random() * 100),
      energy: Math.floor(Math.random() * 100),
      time: new Date().toLocaleTimeString(),
    }

    socket.emit('live-data', liveData)

  }, 3000)

  socket.on('disconnect', () => {
    console.log('Client Disconnected')
  })

})

app.get('/', (req, res) => {
  res.send('Mini Grafana Backend Running 🚀')
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})