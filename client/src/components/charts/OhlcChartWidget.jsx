import React from 'react';
import ReactECharts from 'echarts-for-react';


const OhlcChartWidget = ({ title = 'OHLC Chart' }) => {
  const option = { xAxis: { data: ['10-24', '10-25', '10-26'], axisLabel: { color: "#9ca3af" } }, yAxis: { axisLabel: { color: "#9ca3af" }, splitLine: { lineStyle: { color: '#1f293d' } } }, series: [{ type: 'candlestick', data: [ [20, 34, 10, 38], [40, 35, 30, 50], [31, 38, 33, 44] ], itemStyle: { color: '#10b981', color0: '#ef4444', borderColor: '#10b981', borderColor0: '#ef4444' } }] };

  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative">
      <h3 className="text-white font-bold text-sm mb-2 truncate pr-10">{title}</h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ReactECharts 
          option={option} 
          style={{ height: '100%', width: '100%' }} 
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

export default OhlcChartWidget;