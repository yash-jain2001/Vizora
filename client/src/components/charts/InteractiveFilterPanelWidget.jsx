

const InteractiveFilterPanelWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="flex flex-col gap-4 w-full px-4 py-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400">Date Range</label>
          <select className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg p-2"><option>Last 7 Days</option><option>Last 30 Days</option></select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400">Device Types</label>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs">Sensors</span>
            <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-full text-xs">Gateways</span>
          </div>
        </div>
        <button className="mt-2 w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-2 rounded-lg text-sm transition-colors">Apply Filters</button>
      </div>
      </div>
    </div>
  );
};

export default InteractiveFilterPanelWidget;