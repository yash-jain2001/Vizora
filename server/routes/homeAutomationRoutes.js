const express = require('express')
const router = express.Router()
const protect = require('../middlewares/authMiddleware')
const {
  getDevices,
  updateDevice,
  getRules,
  createRule,
  updateRule,
  deleteRule
} = require('../controllers/homeAutomationController')

// All routes are protected by authMiddleware
router.use(protect)

// Devices endpoints
router.get('/devices', getDevices)
router.put('/devices/:id', updateDevice)

// Automation Rules endpoints
router.route('/rules')
  .get(getRules)
  .post(createRule)

router.route('/rules/:id')
  .put(updateRule)
  .delete(deleteRule)

module.exports = router
