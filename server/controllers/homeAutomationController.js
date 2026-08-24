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

module.exports = {
  getDevices,
  updateDevice,
  getRules,
  createRule,
  updateRule,
  deleteRule
}
