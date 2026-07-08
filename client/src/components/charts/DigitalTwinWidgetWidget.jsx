

const DigitalTwinWidgetWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full flex flex-col items-center justify-center perspective-[1000px]">
        <div className="w-32 h-32 bg-slate-800 border-4 border-sky-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)] animate-[spin_10s_linear_infinite]" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(45deg)' }}>
           <div className="absolute w-full h-full border-2 border-sky-400/50 rounded-xl" style={{ transform: 'translateZ(-20px)' }}></div>
           <div className="absolute w-full h-full border-2 border-sky-400/50 rounded-xl" style={{ transform: 'translateZ(20px)' }}></div>
        </div>
        <div className="mt-8 text-center">
          <span className="text-sky-400 font-bold tracking-widest text-xs uppercase">Engine Block 04</span>
          <div className="text-white text-sm">Temp: 84°C | RPM: 3400</div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DigitalTwinWidgetWidget;