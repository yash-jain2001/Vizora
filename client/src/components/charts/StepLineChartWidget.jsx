import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const StepLineChartWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
          <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
          <Line type="step" dataKey="pv" stroke="#8884d8" />
        </LineChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default StepLineChartWidget
