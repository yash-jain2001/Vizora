const express = require('express')
const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
  clearResolvedAlerts,
  getRules,
  createRule,
  updateRule,
  deleteRule,
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  testChannel,
  getEscalationPolicies,
  createEscalationPolicy,
  updateEscalationPolicy,
  deleteEscalationPolicy,
  triggerAlert
} = require('../controllers/alertController')

const protect = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

const router = express.Router()

router.use(protect)

// Alerts endpoints
router.get('/', getAlerts)
router.delete('/clear-resolved', authorizeRoles('admin', 'editor'), clearResolvedAlerts)

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

// Alert Rules endpoints
router.route('/rules')
  .get(getRules)
  .post(authorizeRoles('admin', 'editor'), createRule)

router.route('/rules/:id')
  .put(authorizeRoles('admin', 'editor'), updateRule)
  .delete(authorizeRoles('admin'), deleteRule)

// Notification Channels endpoints (Slack, MS Teams, Discord, Gmail, Outlook, SMTP)
router.route('/channels')
  .get(getChannels)
  .post(authorizeRoles('admin', 'editor'), createChannel)

router.route('/channels/:id')
  .put(authorizeRoles('admin', 'editor'), updateChannel)
  .delete(authorizeRoles('admin'), deleteChannel)

router.post('/channels/test', authorizeRoles('admin', 'editor'), testChannel)

// Escalation Policies endpoints
router.route('/escalations')
  .get(getEscalationPolicies)
  .post(authorizeRoles('admin', 'editor'), createEscalationPolicy)

router.route('/escalations/:id')
  .put(authorizeRoles('admin', 'editor'), updateEscalationPolicy)
  .delete(authorizeRoles('admin'), deleteEscalationPolicy)

// Trigger Alert Endpoint
router.post('/trigger', authorizeRoles('admin', 'editor'), triggerAlert)

module.exports = router