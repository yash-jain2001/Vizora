const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Dashboard = require('../models/Dashboard')
const Datasource = require('../models/Datasource')
const Alert = require('../models/Alert')
const Setting = require('../models/Setting')
const AuditLog = require('../models/AuditLog')
const logAudit = require('../utils/auditLogger')

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add user manually by admin
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    const creatorName = req.user ? req.user.name : 'Admin'
    await logAudit(
      'INFO',
      `Admin created user: ${email} with role: ${role}`,
      creatorName,
      req.ip
    )

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!role) {
      return res.status(400).json({ message: 'Role is required' })
    }

    const targetUser = await User.findById(id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const oldRole = targetUser.role
    targetUser.role = role
    await targetUser.save()

    const adminName = req.user ? req.user.name : 'Admin'
    await logAudit(
      'CONFIG',
      `Role changed for ${targetUser.email} from ${oldRole} to ${role}`,
      adminName,
      req.ip
    )

    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const targetUser = await User.findById(id)
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Prevent deleting oneself
    if (req.user && req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot delete your own account' })
    }

    await User.findByIdAndDelete(id)

    const adminName = req.user ? req.user.name : 'Admin'
    await logAudit(
      'WARN',
      `Deleted user account: ${targetUser.email}`,
      adminName,
      req.ip
    )

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get system metrics/statistics
const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const dashboardCount = await Dashboard.countDocuments()
    const datasourceCount = await Datasource.countDocuments()
    const activeAlerts = await Alert.countDocuments({ resolved: false })

    res.json({
      users: userCount,
      dashboards: dashboardCount,
      datasources: datasourceCount,
      activeAlerts: activeAlerts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get system configurations
const getSettings = async (req, res) => {
  try {
    const dbSettings = await Setting.find()
    const settingsObj = {}

    // Initialize defaults if they do not exist
    const defaults = {
      registrationEnabled: true,
      emailAlerts: false,
      socketEmits: true,
    }

    for (const key of Object.keys(defaults)) {
      const found = dbSettings.find((s) => s.key === key)
      if (found) {
        settingsObj[key] = found.value
      } else {
        // Create in DB
        const newSetting = await Setting.create({ key, value: defaults[key] })
        settingsObj[key] = newSetting.value
      }
    }

    res.json(settingsObj)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update specific setting key-value
const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body
    if (key === undefined || value === undefined) {
      return res.status(400).json({ message: 'Key and Value are required' })
    }

    let setting = await Setting.findOne({ key })
    if (setting) {
      setting.value = value
      await setting.save()
    } else {
      setting = await Setting.create({ key, value })
    }

    const adminName = req.user ? req.user.name : 'Admin'
    await logAudit(
      'CONFIG',
      `System configuration modified: ${key} = ${value}`,
      adminName,
      req.ip
    )

    res.json({ key: setting.key, value: setting.value })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get top 30 audit logs
const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(30)
    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUserRole,
  deleteUser,
  getStats,
  getSettings,
  updateSetting,
  getAuditLogs,
}
