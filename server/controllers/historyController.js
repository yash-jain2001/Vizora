const {
  queryApi,
} = require('../config/influxdb')

const getTemperatureHistory =
  async (req, res) => {

    try {

      const range =
        req.query.range || '-1h'

      const rows = []

      const query = `
        from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: ${range})
        |> filter(fn: (r) => r._measurement == "temperature")
        |> filter(fn: (r) => r._field == "value")
      `

      const result =
        await queryApi.collectRows(
          query
        )

      result.forEach((row) => {

        rows.push({
          time: row._time,
          value: row._value,
        })

      })

      res.json(rows)

    } catch (error) {

      console.error(error)

      res.status(500).json({
        message: error.message,
      })

    }

  }

module.exports = {
  getTemperatureHistory,
}