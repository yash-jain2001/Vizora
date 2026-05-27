const express = require('express')

const {
  createDashboard,
  getDashboards,
  getDashboardById,
} = require(
  '../controllers/dashboardCrudController'
)

const router = express.Router()

router.post('/', createDashboard)

router.get('/', getDashboards)

router.get('/:id', getDashboardById)

module.exports = router