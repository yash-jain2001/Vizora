
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const SplineChartWidget = ({ widget }) => {
  const initialOption = { xAxis: { type: 'category', data: ['M','T','W','T','F','S','S'], axisLabel: { color: "#9ca3af" } }, yAxis: { type: 'value', axisLabel: { color: "#9ca3af" }, splitLine: { lineStyle: { color: '#1f293d' } } }, series: [{ data: [820, 932, 901, 934, 1290, 1330, 1320], type: 'line', smooth: true, itemStyle: { color: '#3b82f6' } }] };
  const option = useWidgetData(widget, initialOption);

  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative">
      <h3 className="text-white font-bold text-sm mb-2 truncate pr-10">{widget?.title || "Chart"}</h3>
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

export default SplineChartWidget;