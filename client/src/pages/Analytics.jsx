import {
  useEffect,
  useState,
} from 'react'

import API from '../api/axios'
import socket from '../hooks/useSocket'
import StatsCard from '../components/widgets/StatsCard'
import DashboardLayout from '../components/layout/DashboardLayout'

import HistoricalTemperatureChart
from '../components/charts/HistoricalCharts'

const Analytics = () => {

  const [data, setData] =
    useState([])

  const [range, setRange] =
    useState('-1h')

  const [loading, setLoading] =
    useState(true)

  const [liveTemp, setLiveTemp] =
    useState(null)

  const fetchData =
    async () => {

      setLoading(true)

      try {

        const res =
          await API.get(
            `/history/temperature?range=${range}`
          )

        const formatted =
          res.data.map(
            (item) => {
              const d = new Date(item.time)
              const hh = String(d.getHours()).padStart(2, '0')
              const mm = String(d.getMinutes()).padStart(2, '0')
              const ss = String(d.getSeconds()).padStart(2, '0')
              return {
                time: `${hh}:${mm}:${ss}`,
                value: item.value,
              }
            }
          )

        setData(formatted)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }

  useEffect(() => {

    fetchData()

  }, [range])

  useEffect(() => {

    socket.on('live-data', (newData) => {
      setLiveTemp(newData.temperature)

      if (range === '-1h') {
        setData((prev) => {
          const d = new Date()
          const hh = String(d.getHours()).padStart(2, '0')
          const mm = String(d.getMinutes()).padStart(2, '0')
          const ss = String(d.getSeconds()).padStart(2, '0')
          const timeStr = `${hh}:${mm}:${ss}`

          // Avoid duplicate timestamps
          if (prev.length > 0 && prev[prev.length - 1].time === timeStr) {
            return prev
          }

          const updated = [
            ...prev,
            {
              time: timeStr,
              value: newData.temperature,
            },
          ]
          return updated.slice(-120) // Keep last 120 points
        })
      }
    })

    return () => {
      socket.off('live-data')
    }

  }, [range])

  // Calculate statistics for KPI cards
  const values = data.map((item) => item.value)
  const currentTemp = values.length > 0 ? values[values.length - 1] : (liveTemp || 0)
  const avgTemp = values.length > 0 ? Math.round(values.reduce((sum, val) => sum + val, 0) / values.length) : 0
  const maxTemp = values.length > 0 ? Math.max(...values) : 0
  const minTemp = values.length > 0 ? Math.min(...values) : 0

  const currentTempColor = currentTemp > 90
    ? '#ef4444' // Red
    : currentTemp > 70
      ? '#f59e0b' // Warning Orange
      : '#10b981' // Emerald

  return (
    <DashboardLayout>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>

          <h1 className="text-4xl text-white font-bold">
            Analytics
          </h1>

          <p className="text-gray-400">
            Historical sensor analysis
          </p>

        </div>

        <div className="flex items-center gap-4">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 bg-brand-card/40 border border-brand-border px-4 py-2.5 rounded-xl text-sm font-semibold select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Live:</span>
            <span className="text-white font-bold text-sm">
              {liveTemp !== null ? `${liveTemp}°C` : 'Connecting...'}
            </span>
          </div>

          <select
            value={range}
            onChange={(e) =>
              setRange(
                e.target.value
              )
            }
            className="bg-brand-card/40 text-white px-4 py-2.5 rounded-xl border border-brand-border outline-none focus:border-emerald-500/30 transition-all duration-200 cursor-pointer text-sm font-semibold"
          >

            <option value="-1h">
              Last 1 Hour
            </option>

            <option value="-24h">
              Last 24 Hours
            </option>

            <option value="-7d">
              Last 7 Days
            </option>

            <option value="-30d">
              Last 30 Days
            </option>

          </select>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
        <StatsCard
          title="Current Temp"
          value={`${currentTemp}°C`}
          color={currentTempColor}
        />
        <StatsCard
          title="Average Temp"
          value={`${avgTemp}°C`}
          color="#10b981"
        />
        <StatsCard
          title="Maximum Temp"
          value={`${maxTemp}°C`}
          color="#ef4444"
        />
        <StatsCard
          title="Minimum Temp"
          value={`${minTemp}°C`}
          color="#3b82f6"
        />
      </div>

      <HistoricalTemperatureChart
        data={data}
        loading={loading}
      />

    </DashboardLayout>
  )

}

export default Analytics