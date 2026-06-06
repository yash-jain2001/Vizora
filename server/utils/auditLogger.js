const AuditLog = require('../models/AuditLog')

const logAudit = async (level, action, user = 'System', ip = '127.0.0.1') => {
  try {
    await AuditLog.create({
      level,
      action,
      user,
      ip,
    })
  } catch (error) {
    console.error('Audit Log writing failed:', error.message)
  }
}

module.exports = logAudit
