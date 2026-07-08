import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.jpeg";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500 shadow-[inset_1px_0_0_0_rgba(16,185,129,0.1)]"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="w-[260px] min-h-screen bg-brand-dark/95 border-r border-brand-border text-white p-6 flex flex-col justify-between select-none">
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-10 px-2">
          <img
            src={logo}
            alt="Vizora Logo"
            className="w-8 h-8 rounded-lg object-cover shadow-[0_0_15px_rgba(16,185,129,0.25)]"
          />
          <span className="text-2xl font-black bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
            Vizora
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={getLinkClass}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
            Dashboard
          </NavLink>

          <NavLink to="/designforge" className={getLinkClass}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
            DesignForge ERP
          </NavLink>

          <NavLink to="/datasources" className={getLinkClass}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 0v3.75m-16.5-3.75v3.75"
              />
            </svg>
            Datasources
          </NavLink>

          <NavLink to="/alerts" className={getLinkClass}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a9.04 9.04 0 01-2.937 1.248c-.07.03-.15.03-.22 0a9.032 9.032 0 01-2.937-1.248M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
              />
            </svg>
            Alerts
          </NavLink>

          <NavLink to="/analytics" className={getLinkClass}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a9.04 9.04 0 01-2.937 1.248c-.07.03-.15.03-.22 0a9.032 9.032 0 01-2.937-1.248M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
              />
            </svg>
            Analytics
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={getLinkClass}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
              Admin Panel
            </NavLink>
          )}
        </div>
      </div>

      {/* USER & PROFILE SECTION */}
      <div className="border-t border-brand-border/60 pt-6">
        <div className="bg-brand-card/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-white uppercase shadow-inner">
            {user?.name?.slice(0, 2) || "OP"}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-white truncate">
              {user?.name || "Operator"}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {user?.role || "viewer"}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-red-400 px-4 py-3 rounded-xl w-full font-bold text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_4px_15px_rgba(239,68,68,0.25)]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
