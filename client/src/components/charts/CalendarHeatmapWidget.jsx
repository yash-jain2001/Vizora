
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const CalendarHeatmapWidget = ({ widget }) => {
  const initialOption = { tooltip: { position: 'top' }, grid: { top: '10%', bottom: '15%', left: '10%', right: '5%' }, xAxis: { type: 'category', data: ['12a','1a','2a','3a','4a','5a'], axisLabel: { color: "#9ca3af" } }, yAxis: { type: 'category', data: ['Sat','Fri','Thu','Wed','Tue','Mon','Sun'], axisLabel: { color: "#9ca3af" } }, visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '0%', textStyle: { color: "#9ca3af" }, inRange: { color: ['#1e1e1e', '#10b981'] } }, series: [{ type: 'heatmap', data: [[0,0,5],[0,1,1],[1,0,3],[1,1,0]], label: { show: false } }] };
  const option = useWidgetData('calendar-heatmap', initialOption);

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

export default CalendarHeatmapWidget;