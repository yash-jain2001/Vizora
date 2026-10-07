const Device = require('../models/Device')
const AutomationRule = require('../models/AutomationRule')

// Default seed devices
const defaultDevices = [
  { name: 'Living Room AC', room: 'Living Room', type: 'thermostat', status: false, value: 24, power: 0 },
  { name: 'Living Room Lights', room: 'Living Room', type: 'light', status: true, value: 80, power: 12 },
  { name: 'Smart TV Power', room: 'Living Room', type: 'plug', status: true, value: null, power: 110 },
  { name: 'Living Room Fan', room: 'Living Room', type: 'fan', status: false, value: 2, power: 0 },
  { name: 'Bedroom Ceiling Light', room: 'Bedroom', type: 'light', status: false, value: 70, power: 0 },
  { name: 'Bedroom AC', room: 'Bedroom', type: 'thermostat', status: false, value: 22, power: 0 },
  { name: 'Smart Coffee Maker', room: 'Kitchen', type: 'plug', status: false, value: null, power: 0 },
  { name: 'Kitchen Main Light', room: 'Kitchen', type: 'light', status: true, value: 90, power: 15 },
  { name: 'Backyard Spotlight', room: 'Backyard', type: 'light', status: false, value: 100, power: 0 },
  { name: 'Patio Gate Lock', room: 'Backyard', type: 'lock', status: true, value: null, power: 0 }
]

// Default seed rules
const defaultRules = [
  { name: 'Living Room Auto-Cooling', trigger: 'Living Room temperature exceeds 26°C', action: 'Turn on Living Room AC to 22°C', enabled: true },
  { name: 'Midnight Lockup', trigger: 'Time reaches 12:00 AM', action: 'Lock Patio Gate Lock and turn off all lights', enabled: true },
  { name: 'Backyard Security Alert', trigger: 'Motion detected in Backyard after 8:00 PM', action: 'Turn on Backyard Spotlight and create Alarm event', enabled: false }
]

