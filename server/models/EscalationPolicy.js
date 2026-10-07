const mongoose = require('mongoose')

const escalationLevelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true, // 1, 2, 3
  },
  delayMinutes: {
    type: Number,
    required: true, // e.g. 0 for L1, 5 for L2, 15 for L3
  },
  channels: {
    type: [String],
    default: ['bell', 'slack'], // Options: 'bell', 'toast', 'slack', 'teams', 'discord', 'gmail', 'outlook'
  },
  contacts: {
    type: [String],
    default: [], // Email addresses or Slack user handles
  },
})

const escalationPolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g. 'Critical Infrastructure Outage Policy'
    },
    severity: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'critical',
    },
    levels: [escalationLevelSchema],
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('EscalationPolicy', escalationPolicySchema)
