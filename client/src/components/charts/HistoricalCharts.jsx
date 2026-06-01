import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const HistoricalTemperatureChart = ({
  data,
}) => {

  return (
    <div className="bg-[#1F2937] p-6 rounded-2xl">

      <h2 className="text-white text-xl font-bold mb-6">
        Historical Temperature
      </h2>

      <div className="h-[400px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="time"
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#22C55E"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )

}

export default HistoricalTemperatureChart