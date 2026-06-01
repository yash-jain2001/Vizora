const {
  queryApi,
} = require(
  '../config/influxdb'
)

const getTemperatureHistory =
  async (
    req,
    res
  ) => {

    try {

      const rows = []

      const query = `
      from(bucket:"sensordata")
      |> range(start:-1h)
      `

      await queryApi.collectRows(
        query
      )
        .then(
          (data) => {

            data.forEach(
              (row) =>
                rows.push(
                  row
                )
            )

          }
        )

      res.json(rows)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })

    }

  }

module.exports = {
  getTemperatureHistory,
}