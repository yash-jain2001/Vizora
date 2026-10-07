const Alert = require('../models/Alert')
const AlertRule = require('../models/AlertRule')
const NotificationChannel = require('../models/NotificationChannel')
const logAudit = require('../utils/auditLogger')
const nodemailer = require('nodemailer')

/**
 * Dispatch Slack Webhook Notification
 */
const sendSlackNotification = async (webhookUrl, alert) => {
  if (!webhookUrl) return
  try {
    const http = webhookUrl.startsWith('https') ? require('https') : require('http')
    const color = alert.severity === 'critical' ? '#EF4444' : alert.severity === 'high' ? '#F59E0B' : '#3B82F6'
    
    const payload = JSON.stringify({
      attachments: [
        {
          color,
          title: `🚨 [Vizora Alert - ${alert.severity.toUpperCase()}] ${alert.title}`,
          text: alert.message,
          fields: [
            { title: 'Severity', value: alert.severity.toUpperCase(), short: true },
            { title: 'Metric Value', value: String(alert.value), short: true }
          ],
          ts: Math.floor(Date.now() / 1000)
        }
      ]
    })

    const urlObj = new URL(webhookUrl)
    const req = http.request(urlObj, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    })
    req.on('error', (e) => console.error('Slack Webhook error:', e.message))
    req.write(payload)
    req.end()
  } catch (err) {
    console.error('Slack Webhook exception:', err.message)
  }
}

/**
 * Dispatch Microsoft Teams Webhook Notification (MessageCard / Adaptive Card)
 */
const sendTeamsNotification = async (webhookUrl, alert) => {
  if (!webhookUrl) return
  try {
    const http = webhookUrl.startsWith('https') ? require('https') : require('http')
    const themeColor = alert.severity === 'critical' ? 'EF4444' : alert.severity === 'high' ? 'F59E0B' : '3B82F6'
    
    const payload = JSON.stringify({
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor,
      summary: alert.title,
      sections: [
        {
          activityTitle: `🚨 [Vizora Alert] ${alert.title}`,
          activitySubtitle: `Severity: ${alert.severity.toUpperCase()} • Metric: ${alert.value}`,
          text: alert.message,
          markdown: true
        }
      ]
    })

    const urlObj = new URL(webhookUrl)
    const req = http.request(urlObj, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    })
    req.on('error', (e) => console.error('Teams Webhook error:', e.message))
    req.write(payload)
    req.end()
  } catch (err) {
    console.error('Teams Webhook exception:', err.message)
  }
}

/**
 * Dispatch Discord Webhook Notification
 */
