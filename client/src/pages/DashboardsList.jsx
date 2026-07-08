import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';

const DashboardsList = () => {
  const [dashboards, setDashboards] = useState([]);
  const [datasources, setDatasources] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatasourceModalOpen, setIsDatasourceModalOpen] = useState(false);
  const [selectedDatasource, setSelectedDatasource] = useState('');
  const navigate = useNavigate();

  const fetchDashboards = async () => {
    try {
      const res = await API.get('/dashboards');
      setDashboards(res.data);
    } catch (error) {
      console.error('Error fetching dashboards:', error);
    }
  };

  useEffect(() => {
    fetchDashboards();
    const fetchDatasources = async () => {
      try {
        const res = await API.get('/datasources');
        setDatasources(res.data);
      } catch (error) {
        console.error('Error fetching datasources:', error);
      }
    };
    fetchDatasources();
  }, []);

  const handleStartFromScratchStep1 = () => {
    setIsModalOpen(false);
    setIsDatasourceModalOpen(true);
  };

  const handleStartFromScratchConfirm = async () => {
    try {
      if (!selectedDatasource && datasources.length > 0) {
        alert('Please select a data source first.');
        return;
      }
      const title = 'New Dashboard ' + Date.now().toString().slice(-4);
      const res = await API.post('/dashboards', {
        title,
        widgets: [],
        // In the future, we could save defaultDatasource: selectedDatasource here
      });
      navigate(`/dashboard/${res.data._id}`);
    } catch (error) {
      console.error('Failed to create new dashboard:', error);
      alert('Failed to create dashboard');
    }
  };

  const handleUseTemplate = async (templateName) => {
    try {
      let widgets = [];
      if (templateName === 'IoT Monitoring') {
        widgets = [
          { type: 'line-chart', title: 'Temperature History', x: 0, y: 0, w: 6, h: 4 },
          { type: 'gauge-chart', title: 'Current Pressure', x: 6, y: 0, w: 6, h: 4 },
        ];
      } else if (templateName === 'Energy Monitoring') {
        widgets = [
          { type: 'bar-chart', title: 'Weekly Consumption', x: 0, y: 0, w: 12, h: 4 },
        ];
      }

      const title = `${templateName} Template`;
      const res = await API.post('/dashboards', {
        title,
        widgets,
      });
      navigate(`/dashboard/${res.data._id}`);
    } catch (error) {
      console.error('Failed to create from template:', error);
      alert('Failed to create dashboard');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 select-none">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Dashboards
          </h1>
          <p className="text-slate-400 font-semibold text-sm">
            Manage and create your custom dashboard layouts
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] text-slate-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer text-sm shadow-md active:translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboards.map((dash) => (
          <div
            key={dash._id}
            onClick={() => navigate(`/dashboard/${dash._id}`)}
            className="bg-brand-card/45 backdrop-blur-xl border border-white/5 p-6 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 rounded-xl border border-white/5 group-hover:bg-emerald-500/10 transition-colors">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded-lg">
                {dash.widgets?.length || 0} Widgets
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {dash.title}
            </h3>
            <p className="text-sm text-slate-400">
              Created {new Date(dash.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        {dashboards.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">No Dashboards Yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm">Create your first dashboard to start visualizing your data.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-400 font-bold border-b border-emerald-500/30 hover:border-emerald-400"
            >
              Create New Dashboard
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-2">Create New Dashboard</h2>
            <p className="text-slate-400 mb-8">How would you like to start?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={handleStartFromScratchStep1}
                className="bg-slate-950/50 border border-white/5 p-6 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start from Scratch</h3>
                <p className="text-sm text-slate-400">Open a blank canvas and drag-and-drop the widgets you need.</p>
              </div>

              <div
                onClick={() => handleUseTemplate('IoT Monitoring')}
                className="bg-slate-950/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3 12h.008v.008H11.25v-.008zm3 0h.008v.008H14.25v-.008zm3 0h.008v.008H17.25v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">IoT Template</h3>
                <p className="text-sm text-slate-400">Start with a pre-configured layout for IoT device monitoring.</p>
              </div>

              <div
                onClick={() => handleUseTemplate('Energy Monitoring')}
                className="bg-slate-950/50 border border-white/5 p-6 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 cursor-pointer transition-all group"
              >
                <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Energy Template</h3>
                <p className="text-sm text-slate-400">Pre-built dashboard for tracking power consumption.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isDatasourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setIsDatasourceModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-white mb-2">Select a Data Source</h2>
            <p className="text-slate-400 mb-8">Choose the primary data source for this dashboard.</p>

            <div className="flex flex-col gap-4">
              <select
                value={selectedDatasource}
                onChange={(e) => setSelectedDatasource(e.target.value)}
                className="px-4 py-4 rounded-xl bg-slate-950/50 border border-white/10 text-white font-semibold outline-none focus:border-emerald-500/50 cursor-pointer text-lg w-full"
              >
                <option value="" disabled>-- Select a Data Source --</option>
                <option value="mock">Use Mock / Global Stream</option>
                {datasources.map(ds => (
                  <option key={ds._id} value={ds._id}>
                    {ds.name} ({ds.type.toUpperCase()})
                  </option>
                ))}
              </select>

              <button
                onClick={handleStartFromScratchConfirm}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl transition-all duration-200 mt-4 cursor-pointer text-lg shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] w-full"
              >
                Open Blank Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardsList;
