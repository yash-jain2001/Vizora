import React from 'react';
import ReactECharts from 'echarts-for-react';


const SankeyDiagramWidget = ({ title = 'Sankey Diagram' }) => {
  const option = { series: { type: 'sankey', layout: 'none', lineStyle: { color: 'gradient', curveness: 0.5 }, data: [{name: 'Sensor A'}, {name: 'Gateway 1'}, {name: 'Cloud'}], links: [{source: 'Sensor A', target: 'Gateway 1', value: 5}, {source: 'Gateway 1', target: 'Cloud', value: 8}], label: { color: '#fff' } } };

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

export default SankeyDiagramWidget;