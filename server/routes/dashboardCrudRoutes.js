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

const router = express.Router()

router.use(protect)

router.post('/', createDashboard)

router.get('/', getDashboards)

router.get('/:id', getDashboardById)

router.put('/:id', updateDashboard)

router.delete('/:id', deleteDashboard)

module.exports = router