import { useState, useEffect, useContext } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCard from "../components/widgets/StatsCard";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const { user: currentUser } = useContext(AuthContext);

  // States
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    dashboards: 0,
    datasources: 0,
    activeAlerts: 0,
  });
  const [settings, setSettings] = useState({
    registrationEnabled: true,
    emailAlerts: false,
    socketEmits: true,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [addModalLoading, setAddModalLoading] = useState(false);
  const [addModalError, setAddModalError] = useState("");

  // Data Fetching
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes, settingsRes, logsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/stats"),
        API.get("/admin/settings"),
        API.get("/admin/logs"),
      ]);

      setUsers(usersRes.data);
      setStats(statsRes.data);
      setSettings(settingsRes.data);
      setLogs(logsRes.data);
      setError(null);
    } catch (err) {
      console.error("Error loading admin control panel data:", err);
      setError("Failed to fetch administrative data. Please verify your permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Toggle Settings Handler
  const handleSettingToggle = async (key) => {
    try {
      const newValue = !settings[key];
      setSettings((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      await API.put("/admin/settings", { key, value: newValue });
      
      // Reload logs to show config update
      const logsRes = await API.get("/admin/logs");
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Error toggling system setting:", err);
      // Revert state
      setSettings((prev) => ({
        ...prev,
        [key]: settings[key],
      }));
      alert("Failed to update system setting.");
    }
  };

  // Role Modification Handler
  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      
      // Update state local
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );

      // Reload stats and logs
      const [statsRes, logsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/logs"),
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Error modifying user role:", err);
      alert("Failed to update user role.");
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (targetUser) => {
    if (currentUser && currentUser._id === targetUser._id) {
      alert("You cannot delete your own logged-in account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user account: ${targetUser.email}?`)) {
      return;
    }

    try {
      await API.delete(`/admin/users/${targetUser._id}`);
      
      // Remove local user
      setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));

      // Reload stats and logs
      const [statsRes, logsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/logs"),
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error("Error deleting user account:", err);
      alert("Failed to delete user account.");
    }
  };

  // Add User Submission
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setAddModalLoading(true);
    setAddModalError("");

    try {
      await API.post("/admin/users", newUserData);
      
      // Reset & close modal
      setNewUserData({
        name: "",
        email: "",
        password: "",
        role: "member",
      });
      setIsAddModalOpen(false);

      // Re-fetch everything
      await fetchAllData();
    } catch (err) {
      console.error("Error manually adding user:", err);
      setAddModalError(err.response?.data?.message || "Failed to create user account.");
    } finally {
      setAddModalLoading(false);
    }
  };

  // Filtered Users computation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getLogColor = (level) => {
    switch (level) {
      case "WARN":
        return "text-amber-400";
      case "CONFIG":
        return "text-sky-400";
      case "ERROR":
        return "text-red-400 font-extrabold";
      case "INFO":
      default:
        return "text-emerald-400";
    }
  };

  if (loading && users.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-400 font-medium">Initializing Administration Space...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Control Center
          </h1>
          <p className="text-gray-400 text-sm">
            Manage system configurations, user permissions, and monitor security audit events.
          </p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer w-full md:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Add New Member
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
          <button onClick={fetchAllData} className="ml-auto underline text-xs font-bold hover:text-red-300">Retry</button>
        </div>
      )}

      {/* ADMIN METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 select-none">
        <StatsCard title="Active Devices" value={stats.users} color="#10b981" />
        <StatsCard title="Temperature" value={stats.dashboards} color="#3b82f6" />
        <StatsCard title="Energy Usage" value={stats.datasources} color="#f59e0b" />
        <StatsCard title="Alerts" value={stats.activeAlerts} color="#ef4444" />
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* USER DIRECTORY & MEMBERSHIP */}
        <div className="xl:col-span-2 bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">
              User Directory & Membership
            </h2>
            
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40 w-44"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="pb-4">Name</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Assign Role</th>
                  <th className="pb-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{u.name}</span>
                          {currentUser && currentUser._id === u._id && (
                            <span className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded-sm font-mono">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 font-mono text-xs text-slate-400">{u.email}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border select-none ${
                            u.role === "admin"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                              : u.role === "member"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                              : "bg-slate-500/10 text-slate-400 border-slate-500/25"
                          }`}>
                            {u.role}
                          </span>

                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={currentUser && currentUser._id === u._id}
                            className="bg-slate-950/80 border border-white/5 text-slate-300 text-[10px] px-2 py-1 rounded-lg focus:outline-none focus:border-emerald-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={currentUser && currentUser._id === u._id}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 transition px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 text-xs">
                      No members matched the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANELS: CONTROLS & LOGS */}
        <div className="flex flex-col gap-6">
          
          {/* SYSTEM SETTINGS & CONFIGS */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-lg font-bold text-white mb-6 tracking-tight">
              Settings & Overrides
            </h2>
            
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">Allow Public Registration</p>
                  <p className="text-xs text-slate-500">Allow visitors to create accounts themselves</p>
                </div>
                <button
                  onClick={() => handleSettingToggle("registrationEnabled")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 flex-shrink-0 ${
                    settings.registrationEnabled ? "bg-emerald-500 border-emerald-600" : "bg-slate-850 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.registrationEnabled ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">Dispatch Email Alerts</p>
                  <p className="text-xs text-slate-500">Notify operations team for high priority alarms</p>
                </div>
                <button
                  onClick={() => handleSettingToggle("emailAlerts")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 flex-shrink-0 ${
                    settings.emailAlerts ? "bg-emerald-500 border-emerald-600" : "bg-slate-850 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.emailAlerts ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">Websocket Telemetry Feed</p>
                  <p className="text-xs text-slate-500">Enable real-time updates to connected pages</p>
                </div>
                <button
                  onClick={() => handleSettingToggle("socketEmits")}
                  className={`w-11 h-6 rounded-full transition-colors duration-250 cursor-pointer border relative p-0.5 flex-shrink-0 ${
                    settings.socketEmits ? "bg-emerald-500 border-emerald-600" : "bg-slate-850 border-slate-700"
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform duration-250 shadow-md ${settings.socketEmits ? "translate-x-5" : "translate-x-0"}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* AUDIT LOGS CONSOLE */}
          <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex-1 flex flex-col min-h-[350px]">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Security Audit Logs
              </h2>
              
              <button
                onClick={async () => {
                  const res = await API.get("/admin/logs");
                  setLogs(res.data);
                }}
                className="text-slate-400 hover:text-white transition p-1 hover:bg-white/5 rounded-lg cursor-pointer"
                title="Refresh Logs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

            <div className="flex-1 bg-slate-950/70 border border-brand-border/60 rounded-xl p-4 font-mono text-[10px] overflow-y-auto max-h-[300px] flex flex-col gap-2">
              {logs.length > 0 ? (
                logs.map((log) => {
                  const logTime = new Date(log.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  return (
                    <div key={log._id} className="border-b border-white/5 pb-2 last:border-b-0">
                      <div className="flex justify-between gap-2 text-slate-500 font-bold mb-1">
                        <span>[{log.level}] {logTime}</span>
                        <span className="text-[9px] uppercase tracking-wide truncate max-w-[80px]">by {log.user}</span>
                      </div>
                      <p className={`${getLogColor(log.level)} break-words leading-relaxed`}>
                        {log.action}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                  No security audits logged.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-[450px] shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-white mb-2">Create New Member</h2>
            <p className="text-xs text-slate-400 mb-6">Manually register a system operator or viewer</p>

            {addModalError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 font-medium">
                {addModalError}
              </div>
            )}

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanshu Jain"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Secure Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  System Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="member">Member (Operator)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-sm text-slate-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addModalLoading}
                  className="flex-1 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addModalLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"></div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Admin;