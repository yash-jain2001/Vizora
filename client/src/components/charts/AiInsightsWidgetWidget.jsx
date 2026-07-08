

const AiInsightsWidgetWidget = ({ widget }) => {
  return (
    <div className="w-full h-full flex flex-col pt-3 pb-4 px-4 relative bg-brand-card/45">
      <h3 className="text-white font-bold text-sm mb-4 truncate pr-10">{widget?.title || "Chart"}</h3>
      <div className="flex-1 w-full h-full overflow-hidden relative">
        
      <div className="w-full h-full flex flex-col gap-3 px-2">
        <div className="flex items-start gap-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 text-white font-bold text-xs">AI</div>
          <p className="text-sm text-slate-300 leading-relaxed">
            <strong className="text-indigo-400">Insight:</strong> Anomaly detected in Line 4 energy usage. This pattern historically precedes a motor failure. Recommendation: Schedule maintenance within 48h.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AiInsightsWidgetWidget;