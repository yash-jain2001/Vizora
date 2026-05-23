import DashboardLayout from "../components/layout/DashboardLayout";

import LineChartWidget from "../components/charts/LineChartWidget";
import BarChartWidget from "../components/charts/BarChartWidget";

import StatsCard from "../components/widgets/StatsCard";

import { useEffect, useState } from "react";

import API from "../api/axios";

import socket from "../hooks/useSocket";

const Dashboard = () => {

  const [stats, setStats] = useState({})

  useEffect(() => {

    const fetchStats = async () => {

      try {

        const res = await API.get('/dashboard/stats')

        setStats(res.data)

      } catch (error) {
        console.log(error)
      }

    }

    fetchStats()

  }, [])

  /* LIVE SOCKET DATA */
  useEffect(() => {

    socket.on('live-data', (liveData) => {

      setStats((prev) => ({
        ...prev,
        temperature: liveData.temperature,
        energyUsage: liveData.energy,
      }))

    })

    return () => {
      socket.off('live-data')
    }

  }, [])

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white mb-2">
          IoT Monitoring Dashboard
        </h1>

        <p className="text-gray-400">
          Real-time analytics and monitoring
        </p>

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