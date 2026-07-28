const express = require('express')

const {
  createDatasource,
  getDatasources,
  testDatasource,
  deleteDatasource,
} = require('../controllers/datasourceController')

const protect = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

const router = express.Router()

router.use(protect)

router.post('/', authorizeRoles('admin'), createDatasource)

router.get('/', getDatasources)

router.post('/test', authorizeRoles('admin'), testDatasource)

router.delete('/:id', authorizeRoles('admin'), deleteDatasource)

module.exports = router