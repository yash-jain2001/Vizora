import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import socket from "../../hooks/useSocket";

const NotificationBell = () => {
  const [alerts, setAlerts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching bell alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Listen for live alerts via Socket.IO
    socket.on("new-alert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged && !a.resolved).length;

  const handleAcknowledge = async (id, e) => {
    e.stopPropagation();
    try {
      await API.put(`/alerts/acknowledge/${id}`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, acknowledged: true } : a))
      );
    } catch (err) {
      console.error("Error acknowledging alert:", err);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-white/5";
    }
  };

  return (
    <div className="relative select-none">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-white transition-all cursor-pointer"
        title="Notifications"
      >
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
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Unread Counter Badge */}
        {unacknowledgedCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-lg animate-pulse">
            {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-brand-card border border-white/10 shadow-2xl z-50 overflow-hidden animate-fade-in">
          <div className="p-4 bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Notifications</span>
              <span className="text-[10px] font-black text-slate-400 bg-slate-900 border border-white/5 px-2 py-0.5 rounded-md font-mono">
                {unacknowledgedCount} Active
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/alerts");
              }}
              className="text-[10px] font-extrabold uppercase text-emerald-400 hover:text-emerald-300"
            >
              View All →
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-semibold">
                No active notifications
              </div>
            ) : (
              alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert._id}
                  className={`p-4 transition-colors flex flex-col gap-2 ${
                    !alert.acknowledged && !alert.resolved
                      ? "bg-slate-900/50"
                      : "bg-transparent opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{alert.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-tight">{alert.message}</p>
                  </div>

                  {!alert.acknowledged && !alert.resolved && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={(e) => handleAcknowledge(alert._id, e)}
                        className="text-[9px] font-black uppercase text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-md border border-white/5"
                      >
                        Acknowledge
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
