import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';

// A deep clone and mutate function to apply a factor to all numbers in an object/array
const applyFactor = (obj, factor) => {
  if (obj === null || typeof obj === 'undefined') return obj;
  if (typeof obj === 'number') {
    // Only apply factor if it's a value that looks like data, not an index or small config
    // Actually, to make it realistic, let's just apply to numbers > 10 or specifically data arrays.
    // For simplicity, we apply to any number > 5, or if it's a data value.
    if (Math.abs(obj) > 5) {
      return Math.round(obj * factor * 100) / 100;
    }
    return obj;
  }
  if (typeof obj === 'string' || typeof obj === 'boolean') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => applyFactor(item, factor));
  }
  
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Don't apply to layout properties
        if (['borderRadius', 'symbolSize', 'edgeSymbolSize', 'gridSize'].includes(key)) {
          newObj[key] = obj[key];
        } else {
          newObj[key] = applyFactor(obj[key], factor);
        }
      }
    }
    return newObj;
  }
  
  return obj;
};

const useWidgetData = (chartType, initialOption) => {
  const [option, setOption] = useState(initialOption);

  useEffect(() => {
    let isMounted = true;
    
    const fetchLiveData = async () => {
      try {
        const res = await API.get(`/dashboard/widget-data/${chartType}`);
        const { factor } = res.data;
        
        if (isMounted) {
          setOption(prev => applyFactor(prev, factor));
        }
      } catch (err) {
        console.error('Error fetching live data for', chartType, err);
      }
    };

    // Initial fetch
    fetchLiveData();

    // Poll every 5 seconds
    const interval = setInterval(fetchLiveData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [chartType]);

  return option;
};

export default useWidgetData;
