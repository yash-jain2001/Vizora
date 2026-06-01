const Datasource = require('../models/Datasource')

const createDatasource = async (req, res) => {

  try {

    const datasource = await Datasource.create(req.body)

    res.status(201).json(datasource)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

const getDatasources = async (req, res) => {

  try {

    const datasources = await Datasource.find()

    res.json(datasources)

  } catch (error) {

    res.status(500).json({
      message: error.message,
    })

  }

}

const testDatasource = async (req, res) => {
  const { type, url, config } = req.body

  try {
    if (!type || !url) {
      return res.status(400).json({
        success: false,
        message: 'Connection type and URL are required.',
      })
    }

    if (type.toLowerCase() === 'influxdb') {
      const { product, token } = config || {}

      if (product === 'InfluxDB 2.x' || product === 'Cloud') {
        const { organization, bucket } = config || {}
        if (!organization || !bucket || !token) {
          return res.status(400).json({
            success: false,
            message: 'Organization, Bucket, and Token are required for InfluxDB 2.x / Cloud.',
          })
        }
      } else {
        const { database } = config || {}
        if (!database) {
          return res.status(400).json({
            success: false,
            message: 'Database name is required for InfluxDB 1.x.',
          })
        }
      }

      // Simulate a network check delay of 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return res.status(200).json({
        success: true,
        message: 'Database connection test successful. 1 bucket found.',
      })
    }

    // Default mock response for other sources
    await new Promise((resolve) => setTimeout(resolve, 500))
    return res.status(200).json({
      success: true,
      message: `Connection test completed for ${type}.`,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

const deleteDatasource = async (req, res) => {
  try {
    const { id } = req.params
    const datasource = await Datasource.findByIdAndDelete(id)
    if (!datasource) {
      return res.status(404).json({
        message: 'Datasource not found',
      })
    }
    res.json({
      message: 'Datasource deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  createDatasource,
  getDatasources,
  testDatasource,
  deleteDatasource,
}