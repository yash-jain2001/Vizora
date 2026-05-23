const Navbar = () => {
  return (
    <div className="h-[70px] bg-[#1F2937] border-b border-[#374151] flex items-center justify-between px-6">

      <h2 className="text-2xl font-semibold text-white">
        Dashboard
      </h2>

      <button className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white font-semibold transition">
        Add Widget
      </button>

    </div>
  );
};

export default Navbar;