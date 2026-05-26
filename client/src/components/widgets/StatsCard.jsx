const StatsCard = ({ title, value, color }) => {
  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (title) {
      case "Active Devices":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
          </svg>
        );
      case "Temperature":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "Energy Usage":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        );
      case "Alerts":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-brand-card/40 border border-brand-border p-6 rounded-2xl shadow-lg hover:shadow-xl hover:border-slate-800 transition-all duration-300 flex items-center justify-between group hover:-translate-y-0.5">
      <div className="flex flex-col">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
          {title}
        </span>
        <span 
          className="text-3xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {value || 0}
        </span>
      </div>

      <div 
        className="h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
        style={{ 
          backgroundColor: `${color}15`, 
          color: color,
          border: `1px solid ${color}25`
        }}
      >
        {getIcon()}
      </div>
    </div>
  );
};

export default StatsCard;