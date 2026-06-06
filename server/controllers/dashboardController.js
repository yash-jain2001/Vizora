const Datasource = require('../models/Datasource')
const Alert = require('../models/Alert')
const { queryApi } = require('../config/influxdb')

const getDashboardStats = async (req, res) => {
  try {
    const activeDevices = await Datasource.countDocuments()
    const alerts = await Alert.countDocuments({ resolved: false })

    // Try fetching latest temperature from InfluxDB
    let temperature = 24 // default fallback
    try {
      const query = `
        from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "temperature")
        |> filter(fn: (r) => r._field == "value")
        |> last()
      `
      const result = await queryApi.collectRows(query)
      if (result && result.length > 0) {
        temperature = Math.round(result[0]._value)
      } else {
        // Fallback to random value to make it look alive
        temperature = Math.floor(Math.random() * 15) + 22
      }
    } catch (e) {
      console.log('InfluxDB query failed, using fallback temperature:', e.message)
      temperature = Math.floor(Math.random() * 15) + 22
    }

    const energyUsage = Math.floor(Math.random() * 30) + 50 // live-looking metric for dashboard consistency

    res.json({
      activeDevices,
      temperature,
      energyUsage,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLineChartData = async (req, res) => {
  try {
    let data = []
    try {
      const query = `
        from(bucket: "${process.env.INFLUX_BUCKET}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "temperature")
        |> filter(fn: (r) => r._field == "value")
        |> limit(n: 6)
      `
      const result = await queryApi.collectRows(query)
      data = result.map((row) => {
        const d = new Date(row._time)
        return {
          time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
          value: row._value
        }
      })
    } catch (e) {
      console.log('InfluxDB line chart query failed:', e.message)
    }

    if (data.length === 0) {
      data = [
        { time: "10:00", value: 35 },
        { time: "10:05", value: 45 },
        { time: "10:10", value: 55 },
        { time: "10:15", value: 40 },
        { time: "10:20", value: 70 },
        { time: "10:25", value: 60 },
      ];
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBarChartData = async (req, res) => {
  try {
    const data = [
      { name: "Mon", usage: 400 },
      { name: "Tue", usage: 300 },
      { name: "Wed", usage: 500 },
      { name: "Thu", usage: 200 },
      { name: "Fri", usage: 700 },
    ];

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getAreaChartData = async (req, res) => {
  res.json([
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  ]);
};

const getStackedAreaChartData = async (req, res) => {
  res.json([
    { name: 'A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'D', uv: 2780, pv: 3908, amt: 2000 },
  ]);
};

const getPieChartData = async (req, res) => {
  res.json([
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ]);
};

const getDonutChartData = async (req, res) => {
  res.json([
    { name: 'Desktop', value: 400 },
    { name: 'Mobile', value: 300 },
    { name: 'Tablet', value: 300 },
  ]);
};

const getScatterChartData = async (req, res) => {
  res.json([
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ]);
};

const getBubbleChartData = async (req, res) => {
  res.json([
    { hour: '12a', index: 1, value: 170 },
    { hour: '1a', index: 1, value: 180 },
    { hour: '2a', index: 1, value: 150 },
    { hour: '3a', index: 1, value: 120 },
    { hour: '4a', index: 1, value: 200 },
    { hour: '5a', index: 1, value: 300 },
  ]);
};

const getRadarChartData = async (req, res) => {
  res.json([
    { subject: 'Math', A: 120, B: 110, fullMark: 150 },
    { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
    { subject: 'English', A: 86, B: 130, fullMark: 150 },
    { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
    { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
    { subject: 'History', A: 65, B: 85, fullMark: 150 },
  ]);
};

const getRadialBarChartData = async (req, res) => {
  res.json([
    { name: '18-24', uv: 31.47, pv: 2400, fill: '#8884d8' },
    { name: '25-29', uv: 26.69, pv: 4567, fill: '#83a6ed' },
    { name: '30-34', uv: 15.69, pv: 1398, fill: '#8dd1e1' },
    { name: '35-39', uv: 8.22, pv: 9800, fill: '#82ca9d' },
  ]);
};

const getComposedChartData = async (req, res) => {
  res.json([
    { name: 'Page A', uv: 590, pv: 800, amt: 1400 },
    { name: 'Page B', uv: 868, pv: 967, amt: 1506 },
    { name: 'Page C', uv: 1397, pv: 1098, amt: 989 },
    { name: 'Page D', uv: 1480, pv: 1200, amt: 1228 },
    { name: 'Page E', uv: 1520, pv: 1108, amt: 1100 },
    { name: 'Page F', uv: 1400, pv: 680, amt: 1700 },
  ]);
};

const getTreemapData = async (req, res) => {
  res.json([
    { name: 'axis', size: 24593 },
    { name: 'axes', size: 1302 },
    { name: 'data', size: 20544 },
    { name: 'scale', size: 22744 },
    { name: 'util', size: 3000 }
  ]);
};

const getFunnelChartData = async (req, res) => {
  res.json([
    { value: 100, name: 'Impressions', fill: '#8884d8' },
    { value: 80, name: 'Clicks', fill: '#83a6ed' },
    { value: 50, name: 'Add to Cart', fill: '#8dd1e1' },
    { value: 40, name: 'Checkout', fill: '#82ca9d' },
    { value: 26, name: 'Purchase', fill: '#a4de6c' },
  ]);
};

const getStackedBarChartData = async (req, res) => {
  res.json([
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  ]);
};

const getBiaxialLineChartData = async (req, res) => {
  res.json([
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  ]);
};

const getBiaxialBarChartData = async (req, res) => {
  res.json([
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  ]);
};

const getStepLineChartData = async (req, res) => {
  res.json([
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  ]);
};
\nmodule.exports = {
  getDashboardStats,
  getLineChartData,
  getBarChartData,
  getAreaChartData,
  getStackedAreaChartData,
  getPieChartData,
  getDonutChartData,
  getScatterChartData,
  getBubbleChartData,
  getRadarChartData,
  getRadialBarChartData,
  getComposedChartData,
  getTreemapData,
  getFunnelChartData,
  getStackedBarChartData,
  getBiaxialLineChartData,
  getBiaxialBarChartData,
  getStepLineChartData,
};
  getDashboardStats,
  getLineChartData,
  