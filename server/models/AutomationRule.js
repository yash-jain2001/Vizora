const mongoose = require('mongoose')

const AutomationRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trigger: { type: String, required: true },
  action: { type: String, required: true },
  enabled: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('AutomationRule', AutomationRuleSchema)
