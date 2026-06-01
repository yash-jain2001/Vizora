const express =
  require('express')

const {
  getTemperatureHistory,
} = require(
  '../controllers/historyController'
)

const router =
  express.Router()

router.get(
  '/temperature',
  getTemperatureHistory
)

module.exports =
  router