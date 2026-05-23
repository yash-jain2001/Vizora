const Sidebar = () => {
  return (
    <div className="w-[260px] min-h-screen bg-black text-white p-6 flex flex-col">

      <h1 className="text-3xl font-bold mb-10 text-green-500">
        Vizora
      </h1>

      <div className="flex flex-col gap-5 text-lg">

        <button className="text-left hover:text-green-400 transition">
          Dashboard
        </button>

        <button className="text-left hover:text-green-400 transition">
          Alerts
        </button>

        <button className="text-left hover:text-green-400 transition">
          Datasources
        </button>

        <button className="text-left hover:text-green-400 transition">
          Settings
        </button>

      </div>
    </div>
  );
};

export default Sidebar;