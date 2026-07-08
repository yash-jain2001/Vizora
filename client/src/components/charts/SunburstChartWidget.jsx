
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const SunburstChartWidget = ({ widget }) => {
  const initialOption = { series: { type: 'sunburst', data: [{ name: 'Factory A', children: [{ name: 'Line 1', value: 15 }] }], radius: [0, '90%'], label: { rotate: 'radial', color: '#fff' } } };
  const option = useWidgetData('sunburst-chart', initialOption);

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

export default SunburstChartWidget;