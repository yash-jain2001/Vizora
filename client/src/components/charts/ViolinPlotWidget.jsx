import React from 'react';
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const ViolinPlotWidget = ({ title = 'Violin Plot' }) => {
  const initialOption = { dataset: [{ source: [ [850, 740, 900, 1070], [960, 940, 960, 940] ] }, { transform: { type: 'boxplot' } }], xAxis: { type: 'category', axisLabel: { color: "#9ca3af" } }, yAxis: { type: 'value', axisLabel: { color: "#9ca3af" }, splitLine: { lineStyle: { color: '#1f293d' } } }, series: [{ name: 'boxplot', type: 'boxplot', datasetIndex: 1, itemStyle: { borderColor: '#3b82f6' } }] };
  const option = useWidgetData('violin-plot', initialOption);

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

export default ViolinPlotWidget;