const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      activeDevices: 128,
      temperature: 34,
      energyUsage: 74,
      alerts: 3,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getLineChartData = async (req, res) => {
  try {
    const data = [
      { time: "10:00", value: 35 },
      { time: "10:05", value: 45 },
      { time: "10:10", value: 95 },
      { time: "10:15", value: 40 },
      { time: "10:20", value: 70 },
      { time: "10:25", value: 60 },
    ];

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

module.exports = {
  getDashboardStats,
  getLineChartData,
  getBarChartData,
};
