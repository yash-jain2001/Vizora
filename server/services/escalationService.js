const Alert = require('../models/Alert')
const EscalationPolicy = require('../models/EscalationPolicy')
const { sendNotification, sendSlackNotification, sendTeamsNotification, sendDiscordNotification, sendEmailNotification } = require('./notificationService')
const logAudit = require('../utils/auditLogger')

/**
 * Periodically evaluate unacknowledged alerts against Escalation Policies
 */
const checkAndEscalateAlerts = async (io) => {
  try {
    const unacknowledgedAlerts = await Alert.find({ acknowledged: false, resolved: false })
    if (unacknowledgedAlerts.length === 0) return

    const policies = await EscalationPolicy.find({ enabled: true })
    const now = Date.now()

    for (const alert of unacknowledgedAlerts) {
      const elapsedMinutes = Math.floor((now - new Date(alert.createdAt).getTime()) / (1000 * 60))
      const matchingPolicy = policies.find(p => p.severity === alert.severity)

      if (!matchingPolicy || !matchingPolicy.levels || matchingPolicy.levels.length === 0) continue

      const currentEscalatedLevel = alert.escalatedLevel || 1

      for (const levelObj of matchingPolicy.levels) {
        // If elapsed time crossed delay threshold and alert hasn't reached this level yet
        if (levelObj.level > currentEscalatedLevel && elapsedMinutes >= levelObj.delayMinutes) {
          console.log(`[ESCALATION ENGINE] Escalating Alert "${alert.title}" to Level ${levelObj.level} (${elapsedMinutes}m elapsed)`)

          // Create escalated alert message
          const escalatedAlert = {
            _id: alert._id,
            title: `[ESCALATED L${levelObj.level}] ${alert.title}`,
            message: `UNACKNOWLEDGED FOR ${elapsedMinutes} MINS: ${alert.message}`,
            severity: alert.severity,
            value: alert.value,
            createdAt: alert.createdAt
          }

          // Dispatch across level channels
          if (io) {
            io.emit('new-alert', escalatedAlert)
            io.emit('alert-escalated', { alertId: alert._id, level: levelObj.level })
          }

          // Dispatch to assigned contacts via Email / Webhooks
          if (levelObj.contacts && levelObj.contacts.length > 0) {
            await sendEmailNotification(
              {
                service: 'gmail',
                user: 'alerts@vizora.io',
                pass: 'system_pass',
                recipients: levelObj.contacts
              },
              escalatedAlert
            )
          }

          // Update alert level state in database
          alert.escalatedLevel = levelObj.level
          await alert.save()

          // Log Audit Trail
          await logAudit(
            'WARNING',
            `Alert Escalated to Level ${levelObj.level}: ${alert.title} (${elapsedMinutes} mins unacknowledged)`,
            'EscalationEngine',
            '127.0.0.1'
          )
        }
      }
    }
  } catch (error) {
    console.error('Error during escalation evaluation:', error.message)
  }
}

/**
 * Start background timer worker
 */
const initEscalationWorker = (io, intervalSeconds = 30) => {
  console.log(`[ESCALATION ENGINE] Background worker initialized (evaluating every ${intervalSeconds}s)...`)
  setInterval(() => {
    checkAndEscalateAlerts(io)
  }, intervalSeconds * 1000)
}

module.exports = {
  checkAndEscalateAlerts,
  initEscalationWorker
}
