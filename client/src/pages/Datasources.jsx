import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../api/axios";

const Datasources = () => {
  const [datasources, setDatasources] = useState([]);
  const [view, setView] = useState("list"); // "list", "select-connector", "connector-config"
  const [configStep, setConfigStep] = useState(1); // 1, 2, 3
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: "InfluxDB",
    type: "influxdb",
    url: "http://localhost:8086",
    product: "InfluxDB 2.x",
    queryLanguage: "Flux",
    token: "",
    organization: "",
    bucket: "",
    database: "",
    username: "",
    password: "",
    topic: "",
    clientId: "",
    scrapeInterval: "15s",
    httpMethod: "GET",
    csvHeader: true,
    csvDelimiter: ",",
    valuePath: "value",
    headers: "{}",
    body: "{}",
    measurement: "temperature",
    field: "value",
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    allowedCookies: "",
    timeout: "30s",
    customHeaders: "",
  });

  useEffect(() => {
    let active = true;
    const fetchDatasources = async () => {
      try {
        const res = await API.get("/datasources");
        if (active) {
          setDatasources(res.data);
        }
      } catch (error) {
        console.error("Error fetching datasources:", error);
      }
    };
    fetchDatasources();
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleAdvancedChange = (e) => {
    setAdvancedSettings({
      ...advancedSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this data source connection?")) {
      return;
    }
    try {
      await API.delete(`/datasources/${id}`);
      setDatasources((prev) => prev.filter((source) => source._id !== id));
      showToast("Datasource deleted successfully.");
    } catch (error) {
      console.error("Error deleting datasource:", error);
      showToast("Failed to delete datasource.");
    }
  };

  const handleSelectConnector = (type) => {
    let defaultUrl = "";
    let defaultName = "";
    
    switch (type) {
      case "influxdb":
        defaultName = "InfluxDB";
        defaultUrl = "http://localhost:8086";
        break;
      case "mqtt":
        defaultName = "MQTT Broker";
        defaultUrl = "mqtt://broker.hivemq.com";
        break;
      case "prometheus":
        defaultName = "Prometheus Server";
        defaultUrl = "http://localhost:9090";
        break;
      case "postgresql":
        defaultName = "PostgreSQL DB";
        defaultUrl = "postgresql://localhost:5432";
        break;
      case "loki":
        defaultName = "Loki Logs";
        defaultUrl = "http://localhost:3100";
        break;
      case "rest":
        defaultName = "REST HTTP API";
        defaultUrl = "http://localhost:8080/api";
        break;
      case "websocket":
        defaultName = "WebSocket Server";
        defaultUrl = "ws://localhost:8080";
        break;
      case "csv":
        defaultName = "CSV File Datasource";
        defaultUrl = "c:/data/sensors.csv";
        break;
      case "mysql":
        defaultName = "MySQL Database";
        defaultUrl = "localhost:3306";
        break;
      case "mongodb":
        defaultName = "MongoDB Database";
        defaultUrl = "mongodb://localhost:27017";
        break;
      case "mssql":
        defaultName = "SQL Server Database";
        defaultUrl = "localhost:1433";
        break;
      case "elasticsearch":
        defaultName = "Elasticsearch Cluster";
        defaultUrl = "http://localhost:9200";
        break;
      case "redis":
        defaultName = "Redis Store";
        defaultUrl = "redis://localhost:6379";
        break;
      case "sqlite":
        defaultName = "SQLite Database File";
        defaultUrl = "c:/data/app.db";
        break;
      case "clickhouse":
        defaultName = "ClickHouse Database";
        defaultUrl = "http://localhost:8123";
        break;
      case "cassandra":
        defaultName = "Cassandra Database";
        defaultUrl = "localhost:9042";
        break;
      case "oracle":
        defaultName = "Oracle Database";
        defaultUrl = "localhost:1521/ORCL";
        break;
      case "graphite":
        defaultName = "Graphite Server";
        defaultUrl = "http://localhost:80";
        break;
      default:
        defaultName = "New Connection";
        defaultUrl = "http://localhost";
    }

    setFormData({
      name: defaultName,
      type: type,
      url: defaultUrl,
      product: type === "influxdb" ? "InfluxDB 2.x" : "",
      queryLanguage: type === "influxdb" ? "Flux" : "",
      token: "",
      organization: "",
      bucket: "",
      database: "",
      username: "",
      password: "",
      topic: "",
      clientId: "",
      scrapeInterval: "10s",
      httpMethod: "GET",
      csvHeader: true,
      csvDelimiter: ",",
      valuePath: "value",
      headers: "{}",
      body: "{}",
      measurement: "temperature",
      field: "value",
    });

    setView("connector-config");
    setConfigStep(1);
    setTestResult(null);
    setTesting(false);
  };

  const handleSaveAndTest = async () => {
    setTesting(true);
    setTestResult(null);

    const payload = {
      name: formData.name,
      type: formData.type,
      url: formData.url,
      topic: formData.type === "mqtt" ? formData.topic : "",
      config: {
        product: formData.product,
        queryLanguage: formData.queryLanguage,
        token: formData.token,
        organization: formData.organization,
        bucket: formData.bucket,
        database: formData.database,
        username: formData.username,
        password: formData.password,
        topic: formData.topic,
        clientId: formData.clientId,
        scrapeInterval: formData.scrapeInterval,
        httpMethod: formData.httpMethod,
        csvHeader: formData.csvHeader,
        csvDelimiter: formData.csvDelimiter,
        advanced: advancedSettings,
        
        // REST HTTP specific configuration values
        method: formData.httpMethod,
        interval: Number(formData.scrapeInterval.replace('s', '')) || 10,
        valuePath: formData.valuePath,
        headers: (() => {
          try { return JSON.parse(formData.headers || '{}') } catch(e) { return {} }
        })(),
        body: (() => {
          try { return JSON.parse(formData.body || '{}') } catch(e) { return null }
        })(),
        measurement: formData.measurement,
        field: formData.field,
      },
    };

    try {
      const testRes = await API.post("/datasources/test", payload);

      if (testRes.data.success) {
        setTestResult({ success: true, message: testRes.data.message });

        // Save connection to MongoDB database
        const saveRes = await API.post("/datasources", payload);
        setDatasources((prev) => [...prev, saveRes.data]);

        showToast("Datasource saved successfully.");
        
        setTimeout(() => {
          setView("list");
          setTestResult(null);
          setTesting(false);
          setConfigStep(1);
        }, 2200);
      } else {
        setTestResult({ success: false, message: testRes.data.message });
        setTesting(false);
      }
    } catch (error) {
      console.error("Connection test error:", error);
      setTestResult({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to establish connection.",
      });
      setTesting(false);
    }
  };

  // SVGs for connectors
  const renderConnectorIcon = (type, sizeClass = "w-10 h-10") => {
    switch (type?.toLowerCase()) {
      case "influxdb":
        return (
          <svg className={sizeClass} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="16" width="6" height="10" rx="1" fill="#ec4899" />
            <rect x="17" y="10" width="6" height="16" rx="1" fill="#3b82f6" />
            <rect x="25" y="14" width="6" height="12" rx="1" fill="#10b981" />
          </svg>
        );
      case "mqtt":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8M12 18V12M12 10a4 4 0 014 4h-8a4 4 0 014-4zM6.343 6.343a8 8 0 0111.314 0m-9.9 1.414a6 6 0 018.486 0" />
          </svg>
        );
      case "prometheus":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.364 5.636l-3.536 3.536m0 0l-3.536-3.536m3.536 3.536V15m-7.071-7.071H8.5m7.071 0h3.5" />
            <circle cx="12" cy="15" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case "postgresql":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v2.25c0 1.243-3.694 2.25-8.25 2.25s-8.25-1.007-8.25-2.25v-2.25m16.5 0c0-1.243-3.694-2.25-8.25-2.25s-8.25 1.007-8.25 2.25m16.5 0V11.25c0 1.243-3.694 2.25-8.25 2.25s-8.25-1.007-8.25-2.25V14.15M20.25 11.25c0-1.243-3.694-2.25-8.25-2.25s-8.25 1.007-8.25 2.25m16.5 0V8.25c0 1.243-3.694-2.25-8.25-2.25s-8.25 1.007-8.25 2.25V11.25" />
          </svg>
        );
      case "loki":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "rest":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
          </svg>
        );
      case "websocket":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        );
      case "csv":
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12a2.25 2.25 0 014.5-9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v.25A2.25 2.25 0 004.5 17.5h15a2.25 2.25 0 002.25-2.25V13m-19.5 0V9a2.25 2.25 0 012.25-2.25h3.093c.594 0 1.157.237 1.57.659l2.25 2.25a2.25 2.25 0 001.57.659H19.5A2.25 2.25 0 0121.75 12v1" />
          </svg>
        );
      case "mysql":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m-16 5c0 2.21 3.582 4 8 4s8-1.79 8-4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11.5c0-.83 1.34-1.5 3-1.5s3 .67 3 1.5-1.34 1.5-3 1.5-3-.67-3-1.5z" />
          </svg>
        );
      case "mongodb":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 6 6 9.5 6 13a6 6 0 1012 0c0-3.5-2.5-7-6-11z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M9 13c1.5 1 4.5 1 6 0" />
          </svg>
        );
      case "mssql":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M4 12h16M8 8.5h8M8 15.5h8" />
          </svg>
        );
      case "elasticsearch":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h6" />
          </svg>
        );
      case "redis":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v5H4V4zm0 11h16v5H4v-5zm0-5.5h16v1H4v-1zM9 4v16M15 4v16" />
          </svg>
        );
      case "sqlite":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
          </svg>
        );
      case "clickhouse":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V8h4v12H4zm6 0V4h4v16h-4zm6 0v-8h4v8h-4z" />
          </svg>
        );
      case "cassandra":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="5" r="3" stroke="currentColor" />
            <circle cx="5" cy="17" r="3" stroke="currentColor" />
            <circle cx="19" cy="17" r="3" stroke="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8l-5 6m10 0l-5-6M7.5 17h9" />
          </svg>
        );
      case "oracle":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="12" cy="12" rx="10" ry="7" stroke="currentColor" />
            <ellipse cx="12" cy="12" rx="6" ry="4" stroke="currentColor" />
          </svg>
        );
      case "graphite":
        return (
          <svg className={sizeClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18l5-6 4 4 8-9" />
          </svg>
        );
      default:
        return (
          <svg className={sizeClass} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        );
    }
  };

  const getBadgeClass = (type) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ";
    switch (type?.toLowerCase()) {
      case "influxdb":
        return base + "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "mqtt":
        return base + "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "prometheus":
        return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "postgresql":
        return base + "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "loki":
        return base + "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "rest":
        return base + "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "websocket":
        return base + "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "csv":
        return base + "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "mysql":
        return base + "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "mongodb":
        return base + "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "mssql":
        return base + "bg-red-500/10 text-red-400 border-red-500/20";
      case "elasticsearch":
        return base + "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "redis":
        return base + "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "sqlite":
        return base + "bg-violet-500/10 text-violet-400 border-violet-500/20";
      case "clickhouse":
        return base + "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "cassandra":
        return base + "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "oracle":
        return base + "bg-red-500/10 text-red-400 border-red-500/20";
      case "graphite":
        return base + "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default:
        return base + "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Step Nav validation checks
  const canGoToStep = (step) => {
    if (step === 1) return true;
    if (step === 2) {
      return formData.name.trim() !== "" && formData.url.trim() !== "";
    }
    if (step === 3) {
      if (!canGoToStep(2)) return false;
      if (formData.type === "influxdb") {
        if (formData.product === "InfluxDB 2.x" || formData.product === "Cloud") {
          return (
            formData.organization.trim() !== "" &&
            formData.bucket.trim() !== "" &&
            formData.token.trim() !== ""
          );
        } else {
          return formData.database.trim() !== "";
        }
      } else if (formData.type === "mqtt") {
        return formData.topic.trim() !== "";
      } else if (
        formData.type === "postgresql" ||
        formData.type === "mysql" ||
        formData.type === "mongodb" ||
        formData.type === "mssql" ||
        formData.type === "cassandra" ||
        formData.type === "oracle" ||
        formData.type === "clickhouse"
      ) {
        return formData.database.trim() !== "";
      } else if (
        formData.type === "prometheus" ||
        formData.type === "rest" ||
        formData.type === "websocket" ||
        formData.type === "loki" ||
        formData.type === "csv" ||
        formData.type === "elasticsearch" ||
        formData.type === "redis" ||
        formData.type === "sqlite" ||
        formData.type === "graphite"
      ) {
        return true;
      }
    }
    return false;
  };

  const getStep2Name = () => {
    switch (formData.type) {
      case "influxdb":
      case "postgresql":
      case "mysql":
      case "mongodb":
      case "mssql":
      case "sqlite":
      case "clickhouse":
      case "cassandra":
      case "oracle":
        return "Database settings";
      case "mqtt":
      case "websocket":
      case "redis":
      case "graphite":
        return "Connection settings";
      default:
        return "Ingestion settings";
    }
  };

  const getConnectorTitle = () => {
    switch (formData.type) {
      case "influxdb": return "InfluxDB";
      case "mqtt": return "MQTT Broker";
      case "prometheus": return "Prometheus";
      case "postgresql": return "PostgreSQL";
      case "loki": return "Loki";
      case "rest": return "REST API";
      case "websocket": return "WebSocket";
      case "csv": return "CSV / File";
      case "mysql": return "MySQL";
      case "mongodb": return "MongoDB";
      case "mssql": return "Microsoft SQL Server";
      case "elasticsearch": return "Elasticsearch";
      case "redis": return "Redis";
      case "sqlite": return "SQLite";
      case "clickhouse": return "ClickHouse";
      case "cassandra": return "Cassandra";
      case "oracle": return "Oracle Database";
      case "graphite": return "Graphite";
      default: return "Data Source";
    }
  };

  const getConnectorSubtitle = () => {
    switch (formData.type) {
      case "influxdb":
        return "Connect local or cloud InfluxDB — supports Flux and InfluxQL";
      case "mqtt":
        return "Ingest message payloads from any MQTT Broker";
      case "prometheus":
        return "Pull metrics from any Prometheus HTTP server";
      case "postgresql":
        return "Connect to PostgreSQL or TimescaleDB relational database";
      case "loki":
        return "Connect to Loki log aggregation query server";
      case "rest":
        return "Configure a scheduled HTTP/REST client for metrics";
      case "websocket":
        return "Stream telemetry data from a WebSocket daemon";
      case "csv":
        return "Ingest static datasets from a local CSV file";
      case "mysql":
        return "Connect to MySQL relational database";
      case "mongodb":
        return "Connect to MongoDB NoSQL document database";
      case "mssql":
        return "Connect to Microsoft SQL Server database";
      case "elasticsearch":
        return "Connect to Elasticsearch search and analytics engine";
      case "redis":
        return "Connect to Redis in-memory database";
      case "sqlite":
        return "Connect to local SQLite database file";
      case "clickhouse":
        return "Connect to ClickHouse column-oriented database";
      case "cassandra":
        return "Connect to Apache Cassandra distributed database";
      case "oracle":
        return "Connect to Oracle relational database";
      case "graphite":
        return "Connect to Graphite metrics and monitoring system";
      default:
        return "Enter parameters to configure your data connection";
    }
  };

  const renderStep2Fields = () => {
    switch (formData.type) {
      case "influxdb":
        return (
          <div className="flex flex-col gap-6">
            {formData.product === "InfluxDB 1.x" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-300">
                    Database name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="database"
                    value={formData.database}
                    onChange={handleChange}
                    placeholder="e.g. iot_db"
                    className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-300">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-300">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-300">
                    Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. FactoryOrg"
                    className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-slate-300">
                    Bucket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bucket"
                    value={formData.bucket}
                    onChange={handleChange}
                    placeholder="e.g. sensors_data"
                    className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                    required
                  />
                </div>
              </>
            )}
          </div>
        );
      case "mqtt":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">
                MQTT Topic <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">The broker topic to subscribe to for real-time messages</span>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. factory/sensors/temp"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Client ID</label>
              <input
                type="text"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                placeholder="e.g. vizora_client_01"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Optional"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
          </div>
        );
      case "prometheus":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">
                Scrape Interval <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">How frequently the daemon pulls metrics</span>
              <input
                type="text"
                name="scrapeInterval"
                value={formData.scrapeInterval}
                onChange={handleChange}
                placeholder="e.g. 15s"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                required
              />
            </div>
          </div>
        );
      case "postgresql":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">
                Database Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="database"
                value={formData.database}
                onChange={handleChange}
                placeholder="e.g. timescaledb"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. postgres"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
          </div>
        );
      case "loki":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Tenant ID</label>
              <span className="text-[11px] text-slate-500 font-semibold">Optional tenant header identifier for multi-tenant setups</span>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. default_tenant"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
          </div>
        );
      case "rest":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-extrabold text-slate-300">HTTP Method <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/45 p-1 rounded-2xl border border-white/5 w-1/2">
                {["GET", "POST"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, httpMethod: method })}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      formData.httpMethod === method
                        ? "bg-[#1e293b] border border-blue-500 text-white shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Polling Interval <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">Frequency of polling (e.g. 10s, 30s)</span>
                <input
                  type="text"
                  name="scrapeInterval"
                  value={formData.scrapeInterval}
                  onChange={handleChange}
                  placeholder="e.g. 10s"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  JSON Value Path <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold">Dot-separated path to metric (e.g. main.temp)</span>
                <input
                  type="text"
                  name="valuePath"
                  value={formData.valuePath}
                  onChange={handleChange}
                  placeholder="e.g. value"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Request Headers (JSON format)</label>
              <span className="text-[11px] text-slate-500 font-semibold">Custom request headers passed to the API call</span>
              <textarea
                name="headers"
                value={formData.headers}
                onChange={handleChange}
                placeholder='e.g. {"Authorization": "Bearer token", "Content-Type": "application/json"}'
                rows="3"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold font-mono outline-hidden w-full resize-none"
              />
            </div>

            {formData.httpMethod === "POST" && (
              <div className="flex flex-col gap-1.5 animate-slide-down">
                <label className="text-xs font-extrabold text-slate-300">Request Body (JSON format)</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder='e.g. {"deviceId": "sensor_01", "status": "active"}'
                  rows="3"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold font-mono outline-hidden w-full resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Target Measurement</label>
                <span className="text-[11px] text-slate-500 font-semibold">InfluxDB measurement table (default: temperature)</span>
                <input
                  type="text"
                  name="measurement"
                  value={formData.measurement}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Target Field</label>
                <span className="text-[11px] text-slate-500 font-semibold">InfluxDB metric field name (default: value)</span>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          </div>
        );
      case "websocket":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Connection Timeout</label>
              <input
                type="text"
                name="scrapeInterval"
                value={formData.scrapeInterval}
                onChange={handleChange}
                placeholder="e.g. 5000ms"
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
          </div>
        );
      case "csv":
        return (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold text-slate-300">Delimiter</label>
              <input
                type="text"
                name="csvDelimiter"
                value={formData.csvDelimiter}
                onChange={handleChange}
                placeholder=","
                className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
              />
            </div>
            <div className="flex items-center gap-2 mt-2 select-none">
              <input
                type="checkbox"
                id="csvHeader"
                name="csvHeader"
                checked={formData.csvHeader}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="csvHeader" className="text-xs text-slate-300 font-semibold cursor-pointer">
                First row contains header labels
              </label>
            </div>
          </div>
        );
      // New Connector: MySQL
        case "mysql":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="3306"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Database</label>
                <input
                  type="text"
                  name="database"
                  value={formData.database}
                  onChange={handleChange}
                  placeholder="e.g. vizordb"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="root"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: MongoDB
        case "mongodb":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Connection URI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="uri"
                  value={formData.uri}
                  onChange={handleChange}
                  placeholder="e.g. mongodb://localhost:27017"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
            </div>
          );
        // New Connector: MSSQL
        case "mssql":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="1433"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Database</label>
                <input
                  type="text"
                  name="database"
                  value={formData.database}
                  onChange={handleChange}
                  placeholder="e.g. vizordb"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="sa"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: Elasticsearch
        case "elasticsearch":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="e.g. http://localhost:9200"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: Redis
        case "redis":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="6379"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: SQLite
        case "sqlite":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  File Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="filePath"
                  value={formData.filePath}
                  onChange={handleChange}
                  placeholder="e.g. C:/data/vizora.db"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
            </div>
          );
        // New Connector: ClickHouse
        case "clickhouse":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="e.g. http://localhost:8123"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: Cassandra
        case "cassandra":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Contact Point <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="9042"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Keyspace</label>
                <input
                  type="text"
                  name="keyspace"
                  value={formData.keyspace}
                  onChange={handleChange}
                  placeholder="e.g. vizora"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: Oracle
        case "oracle":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  placeholder="e.g. localhost"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Port</label>
                <input
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="1521"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Service Name / SID</label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  placeholder="ORCL"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="admin"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                />
              </div>
            </div>
          );
        // New Connector: Graphite
        case "graphite":
          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-slate-300">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="e.g. http://localhost:2003"
                  className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white text-sm font-semibold outline-hidden w-full"
                  required
                />
              </div>
            </div>
          );
        default:
          return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-brand-card border border-brand-border text-slate-200 px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* VIEW: DATASOURCES LIST */}
      {view === "list" && (
        <div>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 select-none">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Connected Datasources
              </h1>
              <p className="text-gray-400">
                Manage and configure your live data feeds and system connections
              </p>
            </div>
            <button
              onClick={() => setView("select-connector")}
              className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white font-bold py-3.5 px-6 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-md active:translate-y-0.5 self-start"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add data source
            </button>
          </div>

          {/* LIST */}
          {datasources.length === 0 ? (
            <div className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-12 rounded-3xl text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-500 mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No connected data sources</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6 text-sm">
                Get started by adding a connector to ingest time-series or IoT telemetry data.
              </p>
              <button
                onClick={() => setView("select-connector")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                Choose a Connector
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {datasources.map((source) => (
                <div
                  key={source._id}
                  className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-blue-500/10 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                          {renderConnectorIcon(source.type, "w-8 h-8")}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {source.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5 capitalize">
                            {source.type} {source.config?.product ? `(${source.config.product})` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getBadgeClass(source.type) && (
                          <span className={getBadgeClass(source.type)}>
                            {source.type}
                          </span>
                        )}
                        <button
                          onClick={() => handleDelete(source._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer shadow-sm"
                          title="Delete Datasource"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Connection URL
                        </span>
                        <code className="bg-slate-950/40 px-3.5 py-2 rounded-xl border border-white/5 text-slate-300 font-mono text-xs overflow-x-auto select-all font-semibold">
                          {source.url}
                        </code>
                      </div>

                      {source.config?.organization && (
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Organization
                            </span>
                            <span className="text-xs font-semibold text-slate-300 truncate px-1">
                              {source.config.organization}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Bucket
                            </span>
                            <span className="text-xs font-semibold text-slate-300 truncate px-1">
                              {source.config.bucket}
                            </span>
                          </div>
                        </div>
                      )}

                      {source.config?.database && (
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Database
                          </span>
                          <span className="text-xs font-semibold text-slate-300 px-1">
                            {source.config.database}
                          </span>
                        </div>
                      )}

                      {source.topic && (
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            MQTT Topic
                          </span>
                          <code className="bg-slate-950/40 px-3.5 py-2 rounded-xl border border-white/5 text-slate-300 font-mono text-xs overflow-x-auto select-all">
                            {source.topic}
                          </code>
                        </div>
                      )}

                      {source.type === "rest" && source.config?.valuePath && (
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              JSON Value Path
                            </span>
                            <code className="text-xs font-mono font-semibold text-slate-300 px-1">
                              {source.config.valuePath}
                            </code>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Influx Measurement
                            </span>
                            <span className="text-xs font-semibold text-emerald-400 px-1">
                              {source.config.measurement || "temperature"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Connected
                    </span>
                    <span>Updated: {source.updatedAt ? new Date(source.updatedAt).toLocaleDateString() : "Just now"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: SELECT CONNECTOR GRID */}
      {view === "select-connector" && (
        <div className="max-w-4xl mx-auto bg-brand-card/90 border border-brand-border p-8 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] select-none animate-fade-in overflow-y-auto max-h-screen">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Add data source</h2>
              <p className="text-slate-400 text-sm mt-1">Choose a connector to get started</p>
            </div>
            <button
              onClick={() => setView("list")}
              className="text-slate-400 hover:text-white cursor-pointer w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MQTT */}
            <div
              onClick={() => handleSelectConnector("mqtt")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#10b981] group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/30 transition-colors">
                {renderConnectorIcon("mqtt", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#10b981] transition-colors flex items-center gap-1">
                    MQTT
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Connect any MQTT broker for real-time IoT telemetry.</p>
              </div>
            </div>

            {/* INFLUXDB */}
            <div
              onClick={() => handleSelectConnector("influxdb")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-colors flex items-center justify-center w-12 h-12">
                {renderConnectorIcon("influxdb", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                    InfluxDB
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Time-series database for metrics and events.</p>
              </div>
            </div>

            {/* PROMETHEUS */}
            <div
              onClick={() => handleSelectConnector("prometheus")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#f59e0b] group-hover:bg-[#f59e0b]/10 group-hover:border-[#f59e0b]/30 transition-colors">
                {renderConnectorIcon("prometheus", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#f59e0b] transition-colors flex items-center gap-1">
                    Prometheus
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Pull metrics from any Prometheus-compatible endpoint.</p>
              </div>
            </div>

            {/* POSTGRESQL */}
            <div
              onClick={() => handleSelectConnector("postgresql")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#6366f1] group-hover:bg-[#6366f1]/10 group-hover:border-[#6366f1]/30 transition-colors">
                {renderConnectorIcon("postgresql", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#6366f1] transition-colors flex items-center gap-1">
                    PostgreSQL
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Connect relational databases including TimescaleDB.</p>
              </div>
            </div>

            {/* LOKI */}
            <div
              onClick={() => handleSelectConnector("loki")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#f43f5e] group-hover:bg-[#f43f5e]/10 group-hover:border-[#f43f5e]/30 transition-colors">
                {renderConnectorIcon("loki", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#f43f5e] transition-colors flex items-center gap-1">
                    Loki
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Log aggregation system by Grafana Labs.</p>
              </div>
            </div>

            {/* REST API */}
            <div
              onClick={() => handleSelectConnector("rest")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#06b6d4] group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30 transition-colors">
                {renderConnectorIcon("rest", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#06b6d4] transition-colors flex items-center gap-1">
                    REST API
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Pull data from any HTTP/REST endpoint on a schedule.</p>
              </div>
            </div>

            {/* WEBSOCKET */}
            <div
              onClick={() => handleSelectConnector("websocket")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#eab308] group-hover:bg-[#eab308]/10 group-hover:border-[#eab308]/30 transition-colors">
                {renderConnectorIcon("websocket", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#eab308] transition-colors flex items-center gap-1">
                    WebSocket
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Stream real-time data over persistent WS connections.</p>
              </div>
            </div>

            {/* CSV / FILE */}
            <div
              onClick={() => handleSelectConnector("csv")}
              className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
            >
              <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#f97316] group-hover:bg-[#f97316]/10 group-hover:border-[#f97316]/30 transition-colors">
                {renderConnectorIcon("csv", "w-6 h-6")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white group-hover:text-[#f97316] transition-colors flex items-center gap-1">
                    CSV / File
                    <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Upload static datasets for one-time or scheduled use.</p>
              </div>
            </div>
          <div
  onClick={() => handleSelectConnector("mysql")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#10b981] group-hover:bg-[#10b981]/10 group-hover:border-[#10b981]/30 transition-colors">
    {renderConnectorIcon("mysql", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#10b981] transition-colors flex items-center gap-1">
        MySQL
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Connect to a MySQL relational database.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("mongodb")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-green-600/50 hover:shadow-[0_0_15px_rgba(0,200,83,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#00c853] group-hover:bg-[#00c853]/10 group-hover:border-[#00c853]/30 transition-colors">
    {renderConnectorIcon("mongodb", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#00c853] transition-colors flex items-center gap-1">
        MongoDB
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Connect to a MongoDB document store.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("mssql")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-blue-600/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#2563eb] group-hover:bg-[#2563eb]/10 group-hover:border-[#2563eb]/30 transition-colors">
    {renderConnectorIcon("mssql", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#2563eb] transition-colors flex items-center gap-1">
        MSSQL
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Connect to a Microsoft SQL Server database.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("elasticsearch")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#eab308] group-hover:bg-[#eab308]/10 group-hover:border-[#eab308]/30 transition-colors">
    {renderConnectorIcon("elasticsearch", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#eab308] transition-colors flex items-center gap-1">
        Elasticsearch
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Search and analytics engine.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("redis")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#ef4444] group-hover:bg-[#ef4444]/10 group-hover:border-[#ef4444]/30 transition-colors">
    {renderConnectorIcon("redis", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#ef4444] transition-colors flex items-center gap-1">
        Redis
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">In‑memory key‑value store.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("sqlite")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#6366f1] group-hover:bg-[#6366f1]/10 group-hover:border-[#6366f1]/30 transition-colors">
    {renderConnectorIcon("sqlite", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#6366f1] transition-colors flex items-center gap-1">
        SQLite
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">File‑based lightweight database.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("clickhouse")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-purple-600/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#9333ea] group-hover:bg-[#9333ea]/10 group-hover:border-[#9333ea]/30 transition-colors">
    {renderConnectorIcon("clickhouse", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#9333ea] transition-colors flex items-center gap-1">
        ClickHouse
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">High‑performance column‑oriented OLAP DB.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("cassandra")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-cyan-600/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#06b6d4] group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30 transition-colors">
    {renderConnectorIcon("cassandra", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#06b6d4] transition-colors flex items-center gap-1">
        Cassandra
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Scalable NoSQL wide‑column store.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("oracle")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-orange-600/50 hover:shadow-[0_0_15px_rgba(234,88,12,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#ea580c] group-hover:bg-[#ea580c]/10 group-hover:border-[#ea580c]/30 transition-colors">
    {renderConnectorIcon("oracle", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#ea580c] transition-colors flex items-center gap-1">
        Oracle
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Enterprise relational database.</p>
  </div>
</div>

<div
  onClick={() => handleSelectConnector("graphite")}
  className="relative flex items-start gap-4 bg-[#141b2b]/60 border border-white/5 hover:border-pink-600/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.1)] p-5 rounded-2xl cursor-pointer hover:bg-[#1e293b]/50 transition-all duration-300 group"
>
  <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 text-[#ec4899] group-hover:bg-[#ec4899]/10 group-hover:border-[#ec4899]/30 transition-colors">
    {renderConnectorIcon("graphite", "w-6 h-6")}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center justify-between mb-1">
      <h3 className="font-bold text-white group-hover:text-[#ec4899] transition-colors flex items-center gap-1">
        Graphite
        <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </h3>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">Time‑series Graphite server.</p>
  </div>
</div>
</div>
        </div>
      )}

      {/* VIEW: CONNECTOR WIZARD */}
      {view === "connector-config" && (
        <div className="max-w-6xl mx-auto animate-fade-in">
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 select-none">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("select-connector")}
                className="text-slate-400 hover:text-white bg-slate-900/60 p-2.5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer shadow-md outline-hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1e293b] border border-blue-500/30 rounded-xl flex items-center justify-center">
                  {renderConnectorIcon(formData.type, "w-8 h-8")}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">{getConnectorTitle()}</h2>
                  <p className="text-slate-400 text-xs mt-0.5">{getConnectorSubtitle()}</p>
                </div>
              </div>
            </div>

            {/* STACKED PILLS */}
            <div className="flex items-center gap-3.5">
              <div className="bg-[#f8fafc] border border-slate-200 px-4 py-1.5 rounded-lg flex flex-col items-center justify-center leading-none h-12 min-w-20 shadow-md">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mb-1">TYPE</span>
                <span className="text-xs font-extrabold text-[#4f46e5] uppercase">{formData.type}</span>
              </div>
              <div className="bg-[#ecfdf5] border border-emerald-200 px-3.5 py-1.5 rounded-lg flex flex-col items-center justify-center leading-none h-12 shadow-md">
                <span className="text-[9px] font-bold text-emerald-500/70 tracking-wider uppercase mb-1">ALERTING</span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {formData.type === "csv" ? "Not Supported" : "Supported"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT SIDEBAR NAVIGATION */}
            <div className="lg:col-span-1 select-none flex flex-col gap-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-4">
                  Connect Data Source
                </span>
                <div className="flex flex-col gap-1.5 font-semibold">
                  {/* STEP 1 */}
                  <button
                    onClick={() => canGoToStep(1) && setConfigStep(1)}
                    disabled={!canGoToStep(1)}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl w-full text-left transition-all border duration-200 cursor-pointer outline-hidden ${
                      configStep === 1
                        ? "bg-blue-600/10 text-white border-blue-500/20 font-bold"
                        : canGoToStep(1)
                        ? "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
                        : "text-slate-500 border-transparent cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border ${
                        configStep === 1
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      1
                    </span>
                    <span className="text-sm font-semibold">URL and authentication</span>
                  </button>

                  {/* STEP 2 */}
                  <button
                    onClick={() => canGoToStep(2) && setConfigStep(2)}
                    disabled={!canGoToStep(2)}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl w-full text-left transition-all border duration-200 cursor-pointer outline-hidden ${
                      configStep === 2
                        ? "bg-blue-600/10 text-white border-blue-500/20 font-bold"
                        : canGoToStep(2)
                        ? "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
                        : "text-slate-500 border-transparent cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border ${
                        configStep === 2
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      2
                    </span>
                    <span className="text-sm font-semibold">{getStep2Name()}</span>
                  </button>

                  {/* STEP 3 */}
                  <button
                    onClick={() => canGoToStep(3) && setConfigStep(3)}
                    disabled={!canGoToStep(3)}
                    className={`flex items-center gap-3.5 px-3 py-3 rounded-xl w-full text-left transition-all border duration-200 cursor-pointer outline-hidden ${
                      configStep === 3
                        ? "bg-blue-600/10 text-white border-blue-500/20 font-bold"
                        : canGoToStep(3)
                        ? "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
                        : "text-slate-500 border-transparent cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold transition-all border ${
                        configStep === 3
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700 bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      3
                    </span>
                    <span className="text-sm font-semibold">Save & test</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT WIZARD CARD */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-brand-card/85 backdrop-blur-2xl border border-brand-border rounded-3xl p-8 min-h-[520px] shadow-2xl">
              <div>
                {/* STEP 1 DETAILS */}
                {configStep === 1 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white tracking-tight">URL and authentication</h3>
                      <p className="text-slate-400 text-xs mt-1">Enter connection details for your data client.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Connection Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-slate-300">
                          Connection name <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-semibold">A friendly name to identify this data source</span>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white transition-all text-sm font-semibold placeholder-slate-600 w-full outline-hidden"
                          required
                        />
                      </div>

                      {/* URL / Path */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-slate-300">
                          {formData.type === "csv" ? "File Path" : "URL"} <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {formData.type === "csv" ? "Full absolute path to the local CSV file" : "Server or server network address"}
                        </span>
                        <input
                          type="text"
                          name="url"
                          value={formData.url}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white transition-all text-sm font-semibold placeholder-slate-600 w-full outline-hidden"
                          required
                        />
                      </div>

                      {/* InfluxDB specific parameters */}
                      {formData.type === "influxdb" && (
                        <>
                          {/* Product Selector */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-extrabold text-slate-300">Product <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-2.5 bg-slate-950/45 p-1.5 rounded-2xl border border-white/5">
                              {["InfluxDB 1.x", "InfluxDB 2.x", "Cloud"].map((prod) => (
                                <button
                                  key={prod}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      product: prod,
                                      queryLanguage: prod === "InfluxDB 1.x" ? "InfluxQL" : "Flux",
                                    });
                                  }}
                                  className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                    formData.product === prod
                                      ? "bg-[#1e293b] border border-blue-500 text-white shadow-md shadow-blue-500/5"
                                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                  }`}
                                >
                                  {prod}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Query Language */}
                          <div className="flex flex-col gap-2">
                            <label className="text-xs font-extrabold text-slate-300">
                              Query language <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                              Flux is recommended for InfluxDB 2.x and Cloud. InfluxQL is supported via compatibility APIs.
                            </span>
                            <div className="grid grid-cols-2 gap-2.5 bg-slate-950/45 p-1.5 rounded-2xl border border-white/5 w-full md:w-3/4">
                              {["Flux", "InfluxQL"].map((lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, queryLanguage: lang })}
                                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                    formData.queryLanguage === lang
                                      ? "bg-[#1e293b] border border-blue-500 text-white shadow-md"
                                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                  }`}
                                >
                                  {lang}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Token Field */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-slate-300">
                              Token <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                              API token with read/write access. Generate one in InfluxDB UI — Data — API Tokens.
                            </span>
                            <input
                              type="password"
                              name="token"
                              value={formData.token}
                              onChange={handleChange}
                              placeholder="your-influxdb-api-token"
                              className="px-4 py-3 rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 text-white transition-all text-sm font-semibold w-full outline-hidden"
                              required
                            />
                          </div>
                        </>
                      )}

                      {/* Optional Auth Fields for other components */}
                      {formData.type !== "influxdb" && formData.type !== "csv" && (
                        <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/10">
                          <div className="px-5 py-4 border-b border-white/5 bg-slate-900/20 text-xs font-bold text-slate-300">
                            Authentication (Optional)
                          </div>
                          <div className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Username</label>
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g. read-only-user"
                                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-white/5 focus:border-blue-500/50 text-white text-xs font-semibold outline-hidden"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password / Private Key</label>
                              <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-white/5 focus:border-blue-500/50 text-white text-xs font-semibold outline-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Accordion Advanced */}
                      <div className="border border-white/5 rounded-2xl overflow-hidden mt-2 bg-slate-950/20">
                        <button
                          type="button"
                          onClick={() => setAdvancedOpen(!advancedOpen)}
                          className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer select-none"
                        >
                          <span>Advanced HTTP Settings</span>
                          <svg
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        {advancedOpen && (
                          <div className="px-5 pb-5 pt-1.5 flex flex-col gap-4 border-t border-white/5 animate-slide-down">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allowed cookies</label>
                              <input
                                type="text"
                                name="allowedCookies"
                                value={advancedSettings.allowedCookies}
                                onChange={handleAdvancedChange}
                                placeholder="cookie_name_1, cookie_name_2"
                                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-white/5 focus:border-blue-500/50 text-white text-xs font-semibold outline-hidden"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeout</label>
                              <input
                                type="text"
                                name="timeout"
                                value={advancedSettings.timeout}
                                onChange={handleAdvancedChange}
                                placeholder="30s"
                                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-white/5 focus:border-blue-500/50 text-white text-xs font-semibold outline-hidden"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom HTTP Headers</label>
                              <input
                                type="text"
                                name="customHeaders"
                                value={advancedSettings.customHeaders}
                                onChange={handleAdvancedChange}
                                placeholder="X-Header-Name: Value"
                                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-white/5 focus:border-blue-500/50 text-white text-xs font-semibold outline-hidden"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 DETAILS */}
                {configStep === 2 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white tracking-tight">{getStep2Name()}</h3>
                      <p className="text-slate-400 text-xs mt-1">Configure database schemas or connection variables.</p>
                    </div>

                    <div>
                      {renderStep2Fields()}
                    </div>
                  </div>
                )}

                {/* STEP 3 DETAILS */}
                {configStep === 3 && (
                  <div>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white tracking-tight">Save & test</h3>
                      <p className="text-slate-400 text-xs mt-1">Review connection settings and test backend connectivity.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Configuration Summary Box */}
                      <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settings Summary</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs font-medium">
                          <div>
                            <span className="text-slate-500 block mb-0.5">Connection Name</span>
                            <span className="text-white font-semibold">{formData.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Connector Type</span>
                            <span className="text-white font-semibold capitalize">{formData.type}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 block mb-0.5">{formData.type === "csv" ? "File Path" : "Endpoint URL"}</span>
                            <code className="text-blue-400 font-mono font-semibold truncate block bg-slate-900/40 py-1.5 px-3.5 rounded-lg border border-white/5 select-all mt-1">
                              {formData.url}
                            </code>
                          </div>
                          {formData.type === "influxdb" && (
                            <>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Product</span>
                                <span className="text-white font-semibold">{formData.product}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Query Language</span>
                                <span className="text-white font-semibold">{formData.queryLanguage}</span>
                              </div>
                              {formData.product === "InfluxDB 1.x" ? (
                                <div>
                                  <span className="text-slate-500 block mb-0.5">Database</span>
                                  <span className="text-white font-semibold">{formData.database}</span>
                                </div>
                              ) : (
                                <>
                                  <div>
                                    <span className="text-slate-500 block mb-0.5">Organization</span>
                                    <span className="text-white font-semibold">{formData.organization}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500 block mb-0.5">Bucket</span>
                                    <span className="text-white font-semibold">{formData.bucket}</span>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          {formData.type === "mqtt" && (
                            <>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Subscribed Topic</span>
                                <span className="text-white font-semibold">{formData.topic}</span>
                              </div>
                              {formData.clientId && (
                                <div>
                                  <span className="text-slate-500 block mb-0.5">Client ID</span>
                                  <span className="text-white font-semibold">{formData.clientId}</span>
                                </div>
                              )}
                            </>
                          )}
                          {formData.type === "postgresql" && (
                            <div>
                              <span className="text-slate-500 block mb-0.5">Database</span>
                              <span className="text-white font-semibold">{formData.database}</span>
                            </div>
                          )}
                          {formData.type === "prometheus" && (
                            <div>
                              <span className="text-slate-500 block mb-0.5">Scrape Interval</span>
                              <span className="text-white font-semibold">{formData.scrapeInterval}</span>
                            </div>
                          )}
                          {formData.type === "loki" && formData.organization && (
                            <div>
                              <span className="text-slate-500 block mb-0.5">Tenant ID</span>
                              <span className="text-white font-semibold">{formData.organization}</span>
                            </div>
                          )}
                          {formData.type === "rest" && (
                            <>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Method</span>
                                <span className="text-white font-semibold">{formData.httpMethod}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Query Interval</span>
                                <span className="text-white font-semibold">{formData.scrapeInterval}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">JSON Value Path</span>
                                <code className="text-white font-mono font-semibold">{formData.valuePath}</code>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">Measurement</span>
                                <span className="text-emerald-400 font-semibold">{formData.measurement}</span>
                              </div>
                            </>
                          )}
                          {formData.type === "csv" && (
                            <>
                              <div>
                                <span className="text-slate-500 block mb-0.5">CSV Delimiter</span>
                                <span className="text-white font-semibold">"{formData.csvDelimiter}"</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block mb-0.5">First Row Header</span>
                                <span className="text-white font-semibold">{formData.csvHeader ? "Yes" : "No"}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Test Connection Results */}
                      {testing && (
                        <div className="flex items-center gap-3.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 p-5 rounded-2xl">
                          <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </div>
                          <span className="text-sm font-semibold">Testing connectivity to {getConnectorTitle()}...</span>
                        </div>
                      )}

                      {testResult && (
                        <div
                          className={`flex items-start gap-4 p-5 rounded-2xl border ${
                            testResult.success
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {testResult.success ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-extrabold text-sm">{testResult.success ? "Connection test successful" : "Connection test failed"}</h4>
                            <p className="text-xs mt-1 leading-relaxed opacity-85">{testResult.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD BOTTOM NAVIGATION BAR */}
              <div className="border-t border-white/5 pt-6 mt-8 flex items-center justify-between select-none">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (configStep > 1) {
                      setConfigStep(configStep - 1);
                    } else {
                      setView("list");
                    }
                  }}
                  className="px-5 py-3 rounded-xl border border-white/5 hover:border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all bg-slate-900/40 hover:bg-slate-900/60 cursor-pointer shadow-sm active:translate-y-0.5 outline-hidden"
                >
                  {configStep > 1 ? "← Back" : "Cancel"}
                </button>

                {/* Forward/Save Button */}
                {configStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (canGoToStep(configStep + 1)) {
                        setConfigStep(configStep + 1);
                      } else {
                        showToast("Please fill in all required fields marked with an asterisk (*).");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white text-xs font-bold py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md active:translate-y-0.5 outline-hidden"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveAndTest}
                    disabled={testing}
                    className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 text-xs font-extrabold py-3 px-5.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:translate-y-0.5 outline-hidden"
                  >
                    {testing ? "Testing..." : "Save & Test"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Datasources;