import DashboardLayout from "../components/layout/DashboardLayout";
import LineChartWidget from "../components/charts/LineChartWidget";
import BarChartWidget from "../components/charts/BarChartWidget";
import AreaChartWidget from "../components/charts/AreaChartWidget";
import StackedAreaChartWidget from "../components/charts/StackedAreaChartWidget";
import PieChartWidget from "../components/charts/PieChartWidget";
import DonutChartWidget from "../components/charts/DonutChartWidget";
import ScatterChartWidget from "../components/charts/ScatterChartWidget";
import BubbleChartWidget from "../components/charts/BubbleChartWidget";
import RadarChartWidget from "../components/charts/RadarChartWidget";
import RadialBarChartWidget from "../components/charts/RadialBarChartWidget";
import ComposedChartWidget from "../components/charts/ComposedChartWidget";
import TreemapWidget from "../components/charts/TreemapWidget";
import FunnelChartWidget from "../components/charts/FunnelChartWidget";
import StackedBarChartWidget from "../components/charts/StackedBarChartWidget";
import BiaxialLineChartWidget from "../components/charts/BiaxialLineChartWidget";
import BiaxialBarChartWidget from "../components/charts/BiaxialBarChartWidget";
import StepLineChartWidget from "../components/charts/StepLineChartWidget";

