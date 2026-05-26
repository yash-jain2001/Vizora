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

module.exports = {
  createDatasource,
  getDatasources,
}