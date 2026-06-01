const express = require('express')

const {
  createDatasource,
  getDatasources,
  testDatasource,
  deleteDatasource,
} = require('../controllers/datasourceController')

const router = express.Router()

router.post('/', createDatasource)

router.get('/', getDatasources)

router.post('/test', testDatasource)

router.delete('/:id', deleteDatasource)

module.exports = router