import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "System Dashboard";
      case "/datasources":
        return "Connected Datasources";
      case "/alerts":
        return "Alert Center";
      case "/admin":
        return "Administration Space";
      default:
        return "Vizora Platform";
    }
  };

  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="h-[76px] bg-brand-dark/40 backdrop-blur-xl border-b border-brand-border/60 flex items-center justify-between px-8 select-none">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {getTitle()}
        </h2>
        
        {/* Status Dot */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Live Connection
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Clock */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/40 border border-brand-border px-3.5 py-1.5 rounded-xl font-mono">
          <span className="text-emerald-500">SYSTEM:</span>
          <span>{formattedTime}</span>
        </div>

        {/* Latency Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>12ms latency</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;