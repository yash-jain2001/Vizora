
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const GaugeChartWidget = ({ widget }) => {
  const initialOption = { series: [{ type: 'gauge', progress: { show: true, width: 18 }, axisLine: { lineStyle: { width: 18 } }, splitLine: { length: 15 }, axisLabel: { distance: 25, color: '#999' }, detail: { valueAnimation: true, color: '#fff' }, data: [{ value: 70 }] }] };
  const option = useWidgetData('gauge-chart', initialOption);

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

export default GaugeChartWidget;