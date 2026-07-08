const getWidgetData = async (req, res) => {
  const { type } = req.params;

  // We provide a generic "jitter" multiplier to dynamically update numeric values
  // on the frontend for the 100+ different chart configurations without needing
  // 100 different hardcoded data structures.
  try {
    const factor = 1 + (Math.random() * 0.1 - 0.05); // +/- 5% change
    
    // For some specific charts we can provide specific data if requested later, 
    // but for now the generic factor will bring them all to life.
    res.json({
      type,
      factor,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWidgetData
};
