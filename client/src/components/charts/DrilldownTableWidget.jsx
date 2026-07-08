

const DrilldownTableWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{title}</h3>
      <div className="flex-1 w-full overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="p-3 text-slate-400 text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="p-3 text-slate-400 text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="p-3 text-slate-400 text-xs font-bold uppercase tracking-wider">Value</th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3,4].map(i => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="p-3 text-slate-300 text-sm font-mono">SYS-00{i}</td>
                <td className="p-3">
                  <span className={"px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest " + (i%2===0 ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/20 text-sky-400")}>{i%2===0 ? "Active" : "Pending"}</span>
                </td>
                <td className="p-3 text-white font-bold text-sm">{Math.floor(Math.random() * 100)} unit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrilldownTableWidget;