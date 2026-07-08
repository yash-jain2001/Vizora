import { useState, useEffect } from 'react';
import socket from './useSocket';

const useWidgetData = (widget, initialOption) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // The widget configuration defines what fields to use
    const xField = widget?.xAxis || 'time';
    const yField = widget?.yAxis || 'value';
    
    // Handle incoming data
    const handleLiveData = (newData) => {
      setData((prev) => {
        // We create a generic data point based on the widget's config
        const yValue = widget?.queryKey 
          ? newData[widget.queryKey] 
          : (newData.temperature || Math.floor(Math.random() * 100));

        const dataPoint = {
          [xField]: newData.time || new Date().toLocaleTimeString(),
          [yField]: yValue,
          ...newData
        };

        const updated = [...prev, dataPoint];
        // Keep the last 15 points for charts
        return updated.slice(-15);
      });
      setLoading(false);
    };

    socket.on('live-data', handleLiveData);
    
    return () => {
      socket.off('live-data', handleLiveData);
    };
  }, [widget?.xAxis, widget?.yAxis, widget?.queryKey]);

  // If initialOption is provided, we are dealing with an ECharts widget
  // We need to return a populated ECharts option object
  if (initialOption) {
    const option = JSON.parse(JSON.stringify(initialOption)); // Deep clone
    if (option.series && option.series.length > 0) {
      if (option.series[0].type === 'gauge') {
         const latestValue = data.length > 0 ? data[data.length - 1][widget?.yAxis || 'value'] : (option.series[0].data?.[0]?.value || 0);
         option.series[0].data = [{ value: latestValue }];
      } else {
         option.series[0].data = data.map(d => d[widget?.yAxis || 'value'] || 0);
         if (option.xAxis && !Array.isArray(option.xAxis)) {
            option.xAxis.data = data.map(d => d[widget?.xAxis || 'time']);
         } else if (option.xAxis && Array.isArray(option.xAxis)) {
            option.xAxis[0].data = data.map(d => d[widget?.xAxis || 'time']);
         }
      }
    }
    return option; // Return the option object directly for ECharts!
  }

  // Otherwise, return { data, loading, error } for Recharts or custom widgets
  return { data, loading, error };
};

export default useWidgetData;
