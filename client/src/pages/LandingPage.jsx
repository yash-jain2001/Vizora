import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import logo from '../assets/logo.jpeg';

const faqData = [
  {
    question: 'What is Vizora?',
    answer:
      'Vizora is an open-source IoT monitoring and analytics platform that lets you collect, visualize, and analyze sensor data in real time. It provides 100+ chart types, native MQTT and HTTP data source support, smart threshold-based alerts, and role-based access control — all in a single, self-hostable dashboard.',
  },
  {
    question: 'How does Vizora compare to Grafana?',
    answer:
      'While Grafana is excellent for general observability, Vizora is purpose-built for IoT workflows. It offers native MQTT broker integration, 100+ specialized chart types optimized for sensor data (gauges, heatmaps, treemaps, sankey diagrams), built-in alert management with real-time notifications, and a simpler setup experience tailored to IoT teams.',
  },
  {
    question: 'What data sources does Vizora support?',
    answer:
      'Vizora supports MQTT brokers for real-time streaming data, HTTP/REST APIs for request-response integrations, and configurable polling endpoints for periodic data collection. You can connect multiple data sources simultaneously and visualize them on a single dashboard.',
  },
  {
    question: 'Is Vizora free to use?',
    answer:
      'Yes, Vizora is completely open-source and free to use. You can self-host it on your own infrastructure with no licensing fees or usage limits. The full source code is available for customization and contribution.',
  },
  {
    question: 'What chart types are available in Vizora?',
    answer:
      'Vizora includes over 100 chart types including line, bar, area, pie, donut, gauge, radar, heatmap, treemap, sankey, candlestick, scatter, bubble, waterfall, funnel, geographic maps, and many more. Each chart type is optimized for IoT data visualization with real-time update capabilities.',
  },
  {
    question: 'How do I set up alerts in Vizora?',
    answer:
      'Navigate to the Alert Center from your dashboard, then configure threshold rules for any data metric. You can set upper and lower bounds, define alert severity levels, and receive real-time notifications when thresholds are breached. Alerts support configurable cooldown periods to prevent notification fatigue.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const features = [
  {
    title: 'Real-Time Dashboards',
    description:
      'Live sensor data visualization with WebSocket streaming. See your IoT metrics update instantly as new data arrives from connected devices.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    title: '100+ Chart Types',
    description:
      'Line, bar, heatmap, gauge, radar, scatter, sankey, treemap, candlestick, geographic maps, and many more — each optimized for IoT data.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    ),
  },
  {
    title: 'Smart Alerts',
    description:
      'Configurable threshold-based alerts with real-time notifications. Set upper and lower bounds, severity levels, and cooldown periods.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    title: 'Multi-Source Data',
    description:
      'Connect MQTT brokers for streaming data, HTTP/REST APIs for request-response, and polling endpoints for periodic collection — all at once.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.386-3.374l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757M3.374 9.386a4.5 4.5 0 006.364 0" />
      </svg>
    ),
  },
  {
    title: 'Analytics Engine',
    description:
      'Historical data analysis with trend detection, anomaly identification, and pattern recognition across all your connected IoT devices.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
  },
  {
    title: 'Role-Based Access',
    description:
      'Admin, member, and viewer roles with granular permissions. Control who can create dashboards, manage data sources, and configure alerts.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const useCases = [
  {
    title: 'Industrial IoT',
    description:
      'Factory floor monitoring, machine health tracking, and predictive maintenance dashboards. Reduce downtime and optimize production efficiency with real-time insights.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a2.34 2.34 0 010-3.31l.71-.71a2.34 2.34 0 013.31 0l.71.71.71-.71a2.34 2.34 0 013.31 0l.71.71a2.34 2.34 0 010 3.31l-5.1 5.1a.5.5 0 01-.71 0zM20 21H4M8 21v-4h8v4" />
      </svg>
    ),
  },
  {
    title: 'Smart Buildings',
    description:
      'Environmental monitoring, energy management, and occupancy tracking. Build sustainable, data-driven workspaces with automated climate and lighting control.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3 4.5h.008v.008H18v-.008zm0 3h.008v.008H18v-.008zm0 3h.008v.008H18v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Fleet & Logistics',
    description:
      'Vehicle tracking, route optimization, and asset management. Monitor fleet health metrics, fuel consumption, and delivery performance in real time.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.149-.504 1.149-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-3.375M14.25 5.25h3.375c.621 0 1.125.504 1.125 1.125v3.375M14.25 5.25V3.75a1.125 1.125 0 00-1.125-1.125H6.375a1.125 1.125 0 00-1.125 1.125v12.75" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: '01',
    title: 'Connect Data Sources',
    description: 'Add MQTT brokers or HTTP API endpoints. Configure authentication, topics, and polling intervals in a few clicks.',
  },
  {
    step: '02',
    title: 'Build Dashboards',
    description: 'Drag and drop from 100+ visualization widgets. Customize layouts, colors, and data mappings to match your needs.',
  },
  {
    step: '03',
    title: 'Monitor & Alert',
    description: 'Set thresholds and get real-time notifications. Track trends, detect anomalies, and respond to issues instantly.',
  },
];

