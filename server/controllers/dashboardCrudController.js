const Dashboard = require('../models/Dashboard')

/* CREATE DASHBOARD */
const createDashboard = async (
  req,
  res
) => {

  try {

    const dashboard =
      await Dashboard.create(req.body)

    res.status(201).json(
      dashboard
    )

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

/* GET ALL DASHBOARDS */
const getDashboards = async (
  req,
  res
) => {

  try {

    const dashboards =
      await Dashboard.find()

    res.json(dashboards)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

/* GET SINGLE DASHBOARD */
const getDashboardById =
  async (req, res) => {

    try {

      const dashboard =
        await Dashboard.findById(
          req.params.id
        )

      if (!dashboard) {

        return res.status(404).json({
          message:
            'Dashboard not found',
        })

      }

      res.json(dashboard)

    } catch (error) {

      res.status(500).json({
        message: error.message,
      })

    }

  }

module.exports = {
  createDashboard,
  getDashboards,
  getDashboardById,
}