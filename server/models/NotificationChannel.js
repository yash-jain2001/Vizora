const mongoose = require('mongoose')

const notificationChannelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., 'DevOps Slack Channel', 'Admin Gmail Alerts'
    },
    type: {
      type: String,
      enum: ['slack', 'teams', 'discord', 'gmail', 'outlook', 'smtp'],
      required: true,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Stores webhookUrl, user, pass, recipients, etc.
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('NotificationChannel', notificationChannelSchema)
