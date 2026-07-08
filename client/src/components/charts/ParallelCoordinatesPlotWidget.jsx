import React from 'react';
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const ParallelCoordinatesPlotWidget = ({ title = 'Parallel Coordinates Plot' }) => {
  const initialOption = { parallelAxis: [ { dim: 0, name: 'Price', nameTextStyle: {color:'#fff'} }, { dim: 1, name: 'Weight', nameTextStyle: {color:'#fff'} } ], parallel: { left: '5%', right: '15%', bottom: '10%', top: '20%' }, series: { type: 'parallel', lineStyle: { width: 2, color: '#f59e0b', opacity: 0.5 }, data: [ [12.99, 100], [9.99, 80] ] } };
  const option = useWidgetData('parallel-coordinates-plot', initialOption);

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

export default ParallelCoordinatesPlotWidget;