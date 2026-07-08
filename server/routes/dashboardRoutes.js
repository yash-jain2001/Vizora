const express = require('express')

const {
  getDashboardStats,
  getLineChartData,
  getBarChartData,
  getAreaChartData,
  getStackedAreaChartData,
  getPieChartData,
  getDonutChartData,
  getScatterChartData,
  getBubbleChartData,
  getRadarChartData,
  getRadialBarChartData,
  getComposedChartData,
  getTreemapData,
  getFunnelChartData,
  getStackedBarChartData,
  getBiaxialLineChartData,
  getBiaxialBarChartData,
  getStepLineChartData,
} = require('../controllers/dashboardController')

const { getWidgetData } = require('../controllers/widgetDataController')

const router = express.Router()

router.get('/stats', getDashboardStats)
router.get('/line-chart', getLineChartData)
router.get('/bar-chart', getBarChartData)
router.get('/area-chart', getAreaChartData)
router.get('/stacked-area-chart', getStackedAreaChartData)
router.get('/pie-chart', getPieChartData)
router.get('/donut-chart', getDonutChartData)
router.get('/scatter-chart', getScatterChartData)
router.get('/bubble-chart', getBubbleChartData)
router.get('/radar-chart', getRadarChartData)
router.get('/radial-bar-chart', getRadialBarChartData)
router.get('/composed-chart', getComposedChartData)
router.get('/treemap', getTreemapData)
router.get('/funnel-chart', getFunnelChartData)
router.get('/stacked-bar-chart', getStackedBarChartData)
router.get('/biaxial-line-chart', getBiaxialLineChartData)
router.get('/biaxial-bar-chart', getBiaxialBarChartData)
router.get('/step-line-chart', getStepLineChartData)
router.get('/widget-data/:type', getWidgetData)

module.exports = router