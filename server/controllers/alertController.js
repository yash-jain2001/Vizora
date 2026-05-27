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

module.exports = {
  getAlerts,
}