import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const StackedAreaChartWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
          <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
          <Area type="monotone" dataKey="uv" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          <Area type="monotone" dataKey="pv" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          <Area type="monotone" dataKey="amt" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
        </AreaChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default StackedAreaChartWidget
