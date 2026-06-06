const express = require('express')

const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} = require(
  '../controllers/alertController'
)

const protect = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getAlerts)

router.put(
  '/acknowledge/:id',
  acknowledgeAlert
)

router.put(
  '/resolve/:id',
  resolveAlert
)

module.exports = router