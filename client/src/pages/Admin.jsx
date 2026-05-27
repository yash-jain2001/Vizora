import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCard from "../components/widgets/StatsCard";

const Admin = () => {
  const users = [
    { id: 1, name: "Priyanshu Jain", email: "priyanshu@company.com", role: "admin", status: "Active" },
    { id: 2, name: "Yash Jain", email: "yash@company.com", role: "admin", status: "Active" },
    { id: 3, name: "John Operator", email: "john@company.com", role: "member", status: "Active" },
    { id: 4, name: "Sarah Viewer", email: "sarah@company.com", role: "viewer", status: "Inactive" },
  ];

  const [settings, setSettings] = useState({
    registrationEnabled: true,
    emailAlerts: false,
    socketEmits: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Admin Control Center
        </h1>
        <p className="text-gray-400">
          Manage system configurations, user access permissions, and monitor system-wide audit logs
        </p>
      </div>

      {/* ADMIN METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
        <StatsCard title="Total Registered Users" value={users.length} color="#10b981" />
        <StatsCard title="Database Load" value="18%" color="#3b82f6" />
        <StatsCard title="MQTT Brokers Connected" value="1 / 1" color="#f59e0b" />
        <StatsCard title="Audit Logs Recorded" value="1,048" color="#a855f7" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* USER MANAGEMENT */}
        <div className="xl:col-span-2 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
            User Directory & Permissions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Role</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-semibold text-white">{u.name}</td>
                    <td className="py-4 font-mono text-xs text-slate-400">{u.email}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        u.role === "admin"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : u.role === "member"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/25"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-500"}`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition px-3 py-1.5 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 cursor-pointer">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CONTROLS & LOGS */}
        <div className="flex flex-col gap-6">
          {/* SYSTEM SETTINGS */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
              Settings & Overrides
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Allow Public Registration</p>
                  <p className="text-xs text-slate-500">Allow users to sign up themselves</p>
                </div>
                <button
                  onClick={() => handleToggle("registrationEnabled")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 ${
                    settings.registrationEnabled ? "bg-emerald-500 border-emerald-600" : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.registrationEnabled ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Email Notification Dispatch</p>
                  <p className="text-xs text-slate-500">Notify admins of high-critical alerts</p>
                </div>
                <button
                  onClick={() => handleToggle("emailAlerts")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 ${
                    settings.emailAlerts ? "bg-emerald-500 border-emerald-600" : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.emailAlerts ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Websocket Telemetry Feed</p>
                  <p className="text-xs text-slate-500">Emit live data updates to UI clients</p>
                </div>
                <button
                  onClick={() => handleToggle("socketEmits")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 ${
                    settings.socketEmits ? "bg-emerald-500 border-emerald-600" : "bg-slate-800 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.socketEmits ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* AUDIT LOGS */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex-1">
            <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
              Audit Logs
            </h2>
            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                <p className="text-emerald-400 font-bold">[INFO] 23:42:01</p>
                <p className="text-slate-300 mt-1">Database backup compiled successfully</p>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                <p className="text-blue-400 font-bold">[CONFIG] 22:15:34</p>
                <p className="text-slate-300 mt-1">MQTT Topic modified in configuration</p>
              </div>
              <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5">
                <p className="text-amber-400 font-bold">[WARN] 21:05:52</p>
                <p className="text-slate-300 mt-1">Failed login attempt: admin@company.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;