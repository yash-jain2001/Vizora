

const AlarmeventPanelWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{title}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full flex flex-col gap-2 overflow-auto pr-2">
        <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-r-lg flex justify-between items-center">
          <div><h4 className="text-red-400 font-bold text-sm">Critical Temp Override</h4><span className="text-slate-400 text-xs">Sensor T-45</span></div>
          <span className="text-red-500 text-xs font-mono">10:42 AM</span>
        </div>
        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-lg flex justify-between items-center">
          <div><h4 className="text-amber-400 font-bold text-sm">Pressure Warning</h4><span className="text-slate-400 text-xs">Valve V-12</span></div>
          <span className="text-amber-500 text-xs font-mono">10:38 AM</span>
        </div>
        <div className="bg-slate-800/50 border-l-4 border-slate-500 p-3 rounded-r-lg flex justify-between items-center">
          <div><h4 className="text-slate-300 font-bold text-sm">System Update</h4><span className="text-slate-500 text-xs">Gateway G-01</span></div>
          <span className="text-slate-500 text-xs font-mono">09:15 AM</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AlarmeventPanelWidget;