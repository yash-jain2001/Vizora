import React from 'react';
import ReactECharts from 'echarts-for-react';


const CalendarViewWidget = ({ title = 'Calendar View' }) => {
  const option = { xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar'], axisLabel: { color: "#9ca3af" } }, yAxis: { type: 'value', axisLabel: { color: "#9ca3af" }, splitLine: { lineStyle: { color: '#1f293d' } } }, series: [{ data: [120, 200, 150], type: 'bar', itemStyle: { color: '#8b5cf6', borderRadius: [4,4,0,0] } }] };

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

export default CalendarViewWidget;