

const SensorTelemetryWidgetWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="text-slate-400 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shadow-inner">
             <span className="text-2xl">⚡</span>
          </div>
          <p className="font-semibold text-sm text-white">Sensor Telemetry Widget</p>
          <p className="text-xs mt-1">Generic custom component</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SensorTelemetryWidgetWidget;