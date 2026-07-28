const express = require('express')

const {
  createDashboard,
  getDashboards,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
} = require(
  '../controllers/dashboardCrudController'
)

const protect = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', authorizeRoles('admin'), createDashboard)

router.get('/', getDashboards)

router.get('/:id', getDashboardById)

router.put('/:id', authorizeRoles('admin', 'editor'), updateDashboard)

router.delete('/:id', authorizeRoles('admin'), deleteDashboard)

module.exports = router