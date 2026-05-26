const WidgetContainer = ({ title, children }) => {
  return (
    <div className="bg-brand-card/30 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-brand-border flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {title}
        </h2>

        <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 cursor-pointer">
          Configure
        </button>
      </div>

      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  );
};

export default WidgetContainer;