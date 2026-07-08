import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";

const DesignForge = () => {
  const [activeTab, setActiveTab] = useState("mission-control");

  // --- BOM CONFIGURATOR STATE & DATA ---
  const [selectedProduct, setSelectedProduct] = useState("classic-chair");
  const [woodType, setWoodType] = useState("oak");
  const [finishType, setFinishType] = useState("natural");
  const [cushionType, setCushionType] = useState("leather");
  const [deskSize, setDeskSize] = useState("standard");
  const [sofaFabric, setSofaFabric] = useState("velvet-blue");

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

  const getBOMCost = () => {
    const data = productsData[selectedProduct];
    let materialCost = 0;
    
    // Calculate materials
    data.bomBase.forEach(item => {
      let multiplier = 1;
      if (selectedProduct === "executive-desk" && deskSize === "compact") multiplier = 0.8;
      if (selectedProduct === "executive-desk" && deskSize === "oversized") multiplier = 1.3;
      if (selectedProduct === "classic-chair" && cushionType === "none" && item.item === "Upholstery Padding") multiplier = 0;

      materialCost += item.baseQty * multiplier * item.itemCost;
    });

    // Add wood markup
    let woodCost = 0;
    if (woodType === "walnut") woodCost = 50;
    if (woodType === "pine") woodCost = -20;
    
    // Add cushions/fabric markup
    let cushionCost = 0;
    if (selectedProduct === "classic-chair") {
      if (cushionType === "leather") cushionCost = 30;
      if (cushionType === "fabric") cushionCost = 15;
    } else if (selectedProduct === "luxury-sofa") {
      if (sofaFabric.startsWith("velvet")) cushionCost = 90;
      else cushionCost = 45;
    }

    return parseFloat((materialCost + woodCost + cushionCost).toFixed(2));
  };

  const getLaborCost = () => {
    let baseLabor = 40;
    if (selectedProduct === "executive-desk") baseLabor = 120;
    if (selectedProduct === "luxury-sofa") baseLabor = 280;

    // Walnut takes longer to sand and finish
    if (woodType === "walnut") baseLabor += 25;
    if (finishType === "lacquer") baseLabor += 15;
    
    return baseLabor;
  };

  const getTotalCost = () => {
    return parseFloat((getBOMCost() + getLaborCost()).toFixed(2));
  };

  // --- KANBAN SHOP FLOOR STATE & DATA ---
  const [jobs, setJobs] = useState([
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
  ]);

  const [activeJobDetail, setActiveJobDetail] = useState(null);

  const moveJob = (jobId, direction) => {
    const stages = ["cutting", "assembly", "finishing", "dispatch"];
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          const currentIndex = stages.indexOf(job.stage);
          let newIndex = currentIndex + direction;
          if (newIndex >= 0 && newIndex < stages.length) {
            return { ...job, stage: stages[newIndex] };
          }
        }
        return job;
      })
    );
  };

  const toggleChecklist = (jobId, checklistId) => {
    setJobs(prevJobs =>
      prevJobs.map(job => {
        if (job.id === jobId) {
          return {
            ...job,
            checklist: job.checklist.map(item =>
              item.id === checklistId ? { ...item, checked: !item.checked } : item
            )
          };
        }
        return job;
      })
    );
    // Sync active modal detail if open
    if (activeJobDetail && activeJobDetail.id === jobId) {
      setActiveJobDetail(prev => ({
        ...prev,
        checklist: prev.checklist.map(item =>
          item.id === checklistId ? { ...item, checked: !item.checked } : item
        )
      }));
    }
  };

  // --- INVENTORY & BATCH STATE ---
  const [materials, setMaterials] = useState([
    { id: "MAT-OAK", name: "Premium Oak Timber", stock: 380, unit: "bd ft", min: 150, status: "In Stock" },
    { id: "MAT-WAL", name: "Select Walnut Timber", stock: 240, unit: "bd ft", min: 100, status: "In Stock" },
    { id: "MAT-PIN", name: "Knotty Pine Timber", stock: 85, unit: "bd ft", min: 150, status: "Low Stock" },
    { id: "MAT-FOA", name: "High-Density Foam Padding", stock: 8, unit: "rolls", min: 12, status: "Low Stock" },
    { id: "MAT-VEL", name: "Royal Blue Velvet Fabric", stock: 45, unit: "yards", min: 20, status: "In Stock" },
    { id: "MAT-SCR", name: "Joint Screws & Fasteners", stock: 1800, unit: "units", min: 500, status: "In Stock" },
    { id: "MAT-GLU", name: "Titebond Wood Glue", stock: 3, unit: "gallons", min: 5, status: "Low Stock" }
  ]);

  const [batches, setBatches] = useState([
    { lotId: "LOT-OK-120", material: "Premium Oak Timber", qty: 200, supplier: "Hardwood Supply Co.", date: "2026-07-01", status: "Received" },
    { lotId: "LOT-VEL-84", material: "Royal Blue Velvet Fabric", qty: 50, supplier: "Velvet Couture", date: "2026-06-25", status: "Received" },
    { lotId: "LOT-FO-92", material: "High-Density Foam Padding", qty: 10, supplier: "PolyFoam Corp", date: "2026-07-10", status: "In Transit" }
  ]);

  const restockMaterial = (id) => {
    setMaterials(prev =>
      prev.map(mat => {
        if (mat.id === id) {
          const addedStock = mat.unit === "units" ? 500 : mat.unit === "gallons" ? 5 : 50;
          return {
            ...mat,
            stock: mat.stock + addedStock,
            status: mat.stock + addedStock >= mat.min ? "In Stock" : "Low Stock"
          };
        }
        return mat;
      })
    );

    // Create a new batch entry
    const mat = materials.find(m => m.id === id);
    const newBatch = {
      lotId: `LOT-REF-${Math.floor(100 + Math.random() * 900)}`,
      material: mat.name,
      qty: mat.unit === "units" ? 500 : mat.unit === "gallons" ? 5 : 50,
      supplier: "Express Restock Vendor",
      date: new Date().toISOString().split("T")[0],
      status: "Received"
    };
    setBatches(prev => [newBatch, ...prev]);
  };

  // --- CHART DATA ---
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

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            DesignForge ERP
          </h1>
          <p className="text-slate-400 font-semibold text-sm">
            Interiors & Furniture Manufacturing Mission Control
          </p>
        </div>

        {/* TABS SWITCHEB */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 flex-wrap gap-1">
          {[
            { id: "mission-control", label: "Mission Control" },
            { id: "bom", label: "BOM Configurator" },
            { id: "shop-floor", label: "Shop Floor Kanban" },
            { id: "inventory", label: "Inventory & Batches" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveJobDetail(null);
              }}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------- TAB 1: MISSION CONTROL -------------------- */}
      {activeTab === "mission-control" && (
        <div className="flex flex-col gap-8 animate-fade-in">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Weekly Output Progress</span>
              <h3 className="text-3xl font-black text-white mt-2">46 / 50</h3>
              <p className="text-emerald-400 text-xs font-bold mt-1">92% of target reached</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
            
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Plant OEE Average</span>
              <h3 className="text-3xl font-black text-white mt-2">90.5%</h3>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                All Workstations Active
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-3">Target threshold: &gt; 85%</p>
            </div>

            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Material Waste Rate</span>
              <h3 className="text-3xl font-black text-red-400 mt-2">2.74%</h3>
              <p className="text-slate-400 text-xs font-bold mt-1">Slight off-cut overhead (+0.2%)</p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-red-400 h-full rounded-full" style={{ width: "27%" }}></div>
              </div>
            </div>

            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Shop Floor Jobs</span>
              <h3 className="text-3xl font-black text-white mt-2">{jobs.length} Orders</h3>
              <p className="text-amber-400 text-xs font-bold mt-1">1 Critical priority in finishing</p>
              <div className="flex gap-1.5 mt-3 select-none">
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase">1 Critical</span>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase">2 High</span>
              </div>
            </div>
          </div>

          {/* CHARTS CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Target vs Actual */}
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl lg:col-span-2 shadow-2xl flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Production Ingestion vs Target</h3>
                <p className="text-xs text-slate-400 mb-6">Daily comparative furniture items completed this week</p>
              </div>
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={productionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                    <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
                    <Line type="monotone" dataKey="Target" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* OEE Radial Breakdown */}
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">OEE Station Efficiency</h3>
                <p className="text-xs text-slate-400 mb-4">Availability & quality index breakdown</p>
              </div>
              <div className="w-full h-[220px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="85%" barSize={10} data={OeeDistribution}>
                    <RadialBar
                      minAngle={15}
                      background={{ fill: "rgba(255,255,255,0.03)" }}
                      clockWise
                      dataKey="value"
                    />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", color: "#fff", borderRadius: "8px" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 select-none">
                {OeeDistribution.map((st, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.fill }}></span>
                    <span>{st.name}: {st.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SHOP FLOOR SYSTEM ALERTS */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl select-none">
            <h3 className="text-lg font-bold text-white mb-4">Urgent Factory Floor Alerts</h3>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/15 text-red-400">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <div className="text-xs">
                    <p className="font-extrabold">Material Shortage: Knotty Pine Timber</p>
                    <p className="opacity-80 mt-0.5">Inventory has fallen below the safety threshold (85 bd ft left, min: 150 bd ft).</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                >
                  Restock
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/15 text-amber-400">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <div className="text-xs">
                    <p className="font-extrabold">Critical Quality Checklist Incomplete</p>
                    <p className="opacity-80 mt-0.5">Job order WO-104 (Velvet Sofa) has entered Finishing stage but still lacks nail installation check.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("shop-floor");
                    const j = jobs.find(job => job.id === "WO-104");
                    setActiveJobDetail(j);
                  }}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                >
                  View Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 2: BOM CONFIGURATOR -------------------- */}
      {activeTab === "bom" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* SELECTION PANEL */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 select-none lg:col-span-1">
            <div>
              <h3 className="text-lg font-bold text-white">BOM & Product Configurator</h3>
              <p className="text-xs text-slate-400 mt-1">Select templates and adjust properties to update manufacturing specs</p>
            </div>

            {/* Product Template */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Product Template</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "classic-chair", label: "Classic Dining Chair", icon: "🪑" },
                  { id: "executive-desk", label: "Executive Writing Desk", icon: "💻" },
                  { id: "luxury-sofa", label: "Luxury Chesterfield Sofa", icon: "🛋️" }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p.id);
                      setWoodType("oak");
                      setFinishType("natural");
                      setCushionType("leather");
                      setDeskSize("standard");
                      setSofaFabric("velvet-blue");
                    }}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      selectedProduct === p.id
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-slate-950/20 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-sm font-bold">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variant configuration */}
            <div className="border-t border-white/5 pt-6 flex flex-col gap-5">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">Variant Configurations</h4>

              {/* Common: Wood Type */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400">Timber Material</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
                  {[
                    { id: "oak", label: "Oak" },
                    { id: "walnut", label: "Walnut" },
                    { id: "pine", label: "Pine" }
                  ].map(w => (
                    <button
                      key={w.id}
                      onClick={() => setWoodType(w.id)}
                      className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all duration-150 ${
                        woodType === w.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Common: Polish/Finish */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400">Finish Polish</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
                  {[
                    { id: "natural", label: "Natural" },
                    { id: "lacquer", label: "Lacquer" },
                    { id: "dark", label: "Dark" }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFinishType(f.id)}
                      className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all duration-150 ${
                        finishType === f.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Configuration details */}
              {selectedProduct === "classic-chair" && (
                <div className="flex flex-col gap-2 animate-slide-down">
                  <label className="text-[11px] font-bold text-slate-400">Cushion Material</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
                    {[
                      { id: "leather", label: "Leather" },
                      { id: "fabric", label: "Fabric" },
                      { id: "none", label: "None" }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setCushionType(c.id)}
                        className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all duration-150 ${
                          cushionType === c.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct === "executive-desk" && (
                <div className="flex flex-col gap-2 animate-slide-down">
                  <label className="text-[11px] font-bold text-slate-400">Desk Dimensions</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
                    {[
                      { id: "compact", label: "Compact" },
                      { id: "standard", label: "Standard" },
                      { id: "oversized", label: "Oversized" }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setDeskSize(s.id)}
                        className={`py-1.5 rounded-lg text-xs font-bold text-center cursor-pointer transition-all duration-150 ${
                          deskSize === s.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct === "luxury-sofa" && (
                <div className="flex flex-col gap-2 animate-slide-down">
                  <label className="text-[11px] font-bold text-slate-400">Fabric Colorway</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-1 rounded-xl border border-white/5">
                    {[
                      { id: "velvet-blue", label: "Blue Velvet" },
                      { id: "velvet-green", label: "Green Velvet" },
                      { id: "linen-grey", label: "Grey Linen" }
                    ].map(fb => (
                      <button
                        key={fb.id}
                        onClick={() => setSofaFabric(fb.id)}
                        className={`py-1 rounded-lg text-[10px] font-bold text-center cursor-pointer transition-all duration-150 ${
                          sofaFabric === fb.id ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {fb.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOM DETAIL & LIVE COSTING */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* LIVE COST CARD */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Recalculated Cost Summary</span>
                <h3 className="text-2xl font-black text-white mt-1 capitalize">
                  {productsData[selectedProduct].name} Spec
                </h3>
                <div className="flex gap-2.5 mt-2 text-xs font-semibold text-slate-400 select-none">
                  <span className="capitalize">{woodType} Wood</span>
                  <span>•</span>
                  <span className="capitalize">{finishType} Polish</span>
                  {selectedProduct === "classic-chair" && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{cushionType} Cushion</span>
                    </>
                  )}
                  {selectedProduct === "executive-desk" && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{deskSize} Dimensions</span>
                    </>
                  )}
                  {selectedProduct === "luxury-sofa" && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{sofaFabric.replace("-", " ")}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Price Breakdown display */}
              <div className="flex gap-6 select-none bg-slate-950/40 px-6 py-4.5 rounded-2xl border border-white/5 justify-between">
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase mb-1">Material Cost</span>
                  <span className="text-md font-bold text-slate-200">${getBOMCost()}</span>
                </div>
                <div className="w-[1px] bg-white/5"></div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-500 block uppercase mb-1">Labor Cost</span>
                  <span className="text-md font-bold text-slate-200">${getLaborCost()}</span>
                </div>
                <div className="w-[1px] bg-white/5"></div>
                <div className="text-center">
                  <span className="text-[9px] font-bold text-emerald-400 block uppercase mb-1">Total cost</span>
                  <span className="text-lg font-black text-white">${getTotalCost()}</span>
                </div>
              </div>
            </div>

            {/* NESTED BOM LIST */}
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Bill of Materials Ingestion Tree</h3>
                <p className="text-xs text-slate-400 mb-6">Quantity and cost details allocated dynamically per unit production</p>
              </div>

              <div className="flex flex-col gap-3 select-none">
                {productsData[selectedProduct].bomBase.map((item, index) => {
                  let multiplier = 1;
                  if (selectedProduct === "executive-desk" && deskSize === "compact") multiplier = 0.8;
                  if (selectedProduct === "executive-desk" && deskSize === "oversized") multiplier = 1.3;
                  if (selectedProduct === "classic-chair" && cushionType === "none" && item.item === "Upholstery Padding") multiplier = 0;

                  const allocatedQty = parseFloat((item.baseQty * multiplier).toFixed(2));
                  const itemCostTotal = parseFloat((allocatedQty * item.itemCost).toFixed(2));

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/20 border border-white/5 hover:bg-slate-950/40 hover:border-emerald-500/10 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.item}</p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Unit cost: ${item.itemCost} / {item.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <span className="text-xs font-black text-slate-300">
                            {allocatedQty} {item.unit}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Allocated Qty</span>
                        </div>
                        <div className="min-w-16">
                          <span className="text-sm font-bold text-emerald-400">
                            ${itemCostTotal}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">Line cost</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ACTION: CREATE JOB CARD FROM CONFIG */}
              <div className="border-t border-white/5 pt-6 mt-6 flex justify-end">
                <button
                  onClick={() => {
                    const newId = `WO-${Math.floor(106 + Math.random() * 900)}`;
                    const pData = productsData[selectedProduct];
                    let specs = `${woodType} wood, ${finishType} finish`;
                    if (selectedProduct === "classic-chair") specs += `, ${cushionType} cushion`;
                    if (selectedProduct === "executive-desk") specs += `, ${deskSize} size`;
                    if (selectedProduct === "luxury-sofa") specs += `, ${sofaFabric}`;

                    const newJob = {
                      id: newId,
                      name: pData.name,
                      client: "Custom Order (ERP)",
                      stage: "cutting",
                      qty: 1,
                      priority: "Medium",
                      spec: specs,
                      checklist: pData.bomBase.map((b, i) => ({
                        id: i + 1,
                        text: `Verify ${b.item} specs & quality`,
                        checked: false
                      }))
                    };

                    setJobs(prev => [...prev, newJob]);
                    alert(`Created Work Order ${newId} and added to Shop Floor Cutting stage!`);
                    setActiveTab("shop-floor");
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 font-black text-xs uppercase px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Generate Work Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- TAB 3: SHOP FLOOR KANBAN -------------------- */}
      {activeTab === "shop-floor" && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {/* HEADER OPTIONS */}
          <div className="bg-brand-card/45 border border-white/5 p-4 rounded-3xl flex justify-between items-center select-none shadow-md">
            <div>
              <h3 className="text-md font-bold text-white">Active Shop Floor Job Cards</h3>
              <p className="text-xs text-slate-400">Advance items between workstations using slide buttons or view check-lists</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-slate-900 border border-white/5 px-3 py-1.5 rounded-xl text-xs text-slate-400 font-semibold">
                Total Jobs: {jobs.length}
              </span>
            </div>
          </div>

          {/* KANBAN BOARD ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* STAGE 1: CUTTING */}
            <div className="flex flex-col gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">1. Cutting & Prep</span>
                <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400">
                  {jobs.filter(j => j.stage === "cutting").length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {jobs.filter(j => j.stage === "cutting").map(job => (
                  <KanbanCard key={job.id} job={job} moveJob={moveJob} toggleDetail={setActiveJobDetail} />
                ))}
              </div>
            </div>

            {/* STAGE 2: ASSEMBLY */}
            <div className="flex flex-col gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">2. Assembly & Build</span>
                <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400">
                  {jobs.filter(j => j.stage === "assembly").length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {jobs.filter(j => j.stage === "assembly").map(job => (
                  <KanbanCard key={job.id} job={job} moveJob={moveJob} toggleDetail={setActiveJobDetail} />
                ))}
              </div>
            </div>

            {/* STAGE 3: FINISHING */}
            <div className="flex flex-col gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">3. Finishing & QC</span>
                <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400">
                  {jobs.filter(j => j.stage === "finishing").length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {jobs.filter(j => j.stage === "finishing").map(job => (
                  <KanbanCard key={job.id} job={job} moveJob={moveJob} toggleDetail={setActiveJobDetail} />
                ))}
              </div>
            </div>

            {/* STAGE 4: DISPATCH */}
            <div className="flex flex-col gap-4 bg-slate-950/20 p-4 rounded-2xl border border-white/5 min-h-[400px]">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">4. Dispatch Ready</span>
                <span className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400">
                  {jobs.filter(j => j.stage === "dispatch").length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {jobs.filter(j => j.stage === "dispatch").map(job => (
                  <KanbanCard key={job.id} job={job} moveJob={moveJob} toggleDetail={setActiveJobDetail} />
                ))}
              </div>
            </div>
          </div>

          {/* DETAIL MODAL PANEL */}
          {activeJobDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
              <div className="bg-brand-card border border-brand-border w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6">
                {/* Close button */}
                <button
                  onClick={() => setActiveJobDetail(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Job Card Specifications</span>
                  <div className="flex items-center gap-3 mt-1 select-none">
                    <h3 className="text-2xl font-black text-white">{activeJobDetail.name}</h3>
                    <span className="text-slate-400 text-sm font-semibold">({activeJobDetail.id})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Client: <span className="font-semibold text-slate-300">{activeJobDetail.client}</span> • Qty: <span className="font-semibold text-slate-300">{activeJobDetail.qty} unit(s)</span></p>
                </div>

                {/* Specs Box */}
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs font-semibold select-none">
                  <span className="text-[9px] font-black text-slate-500 block uppercase tracking-wider mb-1">Configuration Specifications</span>
                  <span className="text-slate-300 font-mono capitalize">{activeJobDetail.spec}</span>
                </div>

                {/* Checklist Section */}
                <div className="flex flex-col gap-3 select-none">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Station Quality Checklist</h4>
                  <div className="flex flex-col gap-2">
                    {activeJobDetail.checklist.map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklist(activeJobDetail.id, item.id)}
                        className="flex items-center gap-3 p-3 bg-slate-900/30 hover:bg-slate-900/60 rounded-xl border border-white/5 cursor-pointer select-none transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}}
                          className="w-4.5 h-4.5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500 pointer-events-none"
                        />
                        <span className={`text-xs font-semibold ${item.checked ? "text-slate-500 line-through" : "text-slate-300"}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-center select-none text-xs font-bold">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveJob(activeJobDetail.id, -1)}
                      className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={activeJobDetail.stage === "cutting"}
                    >
                      ← Revise Stage
                    </button>
                    <button
                      onClick={() => moveJob(activeJobDetail.id, 1)}
                      className="px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={activeJobDetail.stage === "dispatch"}
                    >
                      Advance Job →
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setJobs(prev => prev.filter(j => j.id !== activeJobDetail.id));
                      setActiveJobDetail(null);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 cursor-pointer transition-colors"
                  >
                    Delete Work Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------- TAB 4: INVENTORY & BATCH LOGS -------------------- */}
      {activeTab === "inventory" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* MATERIALS GRID */}
          <div className="lg:col-span-2 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col justify-between select-none">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Raw Material Inventory Levels</h3>
              <p className="text-xs text-slate-400 mb-6">Real-time stock measurements for furniture core units</p>
            </div>

            <div className="flex flex-col gap-3">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between p-4 bg-slate-950/20 border border-white/5 hover:border-emerald-500/15 rounded-2xl transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        mat.status === "In Stock" ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-pulse"
                      }`}
                    ></span>
                    <div>
                      <p className="text-sm font-bold text-white">{mat.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Code: {mat.id} • Min threshold: {mat.min} {mat.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 select-none text-right">
                    <div>
                      <span className={`text-sm font-black ${mat.status === "In Stock" ? "text-slate-200" : "text-red-400"}`}>
                        {mat.stock} {mat.unit}
                      </span>
                      <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">{mat.status}</span>
                    </div>

                    <button
                      onClick={() => restockMaterial(mat.id)}
                      className="bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-white/5 hover:border-emerald-500 px-3.5 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase cursor-pointer transition-all active:translate-y-0.5"
                    >
                      Restock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BATCH TRACEABILITY LOGS */}
          <div className="lg:col-span-1 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 select-none">
            <div>
              <h3 className="text-lg font-bold text-white">Traceability Batch Logs</h3>
              <p className="text-xs text-slate-400 mt-1">Audit log of incoming deliveries and supply status</p>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1">
              {batches.map((batch, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-950/30 rounded-2xl border border-white/5 hover:border-slate-800 flex flex-col gap-2.5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{batch.lotId}</span>
                      <p className="text-xs font-bold text-white mt-0.5">{batch.material}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                        batch.status === "Received"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold border-t border-white/5 pt-2.5">
                    <div>
                      <span className="text-[9px] text-slate-500 block mb-0.5">ALLOCATED QTY</span>
                      <span className="text-slate-300 font-bold">{batch.qty} units</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block mb-0.5">DELIVERY DATE</span>
                      <span className="text-slate-300 font-bold">{batch.date}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-[9px] text-slate-500 block mb-0.5">SUPPLIER SOURCE</span>
                      <span className="text-slate-300 font-bold">{batch.supplier}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// --- SUBCOMPONENT KANBAN CARD ---
const KanbanCard = ({ job, moveJob, toggleDetail }) => {
  const getPriorityClass = (pr) => {
    switch (pr?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-white/5";
    }
  };

  const completedChecklistItems = job.checklist.filter(item => item.checked).length;

  return (
    <div className="bg-brand-card border border-brand-border/60 hover:border-emerald-500/20 rounded-xl p-4.5 shadow-md flex flex-col gap-3.5 select-none transition-all duration-200 hover:-translate-y-0.5 relative group">
      <div>
        <div className="flex items-start justify-between mb-1.5">
          <span className="text-[9px] font-black text-slate-500 font-mono tracking-wider">{job.id}</span>
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide ${getPriorityClass(job.priority)}`}>
            {job.priority}
          </span>
        </div>
        <h4 className="text-sm font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
          {job.name}
        </h4>
        <p className="text-[10px] text-slate-400 font-semibold mt-1">Client: {job.client}</p>
      </div>

      {/* Progress & Checklist status bar */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 select-none bg-slate-950/40 px-3 py-1.5 rounded-lg border border-white/5">
        <span className="flex items-center gap-1">
          📋 {completedChecklistItems}/{job.checklist.length} QC Checks
        </span>
        <span className="font-mono text-[9px] text-slate-500">
          Qty: {job.qty}
        </span>
      </div>

      {/* Footer transitions */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3">
        <button
          onClick={() => toggleDetail(job)}
          className="text-[10px] font-black uppercase text-slate-400 hover:text-white cursor-pointer select-none"
        >
          View Specs
        </button>

        <div className="flex gap-1.5">
          <button
            onClick={() => moveJob(job.id, -1)}
            disabled={job.stage === "cutting"}
            className="w-6 h-6 rounded-md bg-slate-950/60 text-slate-400 hover:text-white border border-white/5 flex items-center justify-center text-xs font-bold cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed select-none transition-colors"
            title="Move Back"
          >
            ←
          </button>
          <button
            onClick={() => moveJob(job.id, 1)}
            disabled={job.stage === "dispatch"}
            className="w-6 h-6 rounded-md bg-slate-950/60 text-slate-400 hover:text-white border border-white/5 flex items-center justify-center text-xs font-bold cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed select-none transition-colors"
            title="Advance Stage"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesignForge;
