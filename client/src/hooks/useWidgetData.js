import { useState, useEffect } from 'react';
import socket from './useSocket';

const useWidgetData = (widget) => {
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
        // In a real production app, this would use API.post('/query', { datasourceId, query: widget.dataset })
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

    // If the widget has a specific refresh interval, we could set up polling here
    // For now, we subscribe to the global stream and format it generically
    socket.on('live-data', handleLiveData);
    
    return () => {
      socket.off('live-data', handleLiveData);
    };
  }, [widget?.xAxis, widget?.yAxis, widget?.queryKey]);

  return { data, loading, error };
};

export default useWidgetData;
