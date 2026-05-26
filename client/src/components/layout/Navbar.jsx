import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "System Dashboard";
      case "/datasources":
        return "Connected Datasources";
      default:
        return "Vizora Platform";
    }
  };

  return (
    <div className="h-[76px] bg-brand-card/30 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {getTitle()}
        </h2>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/10 font-semibold select-none">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Live Feed
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] text-slate-950 font-bold transition-all duration-250 py-2.5 px-4.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Widget
        </button>
      </div>
    </div>
  );
};

export default Navbar;