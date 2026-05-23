const StatsCard = ({ title, value, color }) => {
  return (
    <div className="bg-[#1F2937] p-6 rounded-2xl border border-[#374151] shadow-xl">

      <h3 className="text-gray-400 text-sm mb-2">
        {title}
      </h3>

      <h1
        className="text-4xl font-bold"
        style={{ color }}
      >
        {value}
      </h1>

    </div>
  );
};

export default StatsCard;