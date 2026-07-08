
import ReactECharts from 'echarts-for-react';
import useWidgetData from '../../hooks/useWidgetData';


const NetworkGraphWidget = ({ widget }) => {
  const initialOption = { series: [{ type: 'graph', layout: 'force', symbolSize: 30, roam: true, label: { show: true, color: '#fff' }, force: { repulsion: 200 }, edgeSymbol: ['circle', 'arrow'], edgeSymbolSize: [4, 10], data: [{ name: 'Node 1' }, { name: 'Node 2' }, { name: 'Node 3' }], links: [{ source: 'Node 1', target: 'Node 2' }, { source: 'Node 2', target: 'Node 3' }], lineStyle: { color: '#8b5cf6', width: 2, curveness: 0.2 } }] };
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

export default NetworkGraphWidget;