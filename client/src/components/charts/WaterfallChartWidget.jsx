import React from 'react';
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const WaterfallChartWidget = ({ title = 'Waterfall Chart' }) => {
  const initialOption = { xAxis: { type: 'category', data: ['A','B','C','D'], axisLabel: { color: "#9ca3af" } }, yAxis: { type: 'value', axisLabel: { color: "#9ca3af" }, splitLine: { lineStyle: { color: '#1f293d' } } }, series: [{ type: 'line', step: 'start', data: [120, 132, 101, 134], itemStyle: { color: '#ec4899' } }] };
  const option = useWidgetData('waterfall-chart', initialOption);

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

export default WaterfallChartWidget;