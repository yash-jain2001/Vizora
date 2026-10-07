const express = require('express')
const router = express.Router()
const protect = require('../middlewares/authMiddleware')
const {
  getDevices,
  updateDevice,
  getRules,
  createRule,
  updateRule,
  deleteRule,
  getIntegrations,
  testIntegration,
  saveIntegration,
  deleteIntegration
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

// Integrations & Plugins endpoints
router.route('/integrations')
  .get(getIntegrations)
  .post(saveIntegration)

router.post('/integrations/test', testIntegration)

router.delete('/integrations/:id', deleteIntegration)

module.exports = router
