import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

const Datasources = () => {
  const [datasources, setDatasources] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    url: "",
    topic: "",
  });

  useEffect(() => {
    let active = true;
    const fetchDatasources = async () => {
      try {
        const res = await API.get("/datasources");
        if (active) {
          setDatasources(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDatasources();
    return () => {
      active = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/datasources", formData);
      const res = await API.get("/datasources");
      setDatasources(res.data);
      setFormData({
        name: "",
        type: "",
        url: "",
        topic: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type?.toLowerCase()) {
      case "mqtt":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.364 5.364a9 9 0 0112.728 0m-12.728 0L9.364 8m12.728-2.636l-2.636 2.636m-10.092 7.456a4 4 0 115.656 0m-5.656 0l-2.637 2.637m10.929-2.637l2.637 2.637" />
          </svg>
        );
      case "http":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
          </svg>
        );
      case "influxdb":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 0v3.75m-16.5-3.75v3.75" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        );
    }
  };

  const getTypeBadge = (type) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ";
    switch (type?.toLowerCase()) {
      case "mqtt":
        return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "http":
        return base + "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "influxdb":
        return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "opcua":
        return base + "bg-violet-500/10 text-violet-400 border-violet-500/20";
      default:
        return base + "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Connected Datasources
        </h1>
        <p className="text-gray-400">
          Manage and configure your live data feeds and system connections
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-brand-card/45 backdrop-blur-xl p-8 rounded-2xl border border-white/5 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
          Add New Connection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Datasource Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Factory Temperature sensor"
              value={formData.name}
              onChange={handleChange}
              className="px-4.5 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Connection Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="px-4.5 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm font-semibold cursor-pointer"
              required
            >
              <option value="" className="bg-brand-card text-slate-400">Select Connection Protocol</option>
              <option value="mqtt" className="bg-brand-card text-white">MQTT Broker</option>
              <option value="http" className="bg-brand-card text-white">HTTP Endpoint</option>
              <option value="influxdb" className="bg-brand-card text-white">InfluxDB Database</option>
              <option value="opcua" className="bg-brand-card text-white">OPCUA Client</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Broker / Server URL
            </label>
            <input
              type="text"
              name="url"
              placeholder="e.g. mqtt://broker.hivemq.com or http://api.live.com"
              value={formData.url}
              onChange={handleChange}
              className="px-4.5 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm font-medium"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              MQTT Topic (Optional)
            </label>
            <input
              type="text"
              name="topic"
              placeholder="e.g. factory/sensors/temp"
              value={formData.topic}
              onChange={handleChange}
              className="px-4.5 py-3 rounded-xl bg-slate-950/40 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 font-bold transition-all duration-200 py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Register Connection
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {datasources.map((source) => (
          <div
            key={source._id}
            className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                    {getTypeIcon(source.type)}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {source.name}
                  </h3>
                </div>
                {getTypeBadge(source.type)}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Endpoint URL
                  </span>
                  <code className="bg-slate-950/40 px-3.5 py-2.5 rounded-xl border border-white/5 text-slate-300 font-mono text-xs overflow-x-auto select-all">
                    {source.url}
                  </code>
                </div>

                {source.topic && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Subscribed Topic
                    </span>
                    <code className="bg-slate-950/40 px-3.5 py-2.5 rounded-xl border border-white/5 text-slate-300 font-mono text-xs overflow-x-auto select-all">
                      {source.topic}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold mt-2">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Active
              </span>
              <span>Updated: {source.updatedAt ? new Date(source.updatedAt).toLocaleDateString() : "Just now"}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Datasources;