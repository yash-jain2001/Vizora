const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: [
        'low',
        'medium',
        'high',
      ],
      default: 'medium',
    },

    value: {
      type: Number,
      required: true,
    },

    acknowledged: {
      type: Boolean,
      default: false,
    },

    resolved: {
      type: Boolean,
      default: false,
    },

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'Alert',
  alertSchema
)