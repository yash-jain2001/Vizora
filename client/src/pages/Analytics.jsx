import {
  useEffect,
  useState,
} from 'react'

import API from '../api/axios'

import DashboardLayout from '../components/layout/DashboardLayout'

import HistoricalTemperatureChart
from '../components/charts/HistoricalCharts'

const Analytics = () => {

  const [data, setData] =
    useState([])

  const [range, setRange] =
    useState('-1h')

  const fetchData =
    async () => {

      try {

        const res =
          await API.get(
            `/history/temperature?range=${range}`
          )

        const formatted =
          res.data.map(
            (item) => ({
              time:
                new Date(
                  item.time
                ).toLocaleTimeString(),
              value:
                item.value,
            })
          )

        setData(formatted)

      } catch (error) {

        console.log(error)

      }

    }

  useEffect(() => {

    fetchData()

  }, [range])

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

        <select
          value={range}
          onChange={(e) =>
            setRange(
              e.target.value
            )
          }
          className="bg-[#1F2937] text-white px-4 py-3 rounded-lg"
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

      <HistoricalTemperatureChart
        data={data}
      />

    </DashboardLayout>
  )

}

export default Analytics