

const FloorPlanVisualizationWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full border-2 border-slate-700/50 rounded-xl relative bg-slate-900/50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-4 border border-slate-600 grid grid-cols-3 grid-rows-2 gap-1 p-1">
           <div className="border border-slate-700 bg-slate-800 relative flex items-center justify-center"><span className="absolute w-3 h-3 bg-emerald-500 rounded-full top-2 right-2 animate-ping"></span><span className="text-slate-500 font-bold text-xs">Zone A</span></div>
           <div className="border border-slate-700 bg-slate-800 flex items-center justify-center"><span className="text-slate-500 font-bold text-xs">Zone B</span></div>
           <div className="border border-slate-700 bg-slate-800 flex items-center justify-center"><span className="text-slate-500 font-bold text-xs">Zone C</span></div>
           <div className="border border-slate-700 bg-slate-800 col-span-2 flex items-center justify-center"><span className="text-slate-500 font-bold text-xs">Main Floor</span></div>
           <div className="border border-slate-700 bg-slate-800 relative flex items-center justify-center"><span className="absolute w-3 h-3 bg-red-500 rounded-full bottom-2 left-2 animate-pulse"></span><span className="text-slate-500 font-bold text-xs">Server Room</span></div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FloorPlanVisualizationWidget;