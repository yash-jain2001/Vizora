import DashboardLayout from "../components/layout/DashboardLayout";

import LineChartWidget from "../components/charts/LineChartWidget";
import BarChartWidget from "../components/charts/BarChartWidget";

import StatsCard from "../components/widgets/StatsCard";

import DashboardSwitcher from "../components/widgets/DashboardSwitcher";

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
    useState([])

  const [dashboards, setDashboards] =
    useState([])

  const [
    selectedDashboard,
    setSelectedDashboard,
  ] = useState('')

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

  /* FETCH DASHBOARDS */
  const fetchDashboards =
    async () => {

      try {

        const res =
          await API.get(
            '/dashboards'
          )

        setDashboards(
          res.data
        )

      } catch (error) {

        console.log(error)

      }

    }

  useEffect(() => {
    fetchDashboards()
  }, [])

  /* LOAD DASHBOARD */
  useEffect(() => {

    const loadDashboard =
      async () => {

        if (!selectedDashboard)
          return

        try {

          const res =
            await API.get(
              `/dashboards/${selectedDashboard}`
            )

          setWidgets(
            res.data.widgets
          )

        } catch (error) {

          console.log(error)

        }

      }

    loadDashboard()

  }, [selectedDashboard])

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
              `Dashboard ${Date.now()}`,
            widgets,
          }
        )

        fetchDashboards()

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

          <DashboardSwitcher
            dashboards={
              dashboards
            }
            selectedDashboard={
              selectedDashboard
            }
            setSelectedDashboard={
              setSelectedDashboard
            }
          />

          <button
            onClick={() => addWidget("line-chart")}
            className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Line Chart
          </button>

          <button
            onClick={() => addWidget("bar-chart")}
            className="bg-blue-500 hover:bg-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Bar Chart
          </button>

          <button
            onClick={saveDashboard}
            className="bg-amber-500 hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3 6-6M20.25 12c0 4.556-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75s8.25 3.694 8.25 8.25z" />
            </svg>
            Save Dashboard
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

      {/* WIDGETS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {widgets.map((widget, index) => (
          <div key={index} className="relative group">
            {/* REMOVE BUTTON */}
            <button
              onClick={() => removeWidget(index)}
              className="absolute top-[22px] right-[115px] z-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-red-400 w-7 h-7 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_2px_10px_rgba(239,68,68,0.25)]"
              title="Remove Widget"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {widget.type === "line-chart" && <LineChartWidget />}

            {widget.type === "bar-chart" && <BarChartWidget />}
          </div>
        ))}

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;