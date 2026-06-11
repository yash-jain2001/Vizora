import React from 'react';

const KpiCardWidget = ({ title = 'KPI Card' }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{title}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full flex flex-col justify-center gap-4 px-4">
        <div className="flex justify-between items-end">
           <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Revenue</span>
           <span className="text-emerald-400 text-sm font-bold flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg> 12.5%</span>
        </div>
        <div className="text-5xl font-black text-white tracking-tight">$84,230</div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-[75%] h-full bg-emerald-500 rounded-full"></div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default KpiCardWidget;