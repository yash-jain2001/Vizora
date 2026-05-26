import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-250 cursor-pointer ${
      isActive
        ? "bg-linear-to-r from-emerald-500/15 to-teal-500/5 text-emerald-400 border-l-2 border-emerald-500 shadow-[inset_0_0_12px_rgba(16,185,129,0.05)]"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`;

  return (
    <div className="w-[260px] min-h-screen bg-brand-dark/95 border-r border-brand-border text-white p-5 flex flex-col justify-between shrink-0">
      <div className="flex flex-col">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-wider bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
            Vizora
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1.5">
          <NavLink to="/dashboard" className={getLinkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink to="/datasources" className={getLinkClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V10.125" />
            </svg>
            Datasources
          </NavLink>

          <button className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 text-left cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Alerts
          </button>

          <button className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 text-left cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.99l1.004.831a1.125 1.125 0 01.26 1.43l-1.297 2.247a1.125 1.125 0 01-1.37.491l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.83c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.831a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      {user && (
        <div className="border-t border-brand-border pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold uppercase shadow-inner">
              {user.name ? user.name[0] : "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-slate-200 truncate">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 capitalize truncate">
                {user.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 text-left cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;