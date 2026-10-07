const Alert = require('../models/Alert')
const AlertRule = require('../models/AlertRule')
const NotificationChannel = require('../models/NotificationChannel')
const {
  sendNotification,
  sendSlackNotification,
  sendTeamsNotification,
  sendDiscordNotification,
  sendEmailNotification
} = require('../services/notificationService')

/* GET ALERTS */
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 })
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* ACKNOWLEDGE ALERT */
const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' })
    }

    alert.acknowledged = true
    await alert.save()

    const logAudit = require('../utils/auditLogger')
    const ackName = req.user ? req.user.name : 'System'
    await logAudit(
      'CONFIG',
      `Alert acknowledged: ${alert.title}`,
      ackName,
      req.ip
    )

    res.json(alert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* RESOLVE ALERT */
const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' })
    }

    alert.resolved = true
    alert.resolvedAt = new Date()
    await alert.save()

    const logAudit = require('../utils/auditLogger')
    const resName = req.user ? req.user.name : 'System'
    await logAudit(
      'CONFIG',
      `Alert resolved: ${alert.title}`,
      resName,
      req.ip
    )

    res.json(alert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* CLEAR ALL RESOLVED ALERTS */
const clearResolvedAlerts = async (req, res) => {
  try {
    await Alert.deleteMany({ resolved: true })
    res.json({ message: 'Resolved alerts cleared successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* DEFAULT SEED RULES */
const defaultRules = [
  {
    name: 'High Power Consumption Warning',
    target: 'Power Usage',
    condition: 'gt',
    threshold: 1500,
    severity: 'high',
    channels: ['bell', 'toast'],
    enabled: true
  },
  {
    name: 'Living Room Overheat Alert',
    target: 'Living Room AC',
    condition: 'gt',
    threshold: 28,
    severity: 'critical',
    channels: ['bell', 'toast', 'webhook'],
    enabled: true
  },
  {
    name: 'Patio Access Security Unlocked',
    target: 'Patio Gate Lock',
    condition: 'eq',
    threshold: 0,
    severity: 'critical',
    channels: ['bell', 'toast'],
    enabled: true
  }
]

/* GET ALERT RULES */
const getRules = async (req, res) => {
  try {
    let rules = await AlertRule.find()
    if (rules.length === 0) {
      rules = await AlertRule.insertMany(defaultRules)
    }
    res.json(rules)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* CREATE ALERT RULE */
const createRule = async (req, res) => {
  try {
    const rule = await AlertRule.create(req.body)
    res.status(201).json(rule)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* UPDATE ALERT RULE */
const updateRule = async (req, res) => {
  try {
    const rule = await AlertRule.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!rule) {
      return res.status(404).json({ message: 'Alert rule not found' })
    }
    res.json(rule)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* DELETE ALERT RULE */
const deleteRule = async (req, res) => {
  try {
    const rule = await AlertRule.findByIdAndDelete(req.params.id)
    if (!rule) {
      return res.status(404).json({ message: 'Alert rule not found' })
    }
    res.json({ message: 'Alert rule deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* DEFAULT SEED CHANNELS */
const defaultChannels = [
  {
    name: 'DevOps Slack Channel',
    type: 'slack',
    config: { webhookUrl: 'https://hooks.slack.com/services/sample/webhook' },
    enabled: true
  },
  {
    name: 'Admin Gmail Alerts',
    type: 'gmail',
    config: { user: 'alerts@vizora.io', recipients: ['admin@company.com'] },
    enabled: true
  }
]

/* GET NOTIFICATION CHANNELS */
const getChannels = async (req, res) => {
  try {
    let channels = await NotificationChannel.find()
    if (channels.length === 0) {
      channels = await NotificationChannel.insertMany(defaultChannels)
    }
    res.json(channels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* CREATE NOTIFICATION CHANNEL */
const createChannel = async (req, res) => {
  try {
    const channel = await NotificationChannel.create(req.body)
    res.status(201).json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* UPDATE NOTIFICATION CHANNEL */
const updateChannel = async (req, res) => {
  try {
    const channel = await NotificationChannel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!channel) {
      return res.status(404).json({ message: 'Notification channel not found' })
    }
    res.json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* DELETE NOTIFICATION CHANNEL */
const deleteChannel = async (req, res) => {
  try {
    const channel = await NotificationChannel.findByIdAndDelete(req.params.id)
    if (!channel) {
      return res.status(404).json({ message: 'Notification channel not found' })
    }
    res.json({ message: 'Notification channel deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* TEST NOTIFICATION CHANNEL DISPATCH */
const testChannel = async (req, res) => {
  try {
    const { type, config } = req.body
    const sampleAlert = {
      title: 'Test Notification Handshake',
      message: `Test alert payload dispatched to verify ${type.toUpperCase()} notification channel.`,
      severity: 'medium',
      value: 99,
      createdAt: new Date()
    }

    if (type === 'slack') {
      if (!config.webhookUrl) return res.status(400).json({ message: 'Slack Webhook URL is required' })
      await sendSlackNotification(config.webhookUrl, sampleAlert)
    } else if (type === 'teams') {
      if (!config.webhookUrl) return res.status(400).json({ message: 'MS Teams Webhook URL is required' })
      await sendTeamsNotification(config.webhookUrl, sampleAlert)
    } else if (type === 'discord') {
      if (!config.webhookUrl) return res.status(400).json({ message: 'Discord Webhook URL is required' })
      await sendDiscordNotification(config.webhookUrl, sampleAlert)
    } else if (type === 'gmail' || type === 'outlook' || type === 'smtp') {
      if (!config.user || !config.recipients) {
        return res.status(400).json({ message: 'Email Sender User and Recipient Email are required' })
      }
      await sendEmailNotification({ ...config, type }, sampleAlert)
    }

    res.json({ success: true, message: `Dispatched test payload to ${type.toUpperCase()} channel successfully.` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* TRIGGER ALERT MANUALLY OR VIA WEBHOOK */
const triggerAlert = async (req, res) => {
  try {
    const { title, message, severity, value, webhookUrl, channels } = req.body
    const newAlert = await Alert.create({
      title: title || 'Manual Alert Trigger',
      message: message || 'An alert was triggered through the notification framework',
      severity: severity || 'medium',
      value: value || 0,
      acknowledged: false,
      resolved: false
    })

    const io = req.app.get('io')
    await sendNotification(io, newAlert, channels || ['bell', 'toast'], webhookUrl || '')

    res.status(201).json(newAlert)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* ESCALATION POLICIES CONTROLLERS */
const EscalationPolicy = require('../models/EscalationPolicy')

const defaultEscalationPolicies = [
  {
    name: 'Critical Infrastructure Outage Policy',
    severity: 'critical',
    enabled: true,
    levels: [
      {
        level: 1,
        delayMinutes: 0,
        channels: ['bell', 'toast', 'slack'],
        contacts: ['oncall-engineer@company.com']
      },
      {
        level: 2,
        delayMinutes: 5,
        channels: ['teams', 'gmail'],
        contacts: ['devops-lead@company.com']
      },
      {
        level: 3,
        delayMinutes: 15,
        channels: ['outlook', 'webhook'],
        contacts: ['engineering-vp@company.com']
      }
    ]
  }
]

/* GET ESCALATION POLICIES */
const getEscalationPolicies = async (req, res) => {
  try {
    let policies = await EscalationPolicy.find()
    if (policies.length === 0) {
      policies = await EscalationPolicy.insertMany(defaultEscalationPolicies)
    }
    res.json(policies)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* CREATE ESCALATION POLICY */
const createEscalationPolicy = async (req, res) => {
  try {
    const policy = await EscalationPolicy.create(req.body)
    res.status(201).json(policy)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* UPDATE ESCALATION POLICY */
const updateEscalationPolicy = async (req, res) => {
  try {
    const policy = await EscalationPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!policy) {
      return res.status(404).json({ message: 'Escalation policy not found' })
    }
    res.json(policy)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/* DELETE ESCALATION POLICY */
const deleteEscalationPolicy = async (req, res) => {
  try {
    const policy = await EscalationPolicy.findByIdAndDelete(req.params.id)
    if (!policy) {
      return res.status(404).json({ message: 'Escalation policy not found' })
    }
    res.json({ message: 'Escalation policy deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
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
  triggerAlert,
  getEscalationPolicies,
  createEscalationPolicy,
  updateEscalationPolicy,
  deleteEscalationPolicy
}