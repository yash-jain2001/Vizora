import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'

import { useEffect, useState } from 'react'

import useWidgetData from '../../hooks/useWidgetData';

const LineChartWidget = ({ widget }) => {

  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Live Temperature Feed'}>

      <ResponsiveContainer width='100%' height="100%">

        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />

          <XAxis 
            dataKey={widget?.xAxis || 'time'} 
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
            domain={['auto', 'auto']}
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

          <Area
            type='monotone'
            dataKey={widget?.yAxis || 'value'}
            stroke='#10b981'
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTemp)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </WidgetContainer>
  )
}

export default LineChartWidget