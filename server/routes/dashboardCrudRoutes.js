const express = require('express')

const {
  createDashboard,
  getDashboards,
} = require(
  '../controllers/dashboardCrudController'
)

const router = express.Router()

router.post('/', createDashboard)

router.get('/', getDashboards)

module.exports = router