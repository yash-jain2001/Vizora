const express = require('express')

const {
  createDatasource,
  getDatasources,
} = require('../controllers/datasourceController')

const router = express.Router()

router.post('/', createDatasource)

router.get('/', getDatasources)

module.exports = router