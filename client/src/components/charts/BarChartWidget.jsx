import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'

import { useEffect, useState } from 'react'

import API from '../../api/axios'

const BarChartWidget = () => {

  const [data, setData] = useState([])

  const fetchData = async () => {
    try {

      const res = await API.get('/dashboard/bar-chart')

      setData(res.data)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <WidgetContainer title='Weekly Usage'>

      <ResponsiveContainer width='100%' height={300}>

        <BarChart data={data}>

          <XAxis dataKey='name' stroke='#9CA3AF' />

          <YAxis stroke='#9CA3AF' />

          <Tooltip />

          <Bar
            dataKey='usage'
            fill='#3B82F6'
            radius={[5, 5, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </WidgetContainer>
  )
}

export default BarChartWidget