const sendDiscordNotification = async (webhookUrl, alert) => {
  if (!webhookUrl) return
  try {
    const http = webhookUrl.startsWith('https') ? require('https') : require('http')
    const color = alert.severity === 'critical' ? 15684420 : alert.severity === 'high' ? 16097035 : 3900150
    
    const payload = JSON.stringify({
      embeds: [
        {
          title: `🚨 [Vizora Alert - ${alert.severity.toUpperCase()}] ${alert.title}`,
          description: alert.message,
          color,
          fields: [
            { name: 'Metric Value', value: String(alert.value), inline: true },
            { name: 'Severity', value: alert.severity.toUpperCase(), inline: true }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    })

    const urlObj = new URL(webhookUrl)
    const req = http.request(urlObj, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    })
    req.on('error', (e) => console.error('Discord Webhook error:', e.message))
    req.write(payload)
    req.end()
  } catch (err) {
    console.error('Discord Webhook exception:', err.message)
  }
}

/**
 * Dispatch Email Notification (Gmail, Outlook, Custom SMTP) via Nodemailer
 */
const sendEmailNotification = async (emailConfig, alert) => {
  if (!emailConfig || !emailConfig.user || !emailConfig.recipients) return
  try {
    let transportOptions = {}
    
    if (emailConfig.type === 'gmail' || emailConfig.service === 'gmail') {
      transportOptions = {
        service: 'gmail',
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
        }
      }
    } else if (emailConfig.type === 'outlook' || emailConfig.service === 'outlook') {
      transportOptions = {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
        },
        tls: {
          ciphers: 'SSLv3'
        }
      }
    } else {
      // Custom SMTP
      transportOptions = {
        host: emailConfig.smtpHost || 'smtp.gmail.com',
        port: emailConfig.smtpPort || 587,
        secure: emailConfig.secure || false,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass
        }
      }
    }

    const transporter = nodemailer.createTransport(transportOptions)

    const recipientList = Array.isArray(emailConfig.recipients)
      ? emailConfig.recipients.join(',')
      : emailConfig.recipients

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 24px; borderRadius: 16px;">
        <h2 style="color: ${alert.severity === 'critical' ? '#ef4444' : '#f59e0b'}; font-size: 20px;">
          🚨 [Vizora Alert - ${alert.severity.toUpperCase()}] ${alert.title}
        </h2>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">${alert.message}</p>
        <hr style="border: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <div style="font-size: 12px; color: #94a3b8;">
          <p><strong>Metric Value:</strong> ${alert.value}</p>
          <p><strong>Triggered Time:</strong> ${new Date(alert.createdAt || Date.now()).toLocaleString()}</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"Vizora Notifications" <${emailConfig.user}>`,
      to: recipientList,
      subject: `[Vizora Alert - ${alert.severity.toUpperCase()}] ${alert.title}`,
      html: htmlBody
    })

    console.log(`Email dispatched successfully to ${recipientList}`)
  } catch (err) {
    console.error('Email dispatch error:', err.message)
  }
}

/**
 * Dispatch notification across active database channels and Socket.IO
 */
const sendNotification = async (io, alert, channels = ['bell', 'toast'], webhookUrl = '') => {
  try {
    // 1. Emit live Socket.IO event to all connected browser clients
    if (io) {
      io.emit('new-alert', alert)
    }

    // 2. Legacy direct webhook if passed
    if (webhookUrl) {
      sendSlackNotification(webhookUrl, alert)
    }

    // 3. Dispatch to all active database NotificationChannels
    const activeChannels = await NotificationChannel.find({ enabled: true })
    for (const ch of activeChannels) {
      if (ch.type === 'slack') {
        sendSlackNotification(ch.config.webhookUrl, alert)
      } else if (ch.type === 'teams') {
        sendTeamsNotification(ch.config.webhookUrl, alert)
      } else if (ch.type === 'discord') {
        sendDiscordNotification(ch.config.webhookUrl, alert)
      } else if (ch.type === 'gmail' || ch.type === 'outlook' || ch.type === 'smtp') {
        sendEmailNotification({ ...ch.config, type: ch.type }, alert)
      }
    }

    // 4. Log Audit Trail
    await logAudit(
      alert.severity === 'critical' || alert.severity === 'high' ? 'WARNING' : 'INFO',
      `Multi-Channel Alert Dispatched [${alert.severity.toUpperCase()}]: ${alert.title}`,
      'NotificationEngine',
      '127.0.0.1'
    )
  } catch (error) {
    console.error('Failed to dispatch notification:', error.message)
  }
}

/**
 * Evaluate incoming metric value against database AlertRules
 */
const evaluateDataPoint = async (io, target, value) => {
  try {
    const rules = await AlertRule.find({ target, enabled: true })

    for (const rule of rules) {
      let triggered = false
      if (rule.condition === 'gt' && value > rule.threshold) triggered = true
      if (rule.condition === 'lt' && value < rule.threshold) triggered = true
      if (rule.condition === 'eq' && value === rule.threshold) triggered = true

      if (triggered) {
        const newAlert = await Alert.create({
          title: rule.name,
          message: `${rule.target} recorded value ${value} (Threshold ${rule.condition} ${rule.threshold})`,
          severity: rule.severity,
          value,
          acknowledged: false,
          resolved: false
        })

        await sendNotification(io, newAlert, rule.channels, rule.webhookUrl)
      }
    }
  } catch (error) {
    console.error('Error evaluating alert rules:', error.message)
  }
}

module.exports = {
  sendSlackNotification,
  sendTeamsNotification,
  sendDiscordNotification,
  sendEmailNotification,
  sendNotification,
  evaluateDataPoint
}
