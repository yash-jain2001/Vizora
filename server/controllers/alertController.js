const Alert = require('../models/Alert')

/* GET ALERTS */
const getAlerts = async (
  req,
  res
) => {

  try {

    const alerts =
      await Alert.find().sort({
        createdAt: -1,
      })

    res.json(alerts)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

/* ACKNOWLEDGE ALERT */
const acknowledgeAlert =
  async (req, res) => {

    try {

      const alert =
        await Alert.findById(
          req.params.id
        )

      if (!alert) {

        return res.status(404).json({
          message:
            'Alert not found',
        })

      }

      alert.acknowledged = true

      await alert.save()

      res.json(alert)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

/* RESOLVE ALERT */
const resolveAlert =
  async (req, res) => {

    try {

      const alert =
        await Alert.findById(
          req.params.id
        )

      if (!alert) {

        return res.status(404).json({
          message:
            'Alert not found',
        })

      }

      alert.resolved = true

      alert.resolvedAt =
        new Date()

      await alert.save()

      res.json(alert)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

module.exports = {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
}