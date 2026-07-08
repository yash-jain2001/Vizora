import {
  ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const RadarChartWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#1f293d" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Radar name="Student A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </RadarChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default RadarChartWidget
