import useWidgetData from '../../hooks/useWidgetData';
import {
  ResponsiveContainer,
  Treemap, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const TreemapWidget = ({ widget }) => {
  const { data } = useWidgetData(widget)

  return (
    <WidgetContainer title={widget?.title || 'Widget'}>
      <ResponsiveContainer width='100%' height='100%'>

        <Treemap width={400} height={200} data={data} dataKey="size" stroke="#fff" fill="#8884d8">
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </Treemap>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default TreemapWidget
