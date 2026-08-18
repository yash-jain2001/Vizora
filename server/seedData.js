const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Datasource = require('./models/Datasource');
const Dashboard = require('./models/Dashboard');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // 1. CLEAR EXISTING DATA (Optional: comment out if you want to keep existing data)
    // await Datasource.deleteMany({});
    // await Dashboard.deleteMany({});
    // console.log('Existing datasources and dashboards cleared.');

    // 2. CREATE DATA SOURCES
    const influxDS = await Datasource.create({
      name: 'Primary InfluxDB',
      type: 'influxdb',
      url: process.env.INFLUX_URL || 'http://localhost:8086',
      config: {
        product: 'InfluxDB 2.x',
        queryLanguage: 'Flux',
        token: process.env.INFLUX_TOKEN || 'dummy-token',
        organization: process.env.INFLUX_ORG || 'vizora',
        bucket: process.env.INFLUX_BUCKET || 'sensordata',
      }
    });

    const mqttDS = await Datasource.create({
      name: 'Factory MQTT Stream',
      type: 'mqtt',
      url: 'mqtt://broker.emqx.io',
      topic: 'vizora/factory/telemetry',
      config: {
        product: 'EMQX Public Broker'
      }
    });

    const restDS = await Datasource.create({
      name: 'Public Weather API',
      type: 'rest',
      url: 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
      config: {
        valuePath: 'current_weather.temperature'
      }
    });

    console.log('Data Sources seeded successfully.');

    // 3. CREATE DASHBOARDS
    await Dashboard.create({
      title: 'Factory Overview',
      widgets: [
        {
          type: 'line-chart',
          title: 'Machine Temperature History',
          x: 0, y: 0, w: 8, h: 4,
          datasourceId: influxDS._id,
          queryKey: 'temperature',
          dataset: 'machine_1',
          refreshInterval: 10
        },
        {
          type: 'gauge-chart',
          title: 'Live MQTT Pressure',
          x: 8, y: 0, w: 4, h: 4,
          datasourceId: mqttDS._id,
          queryKey: 'pressure',
        }
      ]
    });

    await Dashboard.create({
      title: 'Environmental Monitoring',
      widgets: [
        {
          type: 'bar-chart',
          title: 'Weekly Humidity Trends',
          x: 0, y: 0, w: 6, h: 4,
          datasourceId: influxDS._id,
          queryKey: 'humidity',
          dataset: 'environment',
        },
        {
          type: 'value-stat',
          title: 'Current Weather (API)',
          x: 6, y: 0, w: 6, h: 4,
          datasourceId: restDS._id,
          refreshInterval: 30
        }
      ]
    });

    await Dashboard.create({
      title: 'Command Center',
      widgets: [
        {
          type: 'line-chart',
          title: 'Overall System Load',
          x: 0, y: 0, w: 12, h: 3,
          datasourceId: influxDS._id,
          queryKey: 'load',
        },
        {
          type: 'gauge-chart',
          title: 'Uptime Score',
          x: 0, y: 3, w: 4, h: 3,
          datasourceId: mqttDS._id,
          queryKey: 'uptime',
        },
        {
          type: 'bar-chart',
          title: 'Active Connections',
          x: 4, y: 3, w: 8, h: 3,
          datasourceId: restDS._id,
          queryKey: 'connections',
        }
      ]
    });

    console.log('Dashboards seeded successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
