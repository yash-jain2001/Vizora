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

      const msg = error.errors ? error.errors[0].code : error.message;
      console.log('InfluxDB write failed:', msg)

    }

  }

const saveMetric =
  async (
    measurement,
    field,
    value
  ) => {

    try {

      const point =
        new Point(
          measurement
        )
          .floatField(
            field,
            Number(value)
          )

      writeApi.writePoint(
        point
      )

      await writeApi.flush()

    } catch (error) {

      const msg = error.errors ? error.errors[0].code : error.message;
      console.log('InfluxDB write failed:', msg)

    }

  }

module.exports = {
  saveTemperature,
  saveMetric,
}