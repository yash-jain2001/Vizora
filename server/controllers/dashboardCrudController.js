const Dashboard = require('../models/Dashboard')

/* CREATE DASHBOARD */
const createDashboard = async (
  req,
  res
) => {

  try {

    const dashboard =
      await Dashboard.create(req.body)

    const logAudit = require('../utils/auditLogger')
    const creatorName = req.user ? req.user.name : 'System'
    await logAudit(
      'INFO',
      `Dashboard created: ${dashboard.title}`,
      creatorName,
      req.ip
    )

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

/* UPDATE DASHBOARD */
const updateDashboard = async (req, res) => {
  try {
    const { title, widgets } = req.body;
    const dashboard = await Dashboard.findByIdAndUpdate(
      req.params.id,
      { title, widgets },
      { new: true, runValidators: true }
    );

    if (!dashboard) {
      return res.status(404).json({
        message: 'Dashboard not found',
      });
    }

    const logAudit = require('../utils/auditLogger')
    const updaterName = req.user ? req.user.name : 'System'
    await logAudit(
      'CONFIG',
      `Dashboard updated: ${dashboard.title}`,
      updaterName,
      req.ip
    )

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

/* DELETE DASHBOARD */
const deleteDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findByIdAndDelete(req.params.id);
    if (!dashboard) {
      return res.status(404).json({ message: 'Dashboard not found' });
    }

    const logAudit = require('../utils/auditLogger');
    const deleterName = req.user ? req.user.name : 'System';
    await logAudit(
      'WARN',
      `Dashboard deleted: ${dashboard.title}`,
      deleterName,
      req.ip
    );

    res.json({ message: 'Dashboard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createDashboard,
  getDashboards,
  getDashboardById,
  updateDashboard,
  deleteDashboard,
}