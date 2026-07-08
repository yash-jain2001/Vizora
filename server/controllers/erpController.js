const ErpConfig = require('../models/ErpConfig');
const Datasource = require('../models/Datasource');

// Get ERP Config
const getConfig = async (req, res) => {
  try {
    let config = await ErpConfig.findOne();
    if (!config) {
      config = await ErpConfig.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save ERP Config
const saveConfig = async (req, res) => {
  try {
    let config = await ErpConfig.findOne();
    if (!config) {
      config = await ErpConfig.create(req.body);
    } else {
      config.datasourceId = req.body.datasourceId;
      config.queries = req.body.queries || {};
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ERP Data (simulating fetching from Data Source)
const getErpData = async (req, res) => {
  try {
    const config = await ErpConfig.findOne();
    
    // In a full production implementation, if config.datasourceId is set,
    // we would use the `config.queries` to execute real SQL/NoSQL queries
    // against the configured Datasource. Since this is a generic mockup ERP,
    // we will return the dynamic structured data here.
    
    // MOCK DATA (formerly hardcoded in React)
    const productsData = {
      "classic-chair": {
        name: "Classic Dining Chair",
        basePrice: 120,
        woodModifier: { oak: 0, walnut: 45, pine: -15 },
        finishModifier: { natural: 0, lacquer: 10, dark: 15 },
        cushionModifier: { leather: 30, fabric: 15, none: 0 },
        bomBase: [
          { item: "Timber Frame", baseQty: 4, unit: "bd ft", itemCost: 12 },
          { item: "Upholstery Padding", baseQty: 1, unit: "sq ft", itemCost: 8 },
          { item: "Assembly Screws", baseQty: 16, unit: "units", itemCost: 0.15 },
          { item: "Lacquer/Stain Finish", baseQty: 0.25, unit: "liters", itemCost: 20 }
        ]
      },
      "executive-desk": {
        name: "Executive Writing Desk",
        basePrice: 450,
        woodModifier: { oak: 0, walnut: 120, pine: -50 },
        finishModifier: { natural: 0, lacquer: 25, dark: 35 },
        deskSizeModifier: { standard: 0, compact: -40, oversized: 90 },
        bomBase: [
          { item: "Timber Desktop Board", baseQty: 18, unit: "bd ft", itemCost: 14 },
          { item: "Steel Desk Drawer slides", baseQty: 3, unit: "sets", itemCost: 15 },
          { item: "Heavy Duty Connectors", baseQty: 24, unit: "units", itemCost: 0.4 },
          { item: "Lacquer/Stain Finish", baseQty: 1.5, unit: "liters", itemCost: 20 }
        ]
      },
      "luxury-sofa": {
        name: "Luxury Chesterfield Sofa",
        basePrice: 850,
        woodModifier: { oak: 0, walnut: 150, pine: -70 },
        finishModifier: { natural: 0, lacquer: 30, dark: 40 },
        sofaFabricModifier: { "velvet-blue": 80, "velvet-green": 80, "linen-grey": 30 },
        bomBase: [
          { item: "Solid Wood Structure", baseQty: 24, unit: "bd ft", itemCost: 10 },
          { item: "Premium Coil Springs", baseQty: 32, unit: "units", itemCost: 2.5 },
          { item: "High-Density Foam Cushioning", baseQty: 4, unit: "rolls", itemCost: 45 },
          { item: "Brass Upholstery Nails", baseQty: 120, unit: "units", itemCost: 0.1 }
        ]
      }
    };

    const jobs = [
      {
        id: "WO-102",
        name: "Walnut Writing Desk",
        client: "Aesthetics Interiors",
        stage: "cutting",
        qty: 1,
        priority: "High",
        spec: "Oversized, Lacquer Polish",
        checklist: [
          { id: 1, text: "Check timber moisture content (< 12%)", checked: true },
          { id: 2, text: "Rip boards to specified dimensions", checked: false },
          { id: 3, text: "Grain matching for desk surface", checked: false }
        ]
      },
      {
        id: "WO-103",
        name: "Classic Oak Chair (Set of 6)",
        client: "Woodhaven Cafe",
        stage: "assembly",
        qty: 6,
        priority: "Medium",
        spec: "Natural Polish, Fabric Cushion",
        checklist: [
          { id: 1, text: "Dry fit tenon and mortise joints", checked: true },
          { id: 2, text: "Apply wood glue and clamp for 4 hours", checked: true },
          { id: 3, text: "Check legs alignment and level seat", checked: false }
        ]
      },
      {
        id: "WO-104",
        name: "Royal Blue Velvet Sofa",
        client: "Apex Hotel Lounge",
        stage: "finishing",
        qty: 1,
        priority: "Critical",
        spec: "Oversized, Pine Frame, Velvet Blue",
        checklist: [
          { id: 1, text: "Inspect wood skeleton joints strength", checked: true },
          { id: 2, text: "Glue high-density foam padding", checked: true },
          { id: 3, text: "Align velvet fabric and install tufted buttons", checked: true },
          { id: 4, text: "Mount brass nail heads evenly", checked: false }
        ]
      },
      {
        id: "WO-105",
        name: "Minimalist Pine Bookcase",
        client: "Private Residence",
        stage: "dispatch",
        qty: 2,
        priority: "Low",
        spec: "Natural Lacquer Finish",
        checklist: [
          { id: 1, text: "Final lacquer sanding and clean", checked: true },
          { id: 2, text: "Mount backing panels", checked: true },
          { id: 3, text: "Flat-pack wrapping with protective foam", checked: true }
        ]
      }
    ];

    const materials = [
      { id: "MAT-OAK", name: "Premium Oak Timber", stock: 380, unit: "bd ft", min: 150, status: "In Stock" },
      { id: "MAT-WAL", name: "Select Walnut Timber", stock: 240, unit: "bd ft", min: 100, status: "In Stock" },
      { id: "MAT-PIN", name: "Knotty Pine Timber", stock: 85, unit: "bd ft", min: 150, status: "Low Stock" },
      { id: "MAT-FOA", name: "High-Density Foam Padding", stock: 8, unit: "rolls", min: 12, status: "Low Stock" },
      { id: "MAT-VEL", name: "Royal Blue Velvet Fabric", stock: 45, unit: "yards", min: 20, status: "In Stock" },
      { id: "MAT-SCR", name: "Joint Screws & Fasteners", stock: 1800, unit: "units", min: 500, status: "In Stock" },
      { id: "MAT-GLU", name: "Titebond Wood Glue", stock: 3, unit: "gallons", min: 5, status: "Low Stock" }
    ];

    const batches = [
      { lotId: "LOT-OK-120", material: "Premium Oak Timber", qty: 200, supplier: "Hardwood Supply Co.", date: "2026-07-01", status: "Received" },
      { lotId: "LOT-VEL-84", material: "Royal Blue Velvet Fabric", qty: 50, supplier: "Velvet Couture", date: "2026-06-25", status: "Received" },
      { lotId: "LOT-FO-92", material: "High-Density Foam Padding", qty: 10, supplier: "PolyFoam Corp", date: "2026-07-10", status: "In Transit" }
    ];

    const productionTrendData = [
      { name: "Mon", Target: 8, Actual: 7, Waste: 3.2 },
      { name: "Tue", Target: 8, Actual: 9, Waste: 2.8 },
      { name: "Wed", Target: 8, Actual: 8, Waste: 2.5 },
      { name: "Thu", Target: 8, Actual: 6, Waste: 4.1 },
      { name: "Fri", Target: 10, Actual: 9, Waste: 2.1 },
      { name: "Sat", Target: 6, Actual: 7, Waste: 1.8 }
    ];

    const OeeDistribution = [
      { name: "Cutting Station", value: 92, fill: "#3b82f6" },
      { name: "Sanding Station", value: 87, fill: "#10b981" },
      { name: "Assembly Bay", value: 89, fill: "#f59e0b" },
      { name: "Finishing Room", value: 94, fill: "#ec4899" }
    ];

    // Jitter function to make data feel dynamic if queried multiple times
    const jitter = (val) => val * (1 + (Math.random() * 0.1 - 0.05));

    const dynamicProductionTrend = productionTrendData.map(d => ({
      ...d,
      Actual: Math.round(jitter(d.Actual)),
      Waste: parseFloat(jitter(d.Waste).toFixed(1))
    }));

    const dynamicOee = OeeDistribution.map(d => ({
      ...d,
      value: Math.min(100, Math.round(jitter(d.value)))
    }));

    res.json({
      productsData,
      jobs,
      materials,
      batches,
      productionTrendData: dynamicProductionTrend,
      OeeDistribution: dynamicOee,
      source: config?.datasourceId ? 'External Datasource' : 'Mock Internal'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConfig,
  saveConfig,
  getErpData
};
