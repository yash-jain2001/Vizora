const mongoose = require('mongoose')

const IntegrationSchema = new mongoose.Schema({
  pluginId: { type: String, required: true }, // e.g. 'home-assistant', 'philips-hue', 'tuya', 'shelly', etc.
  name: { type: String, required: true }, // e.g. 'Home Assistant Core WebSocket', 'Living Room Hue Bridge'
  category: { type: String, required: true }, // 'hubs', 'lighting', 'climate', 'security', 'media', 'weather'
  config: { type: mongoose.Schema.Types.Mixed, default: {} }, // Host IP, Access Token, Client ID, API Key
  status: { type: String, enum: ['connected', 'syncing', 'error', 'disabled'], default: 'connected' },
  entitiesCount: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Integration', IntegrationSchema)
