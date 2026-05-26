import { useEffect, useState, useCallback } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";

import API from "../api/axios";

const Datasources = () => {

  const [datasources, setDatasources] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    url: '',
    topic: '',
  })

  const fetchDatasources = useCallback(async () => {
    try {
      const res = await API.get('/datasources')
      setDatasources(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchDatasources()
  }, [fetchDatasources])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/datasources', formData)
      fetchDatasources()
      setFormData({
        name: '',
        type: '',
        url: '',
        topic: '',
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getTypeBadge = (type) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ";
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Connected Datasources
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage and configure your live data feeds and system connections
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-brand-card/30 backdrop-blur-md p-8 rounded-2xl border border-brand-border mb-8 shadow-xl"
      >
        <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
          Add New Connection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Datasource Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Factory Temperature sensor"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-slate-900/60 border border-brand-border text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Connection Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-slate-900/60 border border-brand-border text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            >
              <option value="">Select Connection Protocol</option>
              <option value="mqtt">MQTT Broker</option>
              <option value="http">HTTP Endpoint</option>
              <option value="influxdb">InfluxDB Database</option>
              <option value="opcua">OPCUA Client</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Broker / Server URL
            </label>
            <input
              type="text"
              name="url"
              placeholder="e.g. mqtt://broker.hivemq.com or http://api.live.com"
              value={formData.url}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-slate-900/60 border border-brand-border text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              MQTT Topic (Optional)
            </label>
            <input
              type="text"
              name="topic"
              placeholder="e.g. factory/sensors/temp"
              value={formData.topic}
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-slate-900/60 border border-brand-border text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] text-slate-950 font-bold transition-all duration-250 py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer"
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
            className="bg-brand-card/20 backdrop-blur-md border border-brand-border p-6 rounded-2xl shadow-md hover:shadow-lg hover:border-slate-800 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {source.name}
                </h3>
                {getTypeBadge(source.type)}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Endpoint URL
                  </span>
                  <code className="bg-slate-950/40 px-3.5 py-2.5 rounded-xl border border-brand-border text-slate-300 font-mono text-xs overflow-x-auto select-all">
                    {source.url}
                  </code>
                </div>

                {source.topic && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Subscribed Topic
                    </span>
                    <code className="bg-slate-950/40 px-3.5 py-2.5 rounded-xl border border-brand-border text-slate-300 font-mono text-xs overflow-x-auto select-all">
                      {source.topic}
                    </code>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-brand-border/40 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold mt-2">
              <span>Status: <span className="text-emerald-400">Active</span></span>
              <span>Updated: {new Date(source.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Datasources;