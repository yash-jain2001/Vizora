import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";
import socket from "../hooks/useSocket";
import { AuthContext } from "../context/AuthContext";

const Alerts = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("alerts"); // 'alerts' | 'rules' | 'channels' | 'escalation'
  const [alerts, setAlerts] = useState([]);
  const [rules, setRules] = useState([]);
  const [channels, setChannels] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Create/Edit Rule Modal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    name: "",
    target: "",
    condition: "gt",
    threshold: 0,
    severity: "high",
    channels: ["bell", "toast"],
    webhookUrl: ""
  });

  // Manual Trigger Alert Modal
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [triggerForm, setTriggerForm] = useState({
    title: "",
    message: "",
    severity: "high",
    value: 0,
    webhookUrl: ""
  });

  // Multi-Channel Add Modal State
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [channelType, setChannelType] = useState("slack");
  const [channelName, setChannelName] = useState("");
  const [channelConfig, setChannelConfig] = useState({});
  const [testingChannel, setTestingChannel] = useState(false);
  const [channelTestResult, setChannelTestResult] = useState(null);

  // Escalation Policy Modal State
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [escalationForm, setEscalationForm] = useState({
    name: "",
    severity: "critical",
    l1Contacts: "",
    l2Delay: 5,
    l2Contacts: "",
    l3Delay: 15,
    l3Contacts: ""
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* FETCH DATA */
  const fetchData = async () => {
    try {
      setLoading(true);
      const alertsRes = await API.get("/alerts");
      setAlerts(alertsRes.data);
      const rulesRes = await API.get("/alerts/rules");
      setRules(rulesRes.data);
      const channelsRes = await API.get("/alerts/channels");
      setChannels(channelsRes.data);
      const escalationsRes = await API.get("/alerts/escalations");
      setEscalations(escalationsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching alerts data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* LIVE SOCKET ALERTS */
  useEffect(() => {
    socket.on("new-alert", (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`🚨 Alert Triggered: ${newAlert.title}`);
    });

    socket.on("alert-escalated", (data) => {
      showToast(`⚠️ Alert Escalated to Level ${data.level}!`);
      fetchData();
    });

    return () => {
      socket.off("new-alert");
      socket.off("alert-escalated");
    };
  }, []);

  /* ACKNOWLEDGE */
  const handleAcknowledge = async (id) => {
    try {
      await API.put(`/alerts/acknowledge/${id}`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, acknowledged: true } : a))
      );
      showToast("Alert acknowledged.");
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  /* RESOLVE */
  const handleResolve = async (id) => {
    try {
      await API.put(`/alerts/resolve/${id}`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, resolved: true, resolvedAt: new Date() } : a))
      );
      showToast("Alert resolved.");
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  /* CLEAR RESOLVED */
  const handleClearResolved = async () => {
    try {
      await API.delete("/alerts/clear-resolved");
      setAlerts((prev) => prev.filter((a) => !a.resolved));
      showToast("Cleared resolved alerts.");
    } catch (error) {
      console.error("Error clearing alerts:", error);
    }
  };

  /* RULE CREATION & TOGGLE */
  const handleToggleRule = async (ruleId, currentEnabled) => {
    try {
      setRules((prev) =>
        prev.map((r) => (r._id === ruleId ? { ...r, enabled: !currentEnabled } : r))
      );
      await API.put(`/alerts/rules/${ruleId}`, { enabled: !currentEnabled });
    } catch (error) {
      console.error("Error toggling rule:", error);
      fetchData();
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/alerts/rules", ruleForm);
      setRules((prev) => [...prev, res.data]);
      setIsRuleModalOpen(false);
      setRuleForm({
        name: "",
        target: "",
        condition: "gt",
        threshold: 0,
        severity: "high",
        channels: ["bell", "toast"],
        webhookUrl: ""
      });
      showToast("Alert Rule created successfully.");
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await API.delete(`/alerts/rules/${ruleId}`);
      setRules((prev) => prev.filter((r) => r._id !== ruleId));
      showToast("Alert Rule deleted.");
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  /* NOTIFICATION CHANNELS HANDLERS */
  const handleToggleChannel = async (id, currentEnabled) => {
    try {
      setChannels((prev) =>
        prev.map((c) => (c._id === id ? { ...c, enabled: !currentEnabled } : c))
      );
      await API.put(`/alerts/channels/${id}`, { enabled: !currentEnabled });
    } catch (error) {
      console.error("Error toggling channel:", error);
      fetchData();
    }
  };

  const handleTestChannelConfig = async () => {
    try {
      setTestingChannel(true);
      setChannelTestResult(null);
      const res = await API.post("/alerts/channels/test", {
        type: channelType,
        config: channelConfig
      });
      setChannelTestResult({ success: true, message: res.data.message });
      setTestingChannel(false);
    } catch (error) {
      setChannelTestResult({
        success: false,
        message: error.response?.data?.message || "Channel test failed."
      });
      setTestingChannel(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/alerts/channels", {
        name: channelName || `${channelType.toUpperCase()} Channel`,
        type: channelType,
        config: channelConfig,
        enabled: true
      });
      setChannels((prev) => [...prev, res.data]);
      setIsChannelModalOpen(false);
      setChannelName("");
      setChannelConfig({});
      setChannelTestResult(null);
      showToast("Notification channel created.");
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  const handleDeleteChannel = async (id) => {
    try {
      await API.delete(`/alerts/channels/${id}`);
      setChannels((prev) => prev.filter((c) => c._id !== id));
      showToast("Notification channel removed.");
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  const handleTestExistingChannel = async (channel) => {
    try {
      showToast(`Dispatching test alert to ${channel.name}...`);
      await API.post("/alerts/channels/test", {
        type: channel.type,
        config: channel.config
      });
      showToast(`Test payload sent to ${channel.name}.`);
    } catch (error) {
      showToast("Test dispatch failed.");
    }
  };

  /* ESCALATION POLICIES HANDLERS */
  const handleToggleEscalation = async (id, currentEnabled) => {
    try {
      setEscalations((prev) =>
        prev.map((e) => (e._id === id ? { ...e, enabled: !currentEnabled } : e))
      );
      await API.put(`/alerts/escalations/${id}`, { enabled: !currentEnabled });
    } catch (error) {
      console.error("Error toggling escalation policy:", error);
      fetchData();
    }
  };

  const handleCreateEscalation = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: escalationForm.name,
        severity: escalationForm.severity,
        enabled: true,
        levels: [
          {
            level: 1,
            delayMinutes: 0,
            channels: ["bell", "toast", "slack"],
            contacts: escalationForm.l1Contacts.split(",").map((s) => s.trim()).filter(Boolean)
          },
          {
            level: 2,
            delayMinutes: Number(escalationForm.l2Delay) || 5,
            channels: ["teams", "gmail"],
            contacts: escalationForm.l2Contacts.split(",").map((s) => s.trim()).filter(Boolean)
          },
          {
            level: 3,
            delayMinutes: Number(escalationForm.l3Delay) || 15,
            channels: ["outlook", "webhook"],
            contacts: escalationForm.l3Contacts.split(",").map((s) => s.trim()).filter(Boolean)
          }
        ]
      };

      const res = await API.post("/alerts/escalations", payload);
      setEscalations((prev) => [...prev, res.data]);
      setIsEscalationModalOpen(false);
      setEscalationForm({
        name: "",
        severity: "critical",
        l1Contacts: "",
        l2Delay: 5,
        l2Contacts: "",
        l3Delay: 15,
        l3Contacts: ""
      });
      showToast("Escalation Policy created.");
    } catch (error) {
      console.error("Error creating escalation policy:", error);
    }
  };

  const handleDeleteEscalation = async (id) => {
    try {
      await API.delete(`/alerts/escalations/${id}`);
      setEscalations((prev) => prev.filter((e) => e._id !== id));
      showToast("Escalation policy removed.");
    } catch (error) {
      console.error("Error deleting escalation policy:", error);
    }
  };

  /* MANUAL TRIGGER ALERT */
  const handleTriggerAlertSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/alerts/trigger", triggerForm);
      setIsTriggerModalOpen(false);
      setTriggerForm({ title: "", message: "", severity: "high", value: 0, webhookUrl: "" });
      fetchData();
    } catch (error) {
      console.error("Error triggering alert:", error);
    }
  };

  /* FILTERS LOGIC */
  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = severityFilter === "All" || a.severity?.toLowerCase() === severityFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? !a.acknowledged && !a.resolved
        : statusFilter === "Acknowledged"
        ? a.acknowledged && !a.resolved
        : a.resolved;
    return matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "medium":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-white/5";
    }
  };

  const getChannelIcon = (type) => {
    switch (type) {
      case "slack":
        return "💬";
      case "teams":
        return "👥";
      case "discord":
        return "🎮";
      case "gmail":
        return "📧";
      case "outlook":
        return "✉️";
      default:
        return "📮";
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-card border border-brand-border text-slate-200 px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Alert Center
          </h1>
          <p className="text-slate-400 font-semibold text-sm">
            Manage alerts, threshold rules, escalation matrices, and multi-channel notifications
          </p>
        </div>

        {/* TABS SWITCHER */}
        <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 flex-wrap gap-1">
          {[
            { id: "alerts", label: "Active Alerts" },
            { id: "rules", label: "Alert Rules Engine" },
            { id: "channels", label: "Notification Channels" },
            { id: "escalation", label: "Escalation Matrix" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* -------------------- TAB 1: ACTIVE ALERTS -------------------- */}
          {activeTab === "alerts" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Alerts</span>
                  <h3 className="text-3xl font-black text-white mt-2">{alerts.length}</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Recorded in database</p>
                </div>

                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Critical Severity</span>
                  <h3 className="text-3xl font-black text-red-400 mt-2">
                    {alerts.filter((a) => a.severity?.toLowerCase() === "critical").length}
                  </h3>
                  <p className="text-red-400/80 text-xs font-semibold mt-1">High priority action required</p>
                </div>

                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Unacknowledged</span>
                  <h3 className="text-3xl font-black text-amber-400 mt-2">
                    {alerts.filter((a) => !a.acknowledged && !a.resolved).length}
                  </h3>
                  <p className="text-amber-400/80 text-xs font-semibold mt-1">Pending review</p>
                </div>

                <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Resolved</span>
                  <h3 className="text-3xl font-black text-emerald-400 mt-2">
                    {alerts.filter((a) => a.resolved).length}
                  </h3>
                  <p className="text-emerald-400/80 text-xs font-semibold mt-1">Successfully closed</p>
                </div>
              </div>

              <div className="bg-brand-card/45 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shadow-md">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Severity:</span>
                    <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5">
                      {["All", "Critical", "High", "Medium", "Low"].map((sev) => (
                        <button
                          key={sev}
                          onClick={() => setSeverityFilter(sev)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            severityFilter === sev ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Status:</span>
                    <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5">
                      {["All", "Active", "Acknowledged", "Resolved"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            statusFilter === st ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setIsTriggerModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all active:translate-y-0.5"
                  >
                    + Trigger Alert
                  </button>
                  <button
                    onClick={handleClearResolved}
                    className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 text-xs font-extrabold uppercase px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                  >
                    Clear Resolved
                  </button>
                </div>
              </div>

              <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold select-none">
                    <thead className="bg-slate-950/60 border-b border-white/5 text-slate-400 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Severity</th>
                        <th className="px-6 py-4">Alert Title & Description</th>
                        <th className="px-6 py-4">Metric Value</th>
                        <th className="px-6 py-4">Escalation Level</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {filteredAlerts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-xs font-bold">
                            No alerts matching criteria
                          </td>
                        </tr>
                      ) : (
                        filteredAlerts.map((alert) => (
                          <tr key={alert._id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                                {alert.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-white text-sm">{alert.title}</p>
                              <p className="text-slate-400 text-[11px] mt-0.5">{alert.message}</p>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-slate-200">
                              {alert.value}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-slate-900 text-emerald-400 border border-white/5">
                                Level {alert.escalatedLevel || 1}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {alert.resolved ? (
                                <span className="text-emerald-400 text-[10px] font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                  Resolved
                                </span>
                              ) : alert.acknowledged ? (
                                <span className="text-blue-400 text-[10px] font-extrabold uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                  Acknowledged
                                </span>
                              ) : (
                                <span className="text-amber-400 text-[10px] font-extrabold uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 animate-pulse">
                                  Active Unread
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!alert.acknowledged && !alert.resolved && (
                                  <button
                                    onClick={() => handleAcknowledge(alert._id)}
                                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-[10px] font-bold uppercase transition-all cursor-pointer"
                                  >
                                    Acknowledge
                                  </button>
                                )}
                                {!alert.resolved && (
                                  <button
                                    onClick={() => handleResolve(alert._id)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                                  >
                                    Resolve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB 2: ALERT RULES ENGINE -------------------- */}
          {activeTab === "rules" && (
            <div className="flex flex-col gap-6 select-none animate-fade-in">
              <div className="bg-brand-card/45 border border-white/5 p-5 rounded-3xl flex justify-between items-center shadow-md">
                <div>
                  <h3 className="text-md font-bold text-white">Automated Alert Rule Engine</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Define threshold conditions that automatically trigger alerts and notifications</p>
                </div>
                <button
                  onClick={() => setIsRuleModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase px-4.5 py-2.5 rounded-xl cursor-pointer transition-all active:translate-y-0.5"
                >
                  + Create Alert Rule
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rules.map((rule) => (
                  <div
                    key={rule._id}
                    className={`p-6 rounded-3xl border flex flex-col justify-between gap-5 transition-all ${
                      rule.enabled ? "bg-slate-900/40 border-emerald-500/20 shadow-lg" : "bg-slate-950/20 border-white/5 opacity-70"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${getSeverityBadge(rule.severity)}`}>
                            {rule.severity} Severity
                          </span>
                          <h4 className="text-lg font-bold text-white mt-1">{rule.name}</h4>
                        </div>

                        <button
                          onClick={() => handleToggleRule(rule._id, rule.enabled)}
                          className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none ${
                            rule.enabled ? "bg-emerald-500" : "bg-slate-800"
                          }`}
                        >
                          <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            rule.enabled ? "translate-x-5" : "translate-x-0"
                          }`}></div>
                        </button>
                      </div>

                      <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 mt-4 text-xs font-semibold font-mono grid grid-cols-2 gap-3 text-slate-400">
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold mb-0.5">TARGET METRIC</span>
                          <span className="text-slate-200">{rule.target}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block uppercase font-bold mb-0.5">THRESHOLD CONDITION</span>
                          <span className="text-emerald-400">
                            {rule.condition === "gt" ? ">" : rule.condition === "lt" ? "<" : "="} {rule.threshold}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="text-[10px]">CHANNELS:</span>
                        {(rule.channels || ["bell", "toast"]).map((ch) => (
                          <span key={ch} className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-[9px] uppercase font-mono">
                            {ch}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleDeleteRule(rule._id)}
                        className="text-[10px] font-extrabold uppercase text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        Delete Rule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- TAB 3: NOTIFICATION CHANNELS -------------------- */}
          {activeTab === "channels" && (
            <div className="flex flex-col gap-8 animate-fade-in select-none">
              <div className="bg-brand-card/45 border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Notification Channels & Integrations</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-semibold">Configure multi-channel dispatchers for Slack, Microsoft Teams, Discord, Gmail, Outlook, and SMTP</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsChannelModalOpen(true);
                      setChannelConfig({});
                      setChannelTestResult(null);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase px-4.5 py-2.5 rounded-xl cursor-pointer transition-all active:translate-y-0.5"
                  >
                    + Add Notification Channel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {channels.map((ch) => (
                    <div
                      key={ch._id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 transition-all ${
                        ch.enabled ? "bg-slate-900/40 border-emerald-500/20 shadow-md" : "bg-slate-950/20 border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl">
                              {getChannelIcon(ch.type)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                              <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {ch.type}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleChannel(ch._id, ch.enabled)}
                            className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none ${
                              ch.enabled ? "bg-emerald-500" : "bg-slate-800"
                            }`}
                          >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                              ch.enabled ? "translate-x-5" : "translate-x-0"
                            }`}></div>
                          </button>
                        </div>

                        <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400 break-all">
                          {ch.config?.webhookUrl ? (
                            <span>{ch.config.webhookUrl}</span>
                          ) : (
                            <span>Sender: {ch.config?.user || "N/A"} → Recipients: {Array.isArray(ch.config?.recipients) ? ch.config.recipients.join(", ") : ch.config?.recipients || "N/A"}</span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-xs font-bold">
                        <button
                          onClick={() => handleTestExistingChannel(ch)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-[10px] font-extrabold uppercase transition-all cursor-pointer"
                        >
                          Test Dispatch
                        </button>
                        <button
                          onClick={() => handleDeleteChannel(ch._id)}
                          className="text-[10px] font-extrabold uppercase text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------- TAB 4: ESCALATION MATRIX -------------------- */}
          {activeTab === "escalation" && (
            <div className="flex flex-col gap-8 animate-fade-in select-none">
              <div className="bg-brand-card/45 border border-white/5 p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Automated Notification Escalation Matrix</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-semibold">Define multi-tier escalation policies to escalate unacknowledged alerts over time</p>
                  </div>
                  <button
                    onClick={() => setIsEscalationModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase px-4.5 py-2.5 rounded-xl cursor-pointer transition-all active:translate-y-0.5"
                  >
                    + Create Escalation Policy
                  </button>
                </div>

                {/* ESCALATION POLICIES CARDS */}
                <div className="flex flex-col gap-6">
                  {escalations.map((policy) => (
                    <div
                      key={policy._id}
                      className={`p-6 rounded-3xl border flex flex-col gap-6 transition-all ${
                        policy.enabled ? "bg-slate-900/40 border-emerald-500/20 shadow-xl" : "bg-slate-950/20 border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${getSeverityBadge(policy.severity)}`}>
                            {policy.severity} Severity Trigger
                          </span>
                          <h4 className="text-lg font-bold text-white">{policy.name}</h4>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleEscalation(policy._id, policy.enabled)}
                            className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 outline-none ${
                              policy.enabled ? "bg-emerald-500" : "bg-slate-800"
                            }`}
                          >
                            <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                              policy.enabled ? "translate-x-5" : "translate-x-0"
                            }`}></div>
                          </button>
                          <button
                            onClick={() => handleDeleteEscalation(policy._id)}
                            className="text-[10px] font-extrabold uppercase text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Delete Policy
                          </button>
                        </div>
                      </div>

                      {/* LEVEL FLOWCHART */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                        {(policy.levels || []).map((lvl, index) => (
                          <div
                            key={lvl.level || index}
                            className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex flex-col gap-3 relative"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
                                Level {lvl.level}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">
                                {lvl.delayMinutes === 0 ? "⏱️ Immediate (0m)" : `⏱️ Delay: +${lvl.delayMinutes} mins`}
                              </span>
                            </div>

                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-[9px] text-slate-500 block font-bold uppercase">TARGET CHANNELS</span>
                              <div className="flex flex-wrap gap-1">
                                {(lvl.channels || []).map((c) => (
                                  <span key={c} className="bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono uppercase text-slate-300">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-[9px] text-slate-500 block font-bold uppercase">ESCALATED CONTACTS</span>
                              <span className="text-slate-300 font-mono text-[11px] truncate">
                                {(lvl.contacts || []).join(", ") || "On-Call Team"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CREATE ESCALATION POLICY MODAL */}
          {isEscalationModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in select-none">
              <form onSubmit={handleCreateEscalation} className="bg-brand-card border border-brand-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6">
                <button
                  type="button"
                  onClick={() => setIsEscalationModalOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div>
                  <h3 className="text-xl font-black text-white">Create Escalation Policy</h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Define time delays and target contacts for L1 ➔ L2 ➔ L3 escalation steps</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Policy Name</label>
                      <input
                        type="text"
                        required
                        value={escalationForm.name}
                        onChange={(e) => setEscalationForm({ ...escalationForm, name: e.target.value })}
                        placeholder="e.g. Critical Infrastructure Policy"
                        className="px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 text-white text-xs font-semibold outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Trigger Severity</label>
                      <select
                        value={escalationForm.severity}
                        onChange={(e) => setEscalationForm({ ...escalationForm, severity: e.target.value })}
                        className="px-4 py-3 rounded-xl bg-slate-950/60 border border-white/5 text-white text-xs font-semibold outline-none"
                      >
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Level 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col gap-2">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">LEVEL 1 (Immediate - 0m)</span>
                    <input
                      type="text"
                      value={escalationForm.l1Contacts}
                      onChange={(e) => setEscalationForm({ ...escalationForm, l1Contacts: e.target.value })}
                      placeholder="Level 1 Email Contacts (comma separated)"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-white/5 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  {/* Level 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-emerald-400 uppercase">LEVEL 2 (Escalation Step 1)</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <span>Delay:</span>
                        <input
                          type="number"
                          value={escalationForm.l2Delay}
                          onChange={(e) => setEscalationForm({ ...escalationForm, l2Delay: Number(e.target.value) })}
                          className="w-14 px-2 py-1 rounded bg-slate-900 border border-white/5 text-white font-mono text-center text-xs"
                        />
                        <span>mins</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={escalationForm.l2Contacts}
                      onChange={(e) => setEscalationForm({ ...escalationForm, l2Contacts: e.target.value })}
                      placeholder="Level 2 Email Contacts (devops-lead@company.com)"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-white/5 text-white text-xs font-mono outline-none"
                    />
                  </div>

                  {/* Level 3 */}
                  <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-emerald-400 uppercase">LEVEL 3 (Escalation Step 2)</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <span>Delay:</span>
                        <input
                          type="number"
                          value={escalationForm.l3Delay}
                          onChange={(e) => setEscalationForm({ ...escalationForm, l3Delay: Number(e.target.value) })}
                          className="w-14 px-2 py-1 rounded bg-slate-900 border border-white/5 text-white font-mono text-center text-xs"
                        />
                        <span>mins</span>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={escalationForm.l3Contacts}
                      onChange={(e) => setEscalationForm({ ...escalationForm, l3Contacts: e.target.value })}
                      placeholder="Level 3 Email Contacts (engineering-vp@company.com)"
                      className="px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-white/5 text-white text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-end gap-3 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => setIsEscalationModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl cursor-pointer"
                  >
                    Save Escalation Policy
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Alerts;