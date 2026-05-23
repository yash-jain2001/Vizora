import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'

import { useEffect, useState } from 'react'

import socket from '../../hooks/useSocket'

const LineChartWidget = () => {

  const [data, setData] = useState([])

  useEffect(() => {

    socket.on('live-data', (newData) => {

      setData((prev) => {

        const updated = [
          ...prev,
          {
            time: newData.time,
            value: newData.temperature,
          },
        ]

        return updated.slice(-10)
      })

    })

    return () => {
      socket.off('live-data')
    }

  }, [])

  return (
    <WidgetContainer title='Live Temperature Analytics'>

      <ResponsiveContainer width='100%' height={300}>

        <LineChart data={data}>

          <XAxis dataKey='time' stroke='#9CA3AF' />

          <YAxis stroke='#9CA3AF' />

          <Tooltip />

          <Line
            type='monotone'
            dataKey='value'
            stroke='#22C55E'
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </WidgetContainer>
  )
}

export default LineChartWidget