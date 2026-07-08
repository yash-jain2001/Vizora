import useWidgetData from '../../hooks/useWidgetData';
import {
  ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const BubbleChartWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
          <XAxis type="category" dataKey="hour" name="hour" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="number" dataKey="index" name="index" height={10} width={80} stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
          <ZAxis type="number" dataKey={widget?.yAxis || 'value'} name="value" range={[0, 400]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default BubbleChartWidget
