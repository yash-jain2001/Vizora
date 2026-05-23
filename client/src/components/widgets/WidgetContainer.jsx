const WidgetContainer = ({ title, children }) => {
  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 shadow-xl border border-[#374151]">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        <button className="text-sm text-green-400 hover:text-green-300">
          View Details
        </button>

      </div>

      {children}

    </div>
  );
};

export default WidgetContainer;