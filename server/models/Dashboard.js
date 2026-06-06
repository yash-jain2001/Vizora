const mongoose = require('mongoose')

const dashboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    widgets: [
      {
        type: {
          type: String,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        x: {
          type: Number,
          default: 0,
        },

        y: {
          type: Number,
          default: 0,
        },

        w: {
          type: Number,
          default: 6,
        },

        h: {
          type: Number,
          default: 4,
        },

        datasourceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Datasource',
        },

        queryKey: {
          type: String,
          default: 'value',
        },
      },
    ],

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
  'Dashboard',
  dashboardSchema
)