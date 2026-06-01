import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

const HistoricalTemperatureChart = ({
  data,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl animate-pulse">
        <h2 className="text-white text-xl font-bold mb-6">
          Historical Temperature
        </h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-slate-400 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-semibold">Loading historical data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
        <h2 className="text-white text-xl font-bold mb-6">
          Historical Temperature
        </h2>
        <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/10">
          <div className="text-center p-6 max-w-sm select-none">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No historical data found</h3>
            <p className="text-sm text-slate-400">
              Make sure your MQTT publisher is running and InfluxDB is writing data points to the database.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate statistics
  const values = data.map((item) => item.value)
  const totalSamples = data.length
  const avgTemp = totalSamples > 0 ? Math.round(values.reduce((sum, val) => sum + val, 0) / totalSamples) : 0
  const maxTemp = totalSamples > 0 ? Math.max(...values) : 0
  const minTemp = totalSamples > 0 ? Math.min(...values) : 0
  const lastReading = totalSamples > 0 ? values[totalSamples - 1] : 0

  let statusText = 'Normal'
  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  if (lastReading > 90) {
    statusText = 'Critical'
    statusColor = 'text-red-400 bg-red-500/10 border-red-500/20'
  } else if (lastReading > 70) {
    statusText = 'Warning'
    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  }

  return (
    <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <h2 className="text-white text-xl font-bold mb-6">
        Historical Temperature
      </h2>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHistoryTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={60}
              tickFormatter={(time) => {
                if (typeof time === 'string' && time.includes(':')) {
                  const parts = time.split(':')
                  if (parts.length >= 2) {
                    return `${parts[0]}:${parts[1]}`
                  }
                }
                return time
              }}
            />

            <YAxis
              stroke="#4b5563"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
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

            <ReferenceLine
              y={70}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: 'Warning (70°C)',
                fill: '#f59e0b',
                fontSize: 10,
                position: 'top',
                fontWeight: 'bold',
              }}
            />

            <ReferenceLine
              y={90}
              stroke="#ef4444"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: 'Critical (90°C)',
                fill: '#ef4444',
                fontSize: 10,
                position: 'top',
                fontWeight: 'bold',
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorHistoryTemp)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* STATISTICS SUMMARY SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-6 pt-6 border-t border-white/5 text-sm select-none">
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Samples</span>
          <span className="text-white font-extrabold text-base">{totalSamples}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Average</span>
          <span className="text-emerald-400 font-extrabold text-base">{avgTemp}°C</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Peak</span>
          <span className="text-red-400 font-extrabold text-base">{maxTemp}°C</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">Last Reading</span>
          <span className="text-amber-400 font-extrabold text-base">{lastReading}°C</span>
        </div>
        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-0.5">Status</span>
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
              {statusText}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoricalTemperatureChart