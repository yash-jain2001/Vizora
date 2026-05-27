const DashboardSwitcher = ({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,
}) => {
  return (
    <select
      value={selectedDashboard}
      onChange={(e) => setSelectedDashboard(e.target.value)}
      className="bg-brand-card/60 backdrop-blur-xl text-white px-4.5 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 font-semibold cursor-pointer text-sm"
    >
      <option value="" className="bg-brand-card text-slate-400">
        Select Dashboard
      </option>
      {dashboards.map((dashboard) => (
        <option
          key={dashboard._id}
          value={dashboard._id}
          className="bg-brand-card text-white"
        >
          {dashboard.title}
        </option>
      ))}
    </select>
  );
};

export default DashboardSwitcher;