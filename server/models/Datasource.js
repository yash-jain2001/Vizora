
const mongoose = require('mongoose')

const datasourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    topic: {
      type: String,
      default: '',
    },

    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'Datasource',
  datasourceSchema
)