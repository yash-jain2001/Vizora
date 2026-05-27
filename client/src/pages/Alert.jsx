import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";
import socket from "../hooks/useSocket";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  /* FETCH ALERTS */
  useEffect(() => {
    let active = true;
    const fetchAlerts = async () => {
      try {
        const res = await API.get("/alerts");
        if (active) {
          setAlerts(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlerts();
    return () => {
      active = false;
    };
  }, []);

  /* LIVE ALERTS */
  useEffect(() => {
    socket.on("new-alert", (alert) => {
      setAlerts((prev) => [alert, ...prev]);
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return {
          container: "bg-red-500/5 border-red-500/20 hover:border-red-500/40 shadow-[0_8px_32px_rgba(239,68,68,0.05)]",
          badge: "bg-red-500/10 text-red-400 border-red-500/25",
          iconColor: "text-red-400",
        };
      case "medium":
        return {
          container: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 shadow-[0_8px_32px_rgba(245,158,11,0.05)]",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/25",
          iconColor: "text-amber-400",
        };
      default:
        return {
          container: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40 shadow-[0_8px_32px_rgba(59,130,246,0.05)]",
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/25",
          iconColor: "text-blue-400",
        };
    }
  };

  const getSeverityIcon = (severity) => {
    const iconClass = "w-5 h-5";
    switch (severity?.toLowerCase()) {
      case "high":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "medium":
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Alert Center
        </h1>
        <p className="text-gray-400">
          Realtime operations monitoring alerts and notifications
        </p>
      </div>

      <div className="flex flex-col h-[650px] overflow-y-scroll gap-4">
        {alerts.length === 0 ? (
          <div className="bg-brand-card/45  backdrop-blur-xl border-white/5 p-12 rounded-2xl text-center select-none">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">System fully functional</h3>
            <p className="text-sm text-slate-500">No warnings or critical alerts currently active.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert._id}
                className={`p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${styles.container}`}
              >
                <div className={`p-2.5 rounded-xl bg-slate-900/60 border border-white/5 ${styles.iconColor}`}>
                  {getSeverityIcon(alert.severity)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-2 flex-wrap sm:flex-nowrap">
                    <h2 className="text-lg font-bold text-white truncate">
                      {alert.title}
                    </h2>

                    <div className="flex items-center gap-3">
                      <span className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles.badge}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider font-mono">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span>
                      Trigger value: <span className="text-white font-bold">{alert.value}°C</span>
                    </span>
                    <span>•</span>
                    <span>
                      Status: <span className={alert.resolved ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{alert.resolved ? "Resolved" : "Active"}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;