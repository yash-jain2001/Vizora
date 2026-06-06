import {
  ResponsiveContainer,
  PieChart, Pie, Tooltip, Cell
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const DonutChartWidget = ({ title = 'Donut Chart' }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/dashboard/donut-chart')
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

        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8">
            {data.map((entry, index) => <Cell key={'cell-' + index} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </PieChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default DonutChartWidget
