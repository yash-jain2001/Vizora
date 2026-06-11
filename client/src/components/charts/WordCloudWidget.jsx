import React from 'react';
import ReactECharts from 'echarts-for-react';
import 'echarts-wordcloud';

const WordCloudWidget = ({ title = 'Word Cloud' }) => {
  const option = { series: [{ type: 'wordCloud', shape: 'circle', left: 'center', top: 'center', width: '100%', height: '100%', sizeRange: [12, 60], rotationRange: [-90, 90], gridSize: 8, textStyle: { color: () => 'rgb(' + [Math.round(Math.random() * 160) + 95, Math.round(Math.random() * 160) + 95, Math.round(Math.random() * 160) + 95].join(',') + ')' }, data: [{ name: 'IoT', value: 10000 }, { name: 'Sensors', value: 6181 }, { name: 'Data', value: 4386 }] }] };

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

export default WordCloudWidget;