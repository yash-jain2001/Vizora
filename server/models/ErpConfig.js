const mongoose = require('mongoose');

const ErpConfigSchema = new mongoose.Schema({
  datasourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Datasource', required: false },
  queries: {
    jobsQuery: { type: String, default: '' },
    materialsQuery: { type: String, default: '' },
    batchesQuery: { type: String, default: '' },
    productionTrendQuery: { type: String, default: '' },
    oeeQuery: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('ErpConfig', ErpConfigSchema);
