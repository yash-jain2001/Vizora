import {
  ResponsiveContainer,
  Treemap, Tooltip
} from 'recharts'

import WidgetContainer from '../widgets/WidgetContainer'
import { useEffect, useState } from 'react'
import API from '../../api/axios'

const TreemapWidget = ({ title = 'Treemap' }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/dashboard/treemap')
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

        <Treemap width={400} height={200} data={data} dataKey="size" stroke="#fff" fill="#8884d8">
          <Tooltip contentStyle={{ backgroundColor: '#121824', border: '1px solid #1f293d', borderRadius: '12px', color: '#fff' }} />
        </Treemap>
    
      </ResponsiveContainer>
    </WidgetContainer>
  )
}

export default TreemapWidget