const stats = [
  { value: '100+', label: 'Chart Types' },
  { value: 'Real-Time', label: 'Data Streaming' },
  { value: 'MQTT & HTTP', label: 'Data Sources' },
  { value: 'RBAC', label: 'Role-Based Access' },
];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans antialiased">
      <SEOHead
        title={null}
        description="Vizora is a powerful open-source IoT monitoring and analytics platform. Real-time dashboards, 100+ chart types, MQTT & HTTP data sources, smart alerts, and role-based access control."
        keywords="IoT dashboard, IoT monitoring platform, real-time sensor analytics, MQTT dashboard, IoT data visualization, Grafana alternative, industrial IoT, sensor monitoring, IoT analytics"
        canonicalPath="/"
      />

      {/* FAQPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ─── Navigation Bar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5" aria-label="Primary navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Vizora Home">
              <img src={logo} alt="Vizora logo" className="w-9 h-9 rounded-full object-cover" width="36" height="36" />
              <span className="text-xl font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Vizora
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#use-cases" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                Use Cases
              </a>
              <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium">
                FAQ
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-bold text-slate-950 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl transition-all duration-300 shadow-[0_2px_12px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-6 pt-2 border-t border-white/5 space-y-4">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white transition-colors font-medium py-1">
                Features
              </a>
              <a href="#use-cases" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white transition-colors font-medium py-1">
                Use Cases
              </a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white transition-colors font-medium py-1">
                FAQ
              </a>
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login" className="text-center px-5 py-2.5 text-sm font-semibold text-slate-300 border border-white/10 rounded-xl">
                  Sign In
                </Link>
                <Link to="/register" className="text-center px-5 py-2.5 text-sm font-bold text-slate-950 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>
        {/* ─── Hero Section ─── */}
        <header className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

          {/* Animated Grid */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d10_1px,transparent_1px),linear-gradient(to_bottom,#1f293d10_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_70%_50%_at_50%_40%,#000_60%,transparent_100%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Open Source IoT Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Real-Time IoT Monitoring
              </span>
              <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                & Analytics Platform
              </span>
            </h1>

            <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Collect, visualize, and analyze IoT sensor data with 100+ chart types, native MQTT &amp; HTTP data sources, smart threshold alerts, and collaborative dashboards — all in one powerful, open-source platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-950 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Free
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 backdrop-blur-sm"
              >
                View Demo
              </Link>
            </div>
          </div>
        </header>

        {/* ─── Stats Bar ─── */}
        <section className="relative z-10 -mt-4 pb-16" aria-label="Platform statistics">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative group bg-brand-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="features" className="relative py-20 sm:py-28" aria-labelledby="features-heading">
          {/* Background glow */}
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" aria-hidden="true" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
              <h2 id="features-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Everything You Need for
                </span>{' '}
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  IoT Monitoring
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
                A comprehensive suite of tools designed specifically for IoT data collection, visualization, and analysis at any scale.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group relative bg-brand-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:bg-emerald-500/15 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Use Cases Section ─── */}
        <section id="use-cases" className="relative py-20 sm:py-28" aria-labelledby="use-cases-heading">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
              <h2 id="use-cases-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Built for Every
                </span>{' '}
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  IoT Scenario
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
                From factory floors to smart cities, Vizora adapts to your monitoring needs with flexible dashboards and powerful integrations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {useCases.map((useCase) => (
                <article
                  key={useCase.title}
                  className="group relative bg-brand-card/60 backdrop-blur-xl border border-white/5 rounded-2xl p-7 sm:p-9 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-[0_0_40px_rgba(16,185,129,0.08)] hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/15 transition-colors duration-300">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{useCase.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works Section ─── */}
        <section className="relative py-20 sm:py-28" aria-labelledby="how-it-works-heading">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
              <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Get Started in
                </span>{' '}
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Minutes
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
                Three simple steps to go from zero to a fully operational IoT monitoring dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {steps.map((item, index) => (
                <div key={item.step} className="relative text-center md:text-left">
                  {/* Connector line (desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[calc(100%-10%)] h-px bg-linear-to-r from-emerald-500/30 to-transparent" aria-hidden="true" />
                  )}

                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                    <span className="text-2xl font-extrabold text-emerald-400">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ Section ─── */}
        <section id="faq" className="relative py-20 sm:py-28" aria-labelledby="faq-heading">
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 sm:mb-18">
              <h2 id="faq-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Frequently Asked
                </span>{' '}
                <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h2>
              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed">
                Everything you need to know about Vizora. Can't find an answer? Reach out to our community.
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-brand-card/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/15 open:border-emerald-500/20 open:shadow-[0_0_30px_rgba(16,185,129,0.06)]"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left text-white font-semibold text-sm sm:text-base list-none select-none [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <svg
                      className="w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-300 group-open:rotate-45"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="relative py-20 sm:py-28" aria-labelledby="cta-heading">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/8 rounded-full blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Start Monitoring Your
              </span>
              <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                IoT Data Today
              </span>
            </h2>
            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Join the growing community of engineers and teams using Vizora to build powerful, real-time IoT dashboards. Free, open-source, and ready in minutes.
            </p>
            <div className="mt-10">
              <Link
                to="/register"
                className="inline-flex px-10 py-4 text-base font-bold text-slate-950 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 bg-brand-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="flex items-center gap-2.5" aria-label="Vizora Home">
                <img src={logo} alt="Vizora logo" className="w-8 h-8 rounded-full object-cover" width="32" height="32" />
                <span className="text-lg font-extrabold bg-linear-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                  Vizora
                </span>
              </Link>
              <p className="mt-3 text-xs text-slate-500 text-center md:text-left">
                Open-source IoT monitoring &amp; analytics platform.
              </p>
            </div>

            {/* Footer Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer navigation">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Features
              </a>
              <a href="#use-cases" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Use Cases
              </a>
              <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                FAQ
              </a>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Login
              </Link>
              <Link to="/register" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                Register
              </Link>
            </nav>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Vizora. All rights reserved. Built with ❤️ for the IoT community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
