const mongoose = require('mongoose')

const alertRuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true, // e.g., 'Living Room AC', 'System CPU', 'Power Usage'
    },
    condition: {
      type: String,
      enum: ['gt', 'lt', 'eq'],
      default: 'gt',
    },
    threshold: {
      type: Number,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
    channels: {
      type: [String],
      default: ['bell', 'toast'], // Options: 'bell', 'toast', 'webhook', 'email'
    },
    webhookUrl: {
      type: String,
      default: '',
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

module.exports = mongoose.model('AlertRule', alertRuleSchema)