import StatsCard from "../components/widgets/StatsCard";
import DashboardSwitcher from "../components/widgets/DashboardSwitcher";
import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import socket from "../hooks/useSocket";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [widgets, setWidgets] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const containerRef = useRef(null);

  // Widget configuration states
  const [datasources, setDatasources] = useState([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(null);
  const [widgetForm, setWidgetForm] = useState({ title: '', datasourceId: '', queryKey: 'value' });

  /* FETCH DATASOURCES FOR WIDGETS */
  useEffect(() => {
    const fetchDatasources = async () => {
      try {
        const res = await API.get('/datasources');
        setDatasources(res.data);
      } catch (error) {
        console.error("Error fetching datasources:", error);
      }
    };
    fetchDatasources();
  }, []);

  /* FETCH STATS */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  /* LIVE SOCKET DATA */
  useEffect(() => {
    socket.on('live-data', (liveData) => {
      setStats((prev) => ({
        ...prev,
        temperature: liveData.temperature,
        energyUsage: liveData.energy,
      }));
    });

    return () => {
      socket.off('live-data');
    };
  }, []);

  /* FETCH DASHBOARDS */
  const fetchDashboards = async () => {
    try {
      const res = await API.get('/dashboards');
      setDashboards(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, []);

  /* LOAD DASHBOARD */
  useEffect(() => {
    const loadDashboard = async () => {
      if (!selectedDashboard) {
        setWidgets([]);
        return;
      }
      try {
        const res = await API.get(`/dashboards/${selectedDashboard}`);
        const loadedWidgets = res.data.widgets.map((w, idx) => ({
          ...w,
          x: typeof w.x === 'number' ? w.x : (idx * 6) % 12,
          y: typeof w.y === 'number' ? w.y : Math.floor((idx * 6) / 12) * 4,
          w: typeof w.w === 'number' ? w.w : 6,
          h: typeof w.h === 'number' ? w.h : 4,
        }));
        setWidgets(loadedWidgets);
      } catch (error) {
        console.log(error);
      }
    };
    loadDashboard();
  }, [selectedDashboard]);

  /* ADD WIDGET */
  const addWidget = (type) => {
    const maxY = widgets.reduce((max, w) => Math.max(max, w.y + w.h), 0);
    const newWidget = {
      type,
      title: type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      x: 0,
      y: maxY,
      w: 6,
      h: 4,
      datasourceId: '',
      queryKey: 'value',
    };
    if (type === 'line-chart') newWidget.title = 'Live Data Feed';
    if (type === 'bar-chart') newWidget.title = 'Weekly Ingestion';

    setWidgets([...widgets, newWidget]);
  };

  const openConfigModal = (index) => {
    setActiveWidgetIndex(index);
    const widget = widgets[index];
    setWidgetForm({
      title: widget.title || '',
      datasourceId: widget.datasourceId || '',
      queryKey: widget.queryKey || 'value'
    });
    setIsConfigModalOpen(true);
  };

  const saveWidgetConfig = (e) => {
    e.preventDefault();
    if (activeWidgetIndex === null) return;
    setWidgets((prev) => {
      const updated = [...prev];
      updated[activeWidgetIndex] = {
        ...updated[activeWidgetIndex],
        title: widgetForm.title,
        datasourceId: widgetForm.datasourceId,
        queryKey: widgetForm.queryKey,
      };
      return updated;
    });
    setIsConfigModalOpen(false);
    setActiveWidgetIndex(null);
  };

  /* REMOVE WIDGET */
  const removeWidget = (index) => {
    const updated = widgets.filter((_, i) => i !== index);
    setWidgets(updated);
  };

  /* SAVE DASHBOARD */
  const saveDashboard = async () => {
    if (widgets.length === 0) {
      alert('Cannot save an empty dashboard. Please add widgets first.');
      return;
    }

    try {
      if (selectedDashboard) {
        // Find existing dashboard details
        const activeDash = dashboards.find((d) => d._id === selectedDashboard);
        const title = activeDash ? activeDash.title : `Dashboard ${Date.now()}`;
        
        await API.put(`/dashboards/${selectedDashboard}`, {
          title,
          widgets,
        });
        alert('Dashboard layout updated successfully!');
      } else {
        const title = prompt('Enter a title for your new dashboard:') || `Dashboard ${Date.now()}`;
        const res = await API.post('/dashboards', {
          title,
          widgets,
        });
        setSelectedDashboard(res.data._id);
        alert('New dashboard saved successfully!');
      }
      fetchDashboards();
    } catch (error) {
      console.log(error);
      alert('Failed to save dashboard.');
    }
  };

  /* DRAG AND DROP HANDLERS */
  const handleDragStart = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const grabX = e.clientX - rect.left;
    const grabY = e.clientY - rect.top;
    
    e.dataTransfer.setData("application/json", JSON.stringify({ index, grabX, grabY }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;

    try {
      const dataStr = e.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const { index, grabX, grabY } = JSON.parse(dataStr);

      const gridRect = containerRef.current.getBoundingClientRect();
      const colWidth = gridRect.width / 12;
      const rowHeight = 100; // row height unit matches gridAutoRows

      const relativeX = e.clientX - gridRect.left - grabX;
      const relativeY = e.clientY - gridRect.top - grabY;

      let newX = Math.round(relativeX / colWidth);
      let newY = Math.round(relativeY / rowHeight);

      const widget = widgets[index];
      // Keep widget within 12 columns bounds
      newX = Math.max(0, Math.min(12 - widget.w, newX));
      newY = Math.max(0, newY);

      setWidgets((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], x: newX, y: newY };
        return updated;
      });
    } catch (err) {
      console.error("Failed to parse drag-drop payload", err);
    }
  };

  /* RESIZE HANDLER */
  const handleResizeStart = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const widget = widgets[index];
    const startW = widget.w;
    const startH = widget.h;

    const gridRect = containerRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / 12;
    const rowHeight = 100;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newW = Math.round(startW + deltaX / colWidth);
      let newH = Math.round(startH + deltaY / rowHeight);

      // Enforce bounds: min columns: 2, max columns: within grid, min row height units: 2
      newW = Math.max(2, Math.min(12 - widget.x, newW));
      newH = Math.max(2, newH);

      setWidgets((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], w: newW, h: newH };
        return updated;
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            IoT Monitoring Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time analytics and monitoring
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 flex-wrap items-center">
          <DashboardSwitcher
            dashboards={dashboards}
            selectedDashboard={selectedDashboard}
            setSelectedDashboard={setSelectedDashboard}
          />

          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addWidget(e.target.value);
                  e.target.value = "";
                }
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-sm shadow-md outline-none border-r-[12px] border-transparent"
              defaultValue=""
            >
              <option value="" disabled>+ Add Widget</option>
              <option value="line-chart">Line Chart (Live)</option>
              <option value="bar-chart">Bar Chart</option>
              <option value="area-chart">Area Chart</option>
              <option value="stacked-area-chart">Stacked Area Chart</option>
              <option value="pie-chart">Pie Chart</option>
              <option value="donut-chart">Donut Chart</option>
              <option value="scatter-chart">Scatter Chart</option>
              <option value="bubble-chart">Bubble Chart</option>
              <option value="radar-chart">Radar Chart</option>
              <option value="radial-bar-chart">Radial Bar Chart</option>
              <option value="composed-chart">Composed Chart</option>
              <option value="treemap">Treemap</option>
              <option value="funnel-chart">Funnel Chart</option>
              <option value="stacked-bar-chart">Stacked Bar Chart</option>
              <option value="biaxial-line-chart">Biaxial Line Chart</option>
              <option value="biaxial-bar-chart">Biaxial Bar Chart</option>
              <option value="step-line-chart">Step Line Chart</option>
            </select>
          </div>

          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-5 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5 border ${
              isEditMode
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-white/10'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {isEditMode ? 'Exit Edit Mode' : 'Edit Layout'}
          </button>

          <button
            onClick={saveDashboard}
            className="bg-sky-500 hover:bg-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3 6-6M20.25 12c0 4.556-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75s8.25 3.694 8.25 8.25z" />
            </svg>
            Save Layout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
        <StatsCard
          title="Active Devices"
          value={stats.activeDevices}
          color="#10b981"
        />
        <StatsCard
          title="Temperature"
          value={`${stats.temperature || 0}°C`}
          color="#3b82f6"
        />
        <StatsCard
          title="Energy Usage"
          value={`${stats.energyUsage || 0}%`}
          color="#f59e0b"
        />
        <StatsCard
          title="Alerts"
          value={stats.alerts}
          color="#ef4444"
        />
      </div>

      {/* WIDGETS CANVAS */}
      <div
        ref={containerRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative transition-all duration-300 rounded-3xl"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: '100px',
          gap: '1.5rem',
          minHeight: '600px',
          padding: isEditMode ? '1.5rem' : '0px',
          backgroundColor: isEditMode ? 'rgba(30, 41, 59, 0.2)' : 'transparent',
          border: isEditMode ? '2px dashed rgba(16, 185, 129, 0.2)' : '2px solid transparent',
          backgroundImage: isEditMode
            ? 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)'
            : 'none',
          backgroundSize: 'calc((100% - 11 * 1.5rem) / 12 + 1.5rem) 100px',
        }}
      >
        {widgets.map((widget, index) => (
          <div
            key={index}
            draggable={isEditMode}
            onDragStart={(e) => handleDragStart(e, index)}
            className={`relative group bg-brand-card/45 backdrop-blur-xl rounded-2xl transition-all duration-300 flex flex-col h-full overflow-hidden ${
              isEditMode
                ? 'border-2 border-dashed border-emerald-500/25 hover:border-emerald-500/50 cursor-grab active:cursor-grabbing shadow-[0_4px_24px_rgba(16,185,129,0.08)]'
                : 'border border-white/5'
            }`}
            style={{
              gridColumn: `${widget.x + 1} / span ${widget.w}`,
              gridRow: `${widget.y + 1} / span ${widget.h}`,
            }}
          >
            {/* DRAG HANDLE OVERLAY (Active only in edit mode) */}
            {isEditMode && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 bg-slate-950/80 px-3 py-1 rounded-full text-slate-400 select-none z-30 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0l-6-6" />
                </svg>
                <span className="text-[10px] font-bold tracking-wider">DRAG</span>
              </div>
            )}

            {/* CONFIGURE BUTTON */}
            {isEditMode && (
              <button
                onClick={() => openConfigModal(index)}
                className="absolute top-4 right-13 z-15 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 w-7 h-7 rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                title="Configure Panel"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            )}

            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeWidget(index)}
              className="absolute top-4 right-4 z-15 flex items-center justify-center bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-red-400 w-7 h-7 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_2px_10px_rgba(239,68,68,0.25)]"
              title="Remove Widget"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full h-full flex-1">
              {widget.type === "line-chart" && <LineChartWidget datasourceId={widget.datasourceId} queryKey={widget.queryKey} title={widget.title} />}
              {widget.type === "bar-chart" && <BarChartWidget datasourceId={widget.datasourceId} queryKey={widget.queryKey} title={widget.title} />}
              {widget.type === "area-chart" && <AreaChartWidget title={widget.title} />}
              {widget.type === "stacked-area-chart" && <StackedAreaChartWidget title={widget.title} />}
              {widget.type === "pie-chart" && <PieChartWidget title={widget.title} />}
              {widget.type === "donut-chart" && <DonutChartWidget title={widget.title} />}
              {widget.type === "scatter-chart" && <ScatterChartWidget title={widget.title} />}
              {widget.type === "bubble-chart" && <BubbleChartWidget title={widget.title} />}
              {widget.type === "radar-chart" && <RadarChartWidget title={widget.title} />}
              {widget.type === "radial-bar-chart" && <RadialBarChartWidget title={widget.title} />}
              {widget.type === "composed-chart" && <ComposedChartWidget title={widget.title} />}
              {widget.type === "treemap" && <TreemapWidget title={widget.title} />}
              {widget.type === "funnel-chart" && <FunnelChartWidget title={widget.title} />}
              {widget.type === "stacked-bar-chart" && <StackedBarChartWidget title={widget.title} />}
              {widget.type === "biaxial-line-chart" && <BiaxialLineChartWidget title={widget.title} />}
              {widget.type === "biaxial-bar-chart" && <BiaxialBarChartWidget title={widget.title} />}
              {widget.type === "step-line-chart" && <StepLineChartWidget title={widget.title} />}
            </div>

            {/* RESIZE HANDLE */}
            {isEditMode && (
              <div
                onMouseDown={(e) => handleResizeStart(e, index)}
                className="absolute bottom-2 right-2 w-5 h-5 cursor-se-resize flex items-end justify-end select-none z-20 group/resize"
                title="Resize Panel"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover/resize:text-emerald-400 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15M19.5 9.5l-10 10M19.5 14.5l-5 5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* WIDGET CONFIGURATION MODAL */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-brand-card border border-brand-border rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-black text-white mb-6">
              Configure Panel
            </h3>
            <form onSubmit={saveWidgetConfig} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Panel Title</label>
                <input
                  type="text"
                  value={widgetForm.title}
                  onChange={(e) => setWidgetForm({ ...widgetForm, title: e.target.value })}
                  placeholder="e.g. Temperature Sensor"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white text-sm font-semibold outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Source</label>
                <select
                  value={widgetForm.datasourceId}
                  onChange={(e) => setWidgetForm({ ...widgetForm, datasourceId: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white text-sm font-semibold outline-none focus:border-emerald-500/50 cursor-pointer"
                >
                  <option value="">-- Use Mock / Global Stream --</option>
                  {datasources.map((ds) => (
                    <option key={ds._id} value={ds._id}>
                      {ds.name} ({ds.type.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Value Path / Topic Key</label>
                <input
                  type="text"
                  value={widgetForm.queryKey}
                  onChange={(e) => setWidgetForm({ ...widgetForm, queryKey: e.target.value })}
                  placeholder="e.g. value, temperature"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white text-sm font-semibold outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all duration-200 mt-4 cursor-pointer text-sm shadow-md"
              >
                Apply Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;