const express = require('express')

const {
  getDashboardStats,
  getLineChartData,
  getBarChartData,
} = require('../controllers/dashboardController')

const router = express.Router()

router.get('/stats', getDashboardStats)

router.get('/line-chart', getLineChartData)

router.get('/bar-chart', getBarChartData)

module.exports = router