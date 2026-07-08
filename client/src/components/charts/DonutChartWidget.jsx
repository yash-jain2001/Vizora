import useWidgetData from '../../hooks/useWidgetData';
import {
  ResponsiveContainer,
  PieChart, Pie, Tooltip, Cell
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const DonutChartWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <PieChart>
          <Pie data={data} dataKey={widget?.yAxis || 'value'} nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8">
            {data.map((entry, index) => <Cell key={'cell-' + index} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />)}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </PieChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default DonutChartWidget
