import {
  ResponsiveContainer,
  FunnelChart, Funnel, Tooltip, LabelList
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const FunnelChartWidget = ({ title = 'Funnel Chart' }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/dashboard/funnel-chart')
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

        <FunnelChart>
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
          <Funnel dataKey="value" data={data} isAnimationActive>
            <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
          </Funnel>
        </FunnelChart>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default FunnelChartWidget
