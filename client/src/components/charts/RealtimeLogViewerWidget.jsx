

const RealtimeLogViewerWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full bg-slate-950 p-4 font-mono text-xs overflow-auto rounded-lg border border-slate-800 flex flex-col gap-1">
        <span className="text-emerald-400">[INFO] 2026-06-11 10:14:02 - Connection established</span>
        <span className="text-sky-400">[DEBUG] Executing SELECT * FROM metrics WHERE temp &gt; 30</span>
        <span className="text-white">Query returned 14 results in 0.04s.</span>
        <span className="text-amber-400">[WARN] High latency detected on node-3</span>
        <span className="text-white">{"> "} <span className="animate-pulse">_</span></span>
      </div>
      </div>
    </div>
  );
};

export default RealtimeLogViewerWidget;