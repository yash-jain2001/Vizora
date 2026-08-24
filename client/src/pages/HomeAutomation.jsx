import { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const HomeAutomation = () => {
  const [activeTab, setActiveTab] = useState("controls");
  const [devices, setDevices] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("All");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // New automation rule form state
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({ name: "", trigger: "", action: "" });

  const rooms = ["All", "Living Room", "Bedroom", "Kitchen", "Backyard"];

  // Show status toasts
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const devicesRes = await API.get("/home-automation/devices");
      setDevices(devicesRes.data);
      const rulesRes = await API.get("/home-automation/rules");
      setRules(rulesRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching home automation data:", err);
      showToast("Failed to load smart home data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- UPDATE DEVICE STATE ---
  const handleDeviceToggle = async (deviceId, updates) => {
    try {
      // Optimistically update UI
      setDevices(prev =>
        prev.map(d => (d._id === deviceId ? { ...d, ...updates } : d))
      );

      const res = await API.put(`/home-automation/devices/${deviceId}`, updates);
      
      // Update with exact values from server (calculates precise wattage)
      setDevices(prev =>
        prev.map(d => (d._id === deviceId ? res.data : d))
      );
    } catch (err) {
      console.error("Error toggling device status:", err);
      showToast("Failed to update device.");
      // Revert states
      fetchData();
    }
  };

  // --- SCENES HANDLER ---
  const handleSceneTrigger = async (sceneName) => {
    showToast(`Activating ${sceneName}...`);
    try {
      let updates = [];
      
      if (sceneName === "Away Mode") {
        // Turn off everything, lock gates
        updates = devices.map(d => {
          if (d.type === "lock") return { id: d._id, data: { status: true } }; // lock gates
          return { id: d._id, data: { status: false } }; // turn off others
        });
      } else if (sceneName === "Morning Mode") {
        // Unlock gates, turn on kitchen coffee maker/lights, turn off bedroom climate
        updates = devices.map(d => {
          if (d.type === "lock") return { id: d._id, data: { status: false } };
          if (d.name.includes("Coffee") || d.name.includes("Kitchen")) return { id: d._id, data: { status: true, value: 90 } };
          if (d.room === "Bedroom") return { id: d._id, data: { status: false } };
          return null;
        }).filter(Boolean);
      } else if (sceneName === "Cinema Mode") {
        // Dim living room lights, turn on TV power plug, turn off other lights
        updates = devices.map(d => {
          if (d.name === "Living Room Lights") return { id: d._id, data: { status: true, value: 20 } };
          if (d.name === "Smart TV Power") return { id: d._id, data: { status: true } };
          if (d.type === "light" && d.name !== "Living Room Lights") return { id: d._id, data: { status: false } };
          return null;
        }).filter(Boolean);
      } else if (sceneName === "Night Mode") {
        // Lock gate, turn off living room/kitchen lights, turn on bedroom climate
        updates = devices.map(d => {
          if (d.type === "lock") return { id: d._id, data: { status: true } };
          if (d.room === "Bedroom" && d.type === "thermostat") return { id: d._id, data: { status: true, value: 22 } };
          if (d.room !== "Bedroom" && d.type !== "lock") return { id: d._id, data: { status: false } };
          return null;
        }).filter(Boolean);
      }

      // Update all devices sequentially
      await Promise.all(
        updates.map(item => API.put(`/home-automation/devices/${item.id}`, item.data))
      );

      showToast(`${sceneName} Activated successfully.`);
      fetchData();
    } catch (err) {
      console.error("Error activating scene:", err);
      showToast("Scene activation failed.");
    }
  };

  // --- AUTOMATIONS CRUD ---
  const handleToggleRule = async (ruleId, currentEnabled) => {
    try {
      setRules(prev =>
        prev.map(r => (r._id === ruleId ? { ...r, enabled: !currentEnabled } : r))
      );
      await API.put(`/home-automation/rules/${ruleId}`, { enabled: !currentEnabled });
    } catch (err) {
      console.error("Error toggling automation rule:", err);
      showToast("Failed to toggle automation rule.");
      fetchData();
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRuleForm.name || !newRuleForm.trigger || !newRuleForm.action) {
      showToast("Please fill in all rule parameters.");
      return;
    }
    try {
      const res = await API.post("/home-automation/rules", newRuleForm);
      setRules(prev => [...prev, res.data]);
      setIsRuleModalOpen(false);
      setNewRuleForm({ name: "", trigger: "", action: "" });
      showToast("Automation rule added.");
    } catch (err) {
      console.error("Error adding automation rule:", err);
      showToast("Failed to create rule.");
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await API.delete(`/home-automation/rules/${ruleId}`);
      setRules(prev => prev.filter(r => r._id !== ruleId));
      showToast("Automation rule deleted.");
    } catch (err) {
      console.error("Error deleting rule:", err);
      showToast("Failed to delete rule.");
    }
  };

  // --- ENERGY CALCS ---
  const liveTotalLoad = devices.reduce((sum, d) => sum + (d.status ? d.power : 0), 0);

  const getCategoryLoad = () => {
    let climate = 0, lighting = 0, appliances = 0;
    devices.forEach(d => {
      if (!d.status) return;
      if (d.type === "thermostat" || d.type === "fan") climate += d.power;
      else if (d.type === "light") lighting += d.power;
      else if (d.type === "plug") appliances += d.power;
    });
    return [
      { name: "HVAC & Climate", value: climate === 0 ? 10 : climate, color: "#f59e0b" },
      { name: "Lighting Systems", value: lighting === 0 ? 5 : lighting, color: "#10b981" },
      { name: "Power Outlets", value: appliances === 0 ? 8 : appliances, color: "#3b82f6" }
    ];
  };

  const energyUsageCurve = [
    { time: "00:00", Load: 450 },
    { time: "04:00", Load: 380 },
    { time: "08:00", Load: 920 },
    { time: "12:00", Load: 1540 },
    { time: "16:00", Load: 1200 },
    { time: "20:00", Load: 1850 },
    { time: "22:00", Load: 890 }
  ];

  const filteredDevices = selectedRoom === "All"
    ? devices
    : devices.filter(d => d.room === selectedRoom);

  return (
    <DashboardLayout>
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-card border border-brand-border text-slate-200 px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Home Automation
          </h1>
          <p className="text-slate-400 font-semibold text-sm">
            Control and schedule smart accessories and utilities
          </p>
        </div>

        {/* ACCESS SWITCHER */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 flex-wrap gap-1">
          {[
            { id: "controls", label: "Smart Controls" },
            { id: "energy", label: "Energy Analytics" },
            { id: "automations", label: "Automations" },
            { id: "security", label: "CCTV & Security" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* -------------------- TAB 1: SMART CONTROLS -------------------- */}
          {activeTab === "controls" && (
            <div className="flex flex-col gap-8">
              {/* QUICK SCENES BAR */}
              <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider mb-4">Quick Home Scenes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
                  {[
                    { name: "Morning Mode", icon: "🌅", color: "hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] text-amber-400 bg-amber-500/5 border-amber-500/10" },
                    { name: "Cinema Mode", icon: "🎬", color: "hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] text-purple-400 bg-purple-500/5 border-purple-500/10" },
                    { name: "Night Mode", icon: "🌙", color: "hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] text-blue-400 bg-blue-500/5 border-blue-500/10" },
                    { name: "Away Mode", icon: "🚪", color: "hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] text-red-400 bg-red-500/5 border-red-500/10" }
                  ].map(scene => (
                    <button
                      key={scene.name}
                      onClick={() => handleSceneTrigger(scene.name)}
                      className={`flex items-center justify-center gap-3.5 px-5 py-4 rounded-2xl border text-sm font-bold cursor-pointer transition-all duration-300 ${scene.color}`}
                    >
                      <span className="text-xl">{scene.icon}</span>
                      {scene.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* ROOM FILTER TABS */}
              <div className="flex gap-2.5 overflow-x-auto select-none pb-1">
                {rooms.map(room => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedRoom === room
                        ? "bg-slate-900 border-emerald-500/30 text-emerald-400 shadow-md"
                        : "bg-brand-card/45 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>

              {/* DEVICES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDevices.map(device => (
                  <div
                    key={device._id}
                    className={`bg-brand-card/45 border rounded-2xl p-5 shadow-lg flex flex-col justify-between gap-4 transition-all duration-300 ${
                      device.status ? "border-emerald-500/15" : "border-white/5"
                    }`}
                  >
                    {/* Device Card Top */}
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{device.room}</span>
                        <div className="flex items-center gap-2 select-none">
                          {device.status && device.power > 0 && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                              ⚡ {device.power} W
                            </span>
                          )}
                          <span
                            className={`w-2 h-2 rounded-full ${
                              device.status ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
                            }`}
                          ></span>
                        </div>
                      </div>
                      <h4 className="text-md font-bold text-white mt-1 capitalize leading-snug">{device.name}</h4>
                    </div>

                    {/* Device Specific Controls */}
                    <div className="min-h-12 flex items-center select-none w-full">
                      {device.status ? (
                        <div className="w-full animate-fade-in">
                          {device.type === "light" && (
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>BRIGHTNESS</span>
                                <span>{device.value}%</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={device.value || 100}
                                onChange={(e) => handleDeviceToggle(device._id, { value: Number(e.target.value) })}
                                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                              />
                            </div>
                          )}

                          {device.type === "thermostat" && (
                            <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/5 w-full">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SET TEMP</span>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleDeviceToggle(device._id, { value: Math.max(16, (device.value || 24) - 1) })}
                                  className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-sm font-extrabold text-white">{device.value}°C</span>
                                <button
                                  onClick={() => handleDeviceToggle(device._id, { value: Math.min(30, (device.value || 24) + 1) })}
                                  className="w-7 h-7 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}

                          {device.type === "fan" && (
                            <div className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-white/5 w-full">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SPEED</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3].map(speed => (
                                  <button
                                    key={speed}
                                    onClick={() => handleDeviceToggle(device._id, { value: speed })}
                                    className={`w-6.5 h-6.5 rounded-md text-[10px] font-extrabold flex items-center justify-center cursor-pointer transition-all ${
                                      device.value === speed ? "bg-emerald-500 text-slate-950" : "bg-slate-900 border border-white/5 text-slate-400"
                                    }`}
                                  >
                                    {speed === 1 ? "L" : speed === 2 ? "M" : "H"}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {device.type === "plug" && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">APPLIANCE ACTIVE</span>
                          )}

                          {device.type === "lock" && (
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 font-black">
                              🔒 ACCESS LOCKED
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-semibold">
                          {device.type === "lock" ? "🔓 ACCESS UNLOCKED" : "DEVICE STANDBY"}
                        </span>
                      )}
                    </div>

                    {/* Bottom Status Trigger */}
                    <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-xs font-bold select-none">
                      <span className="text-slate-400 font-bold capitalize">{device.type}</span>
                      <button
                        onClick={() => handleDeviceToggle(device._id, { status: !device.status })}
                        className={`px-4.5 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                          device.status
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                            : "bg-emerald-500 text-slate-950 shadow-md hover:bg-emerald-400 hover:shadow-[0_2px_10px_rgba(16,185,129,0.25)]"
                        }`}
                      >
                        {device.status ? (device.type === "lock" ? "Unlock" : "Turn Off") : (device.type === "lock" ? "Lock" : "Turn On")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB 2: ENERGY ANALYTICS -------------------- */}
          {activeTab === "energy" && (
            <div className="flex flex-col gap-8">
              {/* CURRENT LOAD BANNER */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 select-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Live System Power Load</span>
                  <h3 className="text-2xl font-black text-white mt-1">Real-time Smart Meter Grid</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Cumulative watt consumption metrics from active devices in database</p>
                </div>
                <div className="bg-slate-950/45 px-6 py-4 rounded-2xl border border-white/5 flex flex-col justify-center text-center shadow-lg">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Combined Load</span>
                  <span className="text-2xl font-black text-white mt-0.5">{liveTotalLoad} Watts</span>
                </div>
              </div>

              {/* GRAPHS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Historical Area chart */}
                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl lg:col-span-2 min-h-[380px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Power Ingestion History (24h)</h3>
                    <p className="text-xs text-slate-400 mb-6 font-semibold">Continuous load profiling across household utilities</p>
                  </div>
                  <div className="w-full h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={energyUsageCurve}>
                        <defs>
                          <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff" }} />
                        <Area type="monotone" dataKey="Load" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLoad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Donut Category Breakdown */}
                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl min-h-[380px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Load Share Breakdown</h3>
                    <p className="text-xs text-slate-400 mb-4 font-semibold">Distribution of active wattage consumption</p>
                  </div>
                  <div className="w-full h-[220px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getCategoryLoad()}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getCategoryLoad().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", color: "#fff", borderRadius: "8px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-[10px] font-bold text-slate-400 select-none pb-2">
                    {getCategoryLoad().map((cat, i) => (
                      <div key={i} className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-slate-300 font-black">{cat.value === 10 || cat.value === 5 || cat.value === 8 ? "0" : cat.value} W</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB 3: SMART AUTOMATIONS -------------------- */}
          {activeTab === "automations" && (
            <div className="flex flex-col gap-6 select-none animate-fade-in">
              <div className="bg-brand-card/45 border border-white/5 p-5 rounded-3xl flex justify-between items-center shadow-md">
                <div>
                  <h3 className="text-md font-bold text-white">Automation Logic (IFTTT)</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Enable or disable trigger events to synchronize home device states</p>
                </div>
                <button
                  onClick={() => setIsRuleModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all active:translate-y-0.5"
                >
                  + Create Rule
                </button>
              </div>

              {/* RULES LIST */}
              <div className="flex flex-col gap-4">
                {rules.map(rule => (
                  <div
                    key={rule._id}
                    className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 transition-colors ${
                      rule.enabled ? "bg-slate-900/40 border-emerald-500/15" : "bg-slate-950/20 border-white/5"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm text-white">{rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                          rule.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-950/30 text-slate-500 border-white/5"
                        }`}>
                          {rule.enabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs font-semibold select-none text-slate-400 font-mono">
                        <div>
                          <span className="text-[9px] text-slate-500 block font-bold mb-0.5 tracking-wider uppercase">WHEN TRIGGER FIRES</span>
                          <span className="text-slate-300">{rule.trigger}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block font-bold mb-0.5 tracking-wider uppercase">THEN TAKE ACTION</span>
                          <span className="text-slate-300">{rule.action}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4.5 border-t sm:border-t-0 border-white/5 pt-3.5 sm:pt-0 justify-between select-none">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Toggle</label>
                        <button
                          onClick={() => handleToggleRule(rule._id, rule.enabled)}
                          className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none ${
                            rule.enabled ? "bg-emerald-500" : "bg-slate-800"
                          }`}
                        >
                          <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            rule.enabled ? "translate-x-5" : "translate-x-0"
                          }`}></div>
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteRule(rule._id)}
                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 cursor-pointer shadow-sm transition-all active:translate-y-0.5"
                        title="Delete Rule"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CREATE RULE MODAL */}
              {isRuleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
                  <form onSubmit={handleAddRule} className="bg-brand-card border border-brand-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6">
                    <button
                      type="button"
                      onClick={() => setIsRuleModalOpen(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div>
                      <h3 className="text-xl font-black text-white">Create Automation Rule</h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Define trigger conditions and execution outcomes</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Rule Name</label>
                        <input
                          type="text"
                          required
                          value={newRuleForm.name}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                          placeholder="e.g. Eco Heating Mode"
                          className="px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 focus:border-emerald-500/50 text-white text-xs font-semibold outline-none"
                        />
                      </div>

                      {/* Trigger */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Trigger condition (IF)</label>
                        <input
                          type="text"
                          required
                          value={newRuleForm.trigger}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, trigger: e.target.value })}
                          placeholder="e.g. Kitchen temperature falls below 18°C"
                          className="px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 focus:border-emerald-500/50 text-white text-xs font-semibold outline-none"
                        />
                      </div>

                      {/* Action */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Execution Action (THEN)</label>
                        <input
                          type="text"
                          required
                          value={newRuleForm.action}
                          onChange={(e) => setNewRuleForm({ ...newRuleForm, action: e.target.value })}
                          placeholder="e.g. Turn on Living Room AC to Heat mode"
                          className="px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 focus:border-emerald-500/50 text-white text-xs font-semibold outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex justify-end gap-3 font-bold text-xs select-none">
                      <button
                        type="button"
                        onClick={() => setIsRuleModalOpen(false)}
                        className="px-5 py-3 rounded-xl border border-white/5 text-slate-400 hover:text-white cursor-pointer bg-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 px-5.5 py-3 rounded-xl cursor-pointer"
                      >
                        Save Automation
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* -------------------- TAB 4: SECURITY & CCTV -------------------- */}
          {activeTab === "security" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* CCTV FEEDS */}
              <div className="lg:col-span-2 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Live Access Camera Streams</h3>
                  <p className="text-xs text-slate-400 mb-6 font-semibold">Live feeds of residential perimeters</p>
                </div>

                {/* Video Grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none font-bold">
                  {[
                    { id: "CAM-01", label: "Front Gate Access", color: "brightness-75 contrast-125 saturate-50 hue-rotate-15" },
                    { id: "CAM-02", label: "Backyard Security", color: "brightness-90 contrast-100 saturate-0" },
                    { id: "CAM-03", label: "Living Room Indoor", color: "contrast-115 sepia-[.15]" },
                    { id: "CAM-04", label: "Kitchen Access", color: "brightness-75 contrast-125 saturate-50" }
                  ].map(cam => (
                    <div
                      key={cam.id}
                      className="relative rounded-2xl overflow-hidden aspect-video border border-white/5 shadow-inner bg-slate-950 flex flex-col justify-between p-4.5 group"
                    >
                      {/* Top Label */}
                      <div className="flex justify-between items-start z-10">
                        <span className="bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-black text-slate-300 font-mono">
                          {cam.id}: {cam.label}
                        </span>
                        <div className="flex items-center gap-1.5 bg-red-600/90 text-white font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          LIVE
                        </div>
                      </div>

                      {/* Video Center Grid Placeholder lines */}
                      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 ${cam.color}`}>
                        <div className="w-full h-full border-t-[0.5px] border-b-[0.5px] border-dashed border-emerald-500 absolute"></div>
                        <div className="w-full h-full border-l-[0.5px] border-r-[0.5px] border-dashed border-emerald-500 absolute"></div>
                        <span className="text-xs text-emerald-400 font-mono tracking-widest animate-pulse font-semibold">1080p // STABLE</span>
                      </div>

                      {/* Bottom Info bar */}
                      <div className="flex justify-between items-end z-10 text-[9px] text-slate-500 font-mono">
                        <span>FPS: 30.0</span>
                        <span>BITRATE: 4120 kbps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECURITY LOGS */}
              <div className="lg:col-span-1 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6 select-none">
                <div>
                  <h3 className="text-lg font-bold text-white">Security Event Logs</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Chronological logs of locks and sensors</p>
                </div>

                <div className="flex flex-col gap-4 overflow-y-auto max-h-[420px] pr-1 text-[11px] font-medium font-mono text-slate-400 leading-relaxed select-none">
                  {[
                    { text: "Smart home database loaded and initialized.", date: "Just now", type: "system" },
                    { text: "Security alert: Backyard Spotlight triggered by motion.", date: "12 mins ago", type: "alarm" },
                    { text: "Gate lock: Patio Gate Lock locked manually.", date: "32 mins ago", type: "lock" },
                    { text: "Automation: Auto Cooling turned on Bedroom AC.", date: "1h ago", type: "auto" },
                    { text: "Smart coffee maker power draw detected (250W).", date: "2h ago", type: "power" },
                    { text: "System user: Front Gate Access unlocked by Admin.", date: "4h ago", type: "user" }
                  ].map((log, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-slate-950/30 border border-white/5 rounded-xl hover:border-slate-800 flex flex-col gap-1.5 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          log.type === "alarm" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                          log.type === "lock" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          log.type === "auto" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                          "bg-slate-900 text-slate-400 border border-white/5"
                        }`}>
                          {log.type}
                        </span>
                        <span className="text-[9px] text-slate-500">{log.date}</span>
                      </div>
                      <p className="text-slate-300 font-semibold">{log.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default HomeAutomation;
