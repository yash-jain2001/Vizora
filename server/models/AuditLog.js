const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ['INFO', 'WARN', 'CONFIG', 'ERROR'],
      default: 'INFO',
    },
    action: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      default: 'System',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('AuditLog', auditLogSchema)
