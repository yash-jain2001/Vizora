import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'

import { useEffect, useState } from 'react'

import API from '../../api/axios'

const BarChartWidget = () => {

  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await API.get('/dashboard/bar-chart')

        setData(res.data)

      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <WidgetContainer title='Weekly Usage'>

      <ResponsiveContainer width='100%' height={300}>

        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.85}/>
              <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />

          <XAxis 
            dataKey='name' 
            stroke='#4b5563' 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis 
            stroke='#4b5563' 
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#121824',
              border: '1px solid #1f293d',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
            }}
            labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
          />

          <Bar
            dataKey='usage'
            fill='url(#colorUsage)'
            radius={[6, 6, 0, 0]}
            maxBarSize={45}
          />

        </BarChart>

      </ResponsiveContainer>

    </WidgetContainer>
  )
}

export default BarChartWidget