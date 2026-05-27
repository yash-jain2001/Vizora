const DashboardSwitcher = ({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,
}) => {

  return (
    <select
      value={selectedDashboard}
      onChange={(e) =>
        setSelectedDashboard(
          e.target.value
        )
      }
      className="bg-[#1F2937] text-white px-4 py-3 rounded-lg border border-[#374151]"
    >

      <option value="">
        Select Dashboard
      </option>

      {dashboards.map(
        (dashboard) => (

          <option
            key={dashboard._id}
            value={dashboard._id}
          >
            {dashboard.title}
          </option>

        )
      )}

    </select>
  )

}

export default DashboardSwitcher