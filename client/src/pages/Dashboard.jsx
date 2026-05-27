import DashboardLayout from "../components/layout/DashboardLayout";

import LineChartWidget from "../components/charts/LineChartWidget";
import BarChartWidget from "../components/charts/BarChartWidget";

import StatsCard from "../components/widgets/StatsCard";

import {
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

import socket from "../hooks/useSocket";

const Dashboard = () => {

  const [stats, setStats] =
    useState({})

  const [widgets, setWidgets] =
    useState([
      {
        type: 'line-chart',
        title: 'Temperature',
      },
      {
        type: 'bar-chart',
        title: 'Energy Usage',
      },
    ])

  /* FETCH STATS */
  useEffect(() => {

    const fetchStats =
      async () => {

        try {

          const res =
            await API.get(
              '/dashboard/stats'
            )

          setStats(res.data)

        } catch (error) {
          console.log(error)
        }

      }

    fetchStats()

  }, [])

  /* LIVE SOCKET DATA */
  useEffect(() => {

    socket.on(
      'live-data',
      (liveData) => {

        setStats((prev) => ({
          ...prev,
          temperature:
            liveData.temperature,
          energyUsage:
            liveData.energy,
        }))

      }
    )

    return () => {
      socket.off('live-data')
    }

  }, [])

  /* ADD WIDGET */
  const addWidget = (type) => {

    const newWidget = {
      type,
      title:
        type === 'line-chart'
          ? 'New Line Chart'
          : 'New Bar Chart',
    }

    setWidgets([
      ...widgets,
      newWidget,
    ])

  }

  /* REMOVE WIDGET */
  const removeWidget = (
    index
  ) => {

    const updated =
      widgets.filter(
        (_, i) => i !== index
      )

    setWidgets(updated)

  }

  /* SAVE DASHBOARD */
  const saveDashboard =
    async () => {

      try {

        await API.post(
          '/dashboards',
          {
            title:
              'Main Dashboard',
            widgets,
          }
        )

        alert(
          'Dashboard Saved'
        )

      } catch (error) {

        console.log(error)

      }

    }

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
        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() =>
              addWidget(
                'line-chart'
              )
            }
            className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-lg text-white font-semibold"
          >
            Add Line Chart
          </button>

          <button
            onClick={() =>
              addWidget(
                'bar-chart'
              )
            }
            className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg text-white font-semibold"
          >
            Add Bar Chart
          </button>

          <button
            onClick={saveDashboard}
            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-lg text-white font-semibold"
          >
            Save Dashboard
          </button>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatsCard
          title="Active Devices"
          value={
            stats.activeDevices
          }
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

      {/* WIDGETS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {widgets.map(
          (widget, index) => (

            <div
              key={index}
              className="relative"
            >

              {/* REMOVE BUTTON */}
              <button
                onClick={() =>
                  removeWidget(
                    index
                  )
                }
                className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 w-8 h-8 rounded-full text-white"
              >
                ×
              </button>

              {widget.type ===
                'line-chart' && (
                <LineChartWidget />
              )}

              {widget.type ===
                'bar-chart' && (
                <BarChartWidget />
              )}

            </div>

          )
        )}

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;