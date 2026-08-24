const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  room: { type: String, required: true },
  type: { type: String, required: true }, // 'light', 'thermostat', 'plug', 'fan', 'lock'
  status: { type: Boolean, default: false }, // true/false (on/off, locked/unlocked)
  value: { type: mongoose.Schema.Types.Mixed }, // brightness (0-100), temp (16-30), speed (1-3)
  power: { type: Number, default: 0 }, // Current power draw in Watts
}, { timestamps: true })

module.exports = mongoose.model('Device', DeviceSchema)
