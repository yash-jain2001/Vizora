import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import DashboardLayout from "../components/layout/DashboardLayout";

import LineChartWidget from "../components/charts/LineChartWidget";
import BarChartWidget from "../components/charts/BarChartWidget";

import StatsCard from "../components/widgets/StatsCard";

import API from "../api/axios";

import socket from "../hooks/useSocket";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});

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

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || "Operator"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time analytics and telemetry feed
          </p>
        </div>

        {/* Date Display */}
        <div className="text-slate-400 text-xs font-semibold px-4 py-2 bg-brand-card/30 border border-brand-border rounded-xl self-start md:self-auto">
          System Time: <span className="text-emerald-400">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatsCard
          title="Active Devices"
          value={stats.activeDevices}
          color="#22C55E"
        />

        <StatsCard
          title="Temperature"
          value={`${stats.temperature || 0}°C`}
          color="#3B82F6"
        />

        <StatsCard
          title="Energy Usage"
          value={`${stats.energyUsage || 0}%`}
          color="#F59E0B"
        />

        <StatsCard
          title="Alerts"
          value={stats.alerts}
          color="#EF4444"
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <LineChartWidget />

        <BarChartWidget />

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;