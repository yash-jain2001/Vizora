const express = require('express')

const {
  createDatasource,
  getDatasources,
  testDatasource,
  deleteDatasource,
} = require('../controllers/datasourceController')

const protect = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', createDatasource)

router.get('/', getDatasources)

router.post('/test', testDatasource)

router.delete('/:id', deleteDatasource)

module.exports = router