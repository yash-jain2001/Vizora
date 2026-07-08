const express = require('express');
const router = express.Router();
const { getConfig, saveConfig, getErpData } = require('../controllers/erpController');
const protect = require('../middlewares/authMiddleware');

router.route('/config')
  .get(protect, getConfig)
  .post(protect, saveConfig);

router.route('/data')
  .get(protect, getErpData);

module.exports = router;
