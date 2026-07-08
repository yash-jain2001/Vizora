
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const ParetoChartWidget = ({ widget }) => {
  const initialOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Defect A', 'Defect B', 'Defect C', 'Defect D', 'Defect E'],
      axisLabel: { color: "#9ca3af" }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Frequency',
        nameTextStyle: { color: '#9ca3af', padding: [0, 0, 0, 20] },
        axisLabel: { color: "#9ca3af" },
        splitLine: { lineStyle: { color: '#1f293d' } }
      },
      {
        type: 'value',
        name: 'Cumulative %',
        nameTextStyle: { color: '#9ca3af', padding: [0, 20, 0, 0] },
        min: 0,
        max: 100,
        axisLabel: { color: "#9ca3af", formatter: '{value}%' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Frequency',
        type: 'bar',
        data: [500, 300, 150, 40, 10],
        itemStyle: { color: '#8b5cf6', borderRadius: [4,4,0,0] }
      },
      {
        name: 'Cumulative %',
        type: 'line',
        yAxisIndex: 1,
        data: [50, 80, 95, 99, 100],
        itemStyle: { color: '#10b981' },
        lineStyle: { width: 3 }
      }
    ]
  };
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

export default ParetoChartWidget;