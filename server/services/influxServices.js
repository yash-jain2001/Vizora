const { Point } =
  require(
    '@influxdata/influxdb-client'
  )

const {
  writeApi,
} = require(
  '../config/influxdb'
)

const saveTemperature =
  async (
    temperature
  ) => {

    try {

      const point =
        new Point(
          'temperature'
        )
          .floatField(
            'value',
            temperature
          )

      writeApi.writePoint(
        point
      )

      await writeApi.flush()

    } catch (error) {

      console.log(error)

    }

  }

module.exports = {
  saveTemperature,
}