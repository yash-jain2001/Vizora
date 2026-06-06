import {
  ResponsiveContainer,
  RadialBarChart, RadialBar, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const RadialBarChartWidget = ({ title = 'Radial Bar Chart' }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/dashboard/radial-bar-chart')
        setData(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <WidgetContainer title={title}>
      <ResponsiveContainer width='100%' height='100%'>

        <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={data}>
          <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="uv" />
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </RadialBarChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default RadialBarChartWidget
