

const TankLevelVisualizationWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{title}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="relative w-32 h-40 border-4 border-slate-700 rounded-b-3xl rounded-t-md p-1 flex flex-col justify-end overflow-hidden">
          <div className="w-full bg-blue-500/80 rounded-b-2xl rounded-t-sm transition-all duration-1000" style={{ height: '45%' }}></div>
          <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl drop-shadow-md">450L / 1000L</div>
        </div>
        <span className="mt-4 text-blue-400 font-semibold text-sm">Tank A Level</span>
      </div>
      </div>
    </div>
  );
};

export default TankLevelVisualizationWidget;