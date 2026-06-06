const express = require('express')
const {
  getUsers,
  addUser,
  updateUserRole,
  deleteUser,
  getStats,
  getSettings,
  updateSetting,
  getAuditLogs,
} = require('../controllers/adminController')

const protect = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

const router = express.Router()

// Secure all admin routes with auth and admin role requirements
router.use(protect)
router.use(authorizeRoles('admin'))

router.get('/users', getUsers)
router.post('/users', addUser)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)
router.get('/stats', getStats)
router.get('/settings', getSettings)
router.put('/settings', updateSetting)
router.get('/logs', getAuditLogs)

module.exports = router