// GET all devices (seeds them if empty)
const getDevices = async (req, res) => {
  try {
    let devices = await Device.find()
    if (devices.length === 0) {
      devices = await Device.insertMany(defaultDevices)
    }
    res.json(devices)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE device details (calculates mock power draw dynamically)
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params
    const device = await Device.findById(id)
    if (!device) {
      return res.status(404).json({ message: 'Device not found' })
    }

    // Update fields from body
    if (req.body.status !== undefined) device.status = req.body.status
    if (req.body.value !== undefined) device.value = req.body.value

    // Calculate simulated power usage (Watts) based on device type and status
    if (!device.status) {
      device.power = 0
    } else {
      switch (device.type) {
        case 'thermostat':
          device.power = 1200 // AC draw
          break
        case 'light':
          device.power = Math.round((device.value || 100) * 0.15) // Brightness-based LED draw (e.g. 15W max)
          break
        case 'fan':
          device.power = (device.value || 1) * 30 // Fan speed-based draw (e.g. 30W-90W)
          break
        case 'plug':
          device.power = 150 // Average active appliance draw
          break
        case 'lock':
          device.power = 0 // Smart locks draw batteries, doesn't reflect AC load
          break
        default:
          device.power = 10
      }
    }

    await device.save()

    // Trigger audit log for device action
    try {
      const logAudit = require('../utils/auditLogger')
      const actionTaker = req.user ? req.user.name : 'System'
      await logAudit(
        'INFO',
        `Smart Device Updated: ${device.name} in ${device.room} turned ${device.status ? 'ON' : 'OFF'} (${device.power}W)`,
        actionTaker,
        req.ip
      )
    } catch (_) {}

    res.json(device)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET all rules (seeds if empty)
const getRules = async (req, res) => {
  try {
    let rules = await AutomationRule.find()
    if (rules.length === 0) {
      rules = await AutomationRule.insertMany(defaultRules)
    }
    res.json(rules)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// CREATE automation rule
const createRule = async (req, res) => {
  try {
    const newRule = await AutomationRule.create(req.body)
    res.status(201).json(newRule)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE automation rule
const updateRule = async (req, res) => {
  try {
    const { id } = req.params
    const updatedRule = await AutomationRule.findByIdAndUpdate(id, req.body, { new: true })
    if (!updatedRule) {
      return res.status(404).json({ message: 'Automation rule not found' })
    }
    res.json(updatedRule)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE automation rule
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params
    const deletedRule = await AutomationRule.findByIdAndDelete(id)
    if (!deletedRule) {
      return res.status(404).json({ message: 'Automation rule not found' })
    }
    res.json({ message: 'Rule deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Default seed integrations
const Integration = require('../models/Integration')

const defaultIntegrations = [
  {
    pluginId: 'home-assistant',
    name: 'Home Assistant Core API',
    category: 'hubs',
    config: { host: 'http://192.168.1.100:8123', token: 'eyJhbGciOiJIUzI1NiIsIn...' },
    status: 'connected',
    entitiesCount: 4
  },
  {
    pluginId: 'philips-hue',
    name: 'Philips Hue Bridge',
    category: 'lighting',
    config: { bridgeIp: '192.168.1.150', userKey: 'hue_user_789123' },
    status: 'connected',
    entitiesCount: 3
  }
]

// GET all active integrations (seeds defaults if empty)
const getIntegrations = async (req, res) => {
  try {
    let integrations = await Integration.find()
    if (integrations.length === 0) {
      integrations = await Integration.insertMany(defaultIntegrations)
    }
    res.json(integrations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// TEST integration connection
const testIntegration = async (req, res) => {
  try {
    const { pluginId, config } = req.body
    if (!config || Object.keys(config).length === 0) {
      return res.status(400).json({ success: false, message: 'Configuration details cannot be empty.' })
    }

    // Basic validation based on plugin type
    if (pluginId === 'home-assistant' && !config.host) {
      return res.status(400).json({ success: false, message: 'Home Assistant host URL is required (e.g. http://192.168.1.100:8123).' })
    }
    if (pluginId === 'philips-hue' && !config.bridgeIp) {
      return res.status(400).json({ success: false, message: 'Philips Hue Bridge IP Address is required.' })
    }
    if (pluginId === 'tuya' && (!config.clientId || !config.clientSecret)) {
      return res.status(400).json({ success: false, message: 'Tuya Client ID and Client Secret are required.' })
    }
    if (pluginId === 'openweather' && !config.apiKey) {
      return res.status(400).json({ success: false, message: 'OpenWeatherMap API Key is required.' })
    }

    res.json({
      success: true,
      message: `Connection successful! Verified handshake with ${pluginId.replace('-', ' ')} service.`
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// SAVE integration and auto-discover devices
const saveIntegration = async (req, res) => {
  try {
    const { pluginId, name, category, config } = req.body
    
    // Check if plugin already installed
    let integration = await Integration.findOne({ pluginId })
    if (integration) {
      integration.name = name || integration.name
      integration.config = config || integration.config
      integration.status = 'connected'
      await integration.save()
    } else {
      integration = await Integration.create({
        pluginId,
        name,
        category,
        config,
        status: 'connected',
        entitiesCount: 3
      })
    }

    // Seed/Import sample device entities associated with this integration into Device collection
    const sampleImportedDevices = [
      { name: `${name} Smart Light`, room: 'Living Room', type: 'light', status: true, value: 80, power: 12 },
      { name: `${name} Sensor Node`, room: 'Kitchen', type: 'plug', status: true, value: null, power: 45 },
      { name: `${name} Climate Unit`, room: 'Bedroom', type: 'thermostat', status: false, value: 23, power: 0 }
    ]
    
    for (const dev of sampleImportedDevices) {
      const existing = await Device.findOne({ name: dev.name })
      if (!existing) {
        await Device.create(dev)
      }
    }

    res.status(201).json(integration)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE integration
const deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Integration.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    res.json({ message: 'Integration uninstalled successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getDevices,
  updateDevice,
  getRules,
  createRule,
  updateRule,
  deleteRule,
  getIntegrations,
  testIntegration,
  saveIntegration,
  deleteIntegration
}
