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