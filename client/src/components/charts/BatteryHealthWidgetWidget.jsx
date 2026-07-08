

const BatteryHealthWidgetWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="relative w-24 h-48 border-4 border-slate-600 rounded-lg p-1 flex flex-col justify-end overflow-hidden">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-600 rounded-t-sm"></div>
          <div className="w-full bg-emerald-500 rounded-sm transition-all duration-1000" style={{ height: '78%' }}></div>
          <div className="absolute inset-0 flex items-center justify-center text-white font-black text-2xl drop-shadow-md">78%</div>
        </div>
        <span className="mt-4 text-emerald-400 font-semibold text-sm">Status: Charging</span>
      </div>
      </div>
    </div>
  );
};

export default BatteryHealthWidgetWidget;