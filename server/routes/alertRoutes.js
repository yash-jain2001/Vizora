const express = require('express')

const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} = require(
  '../controllers/alertController'
)

const router = express.Router()

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