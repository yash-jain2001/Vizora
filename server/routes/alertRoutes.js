const express = require('express')

const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} = require(
  '../controllers/alertController'
)

const protect = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getAlerts)

router.put(
  '/acknowledge/:id',
  authorizeRoles('admin', 'editor'),
  acknowledgeAlert
)

router.put(
  '/resolve/:id',
  authorizeRoles('admin', 'editor'),
  resolveAlert
)

module.exports = router