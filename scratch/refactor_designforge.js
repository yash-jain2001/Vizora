const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/pages/DesignForge.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add API and useEffect imports
content = content.replace(/import \{ useState \} from "react";/, 'import { useState, useEffect } from "react";\nimport API from "../api/axios";');

// 2. Add loading state and erpData state inside component
const compStart = 'const DesignForge = () => {\n';
content = content.replace(compStart, compStart + `  const [loading, setLoading] = useState(true);\n  const [erpData, setErpData] = useState(null);\n  const [showConfig, setShowConfig] = useState(false);\n  const [erpConfig, setErpConfig] = useState({ datasourceId: '' });\n  const [datasources, setDatasources] = useState([]);\n\n`);

// 3. Add useEffect to fetch data and datasources
const fetchLogic = `  useEffect(() => {
    const fetchData = async () => {
      try {
        const [erpRes, dsRes, confRes] = await Promise.all([
          API.get('/erp/data'),
          API.get('/datasources'),
          API.get('/erp/config')
        ]);
        setErpData(erpRes.data);
        setJobs(erpRes.data.jobs);
        setMaterials(erpRes.data.materials);
        setBatches(erpRes.data.batches);
        setDatasources(dsRes.data);
        setErpConfig(confRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading || !erpData) {
    return <DashboardLayout><div className="flex items-center justify-center h-screen text-white">Loading ERP Data...</div></DashboardLayout>;
  }

  const productsData = erpData.productsData;
  const productionTrendData = erpData.productionTrendData;
  const OeeDistribution = erpData.OeeDistribution;
`;

// Replace `const productsData = { ... };` entirely
// We can use regex to remove `const productsData = { ... };` and replace it with `fetchLogic`
const productsDataRegex = /const productsData = \{[\s\S]*?\}\n\s*  \};\n/;
content = content.replace(productsDataRegex, fetchLogic);

// 4. Remove `const productionTrendData = ...` and `const OeeDistribution = ...`
const trendRegex = /const productionTrendData = \[[\s\S]*?\];\n/;
content = content.replace(trendRegex, '');
const oeeRegex = /const OeeDistribution = \[[\s\S]*?\];\n/;
content = content.replace(oeeRegex, '');

// 5. Replace `useState([...jobs])` with `useState([])`
const jobsRegex = /const \[jobs, setJobs\] = useState\(\[[\s\S]*?\]\);\n/;
content = content.replace(jobsRegex, 'const [jobs, setJobs] = useState([]);\n');

// 6. Replace `useState([...materials])` with `useState([])`
const matsRegex = /const \[materials, setMaterials\] = useState\(\[[\s\S]*?\]\);\n/;
content = content.replace(matsRegex, 'const [materials, setMaterials] = useState([]);\n');

// 7. Replace `useState([...batches])` with `useState([])`
const batchRegex = /const \[batches, setBatches\] = useState\(\[[\s\S]*?\]\);\n/;
content = content.replace(batchRegex, 'const [batches, setBatches] = useState([]);\n');

// 8. Add Config Modal to the render
const settingsButton = `
        <button onClick={() => setShowConfig(true)} className="px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:text-white cursor-pointer ml-4">
          ⚙️ ERP Settings
        </button>
`;

content = content.replace(/<\/div>\n\n        \{\/\* TABS SWITCHEB \*\/\}/, settingsButton + '</div>\n\n        {/* TABS SWITCHEB */}');

const configModal = `
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">ERP Settings</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Data Source Connection</label>
                <select 
                  value={erpConfig?.datasourceId || ''}
                  onChange={(e) => setErpConfig({...erpConfig, datasourceId: e.target.value})}
                  className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl text-sm text-white"
                >
                  <option value="">Mock ERP Data</option>
                  {datasources.map(ds => (
                    <option key={ds._id} value={ds._id}>{ds.name} ({ds.type})</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-2">Select a connected database to power the ERP.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-2">Jobs Query</label>
                <input 
                  type="text"
                  placeholder="SELECT * FROM jobs..."
                  value={erpConfig?.queries?.jobsQuery || ''}
                  onChange={(e) => setErpConfig({...erpConfig, queries: {...erpConfig.queries, jobsQuery: e.target.value}})}
                  className="w-full bg-[#1e293b] border border-white/10 p-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8 justify-end">
              <button 
                onClick={() => setShowConfig(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await API.post('/erp/config', erpConfig);
                    setShowConfig(false);
                    window.location.reload();
                  } catch (e) {
                    alert('Error saving config');
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 cursor-pointer"
              >
                Save & Restart ERP
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(/<\/DashboardLayout>/, configModal + '\n    </DashboardLayout>');

// 9. Display current connected source next to ERP title
content = content.replace(/Interiors & Furniture Manufacturing Mission Control/, 'Interiors & Furniture Manufacturing Mission Control <span className="ml-2 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] border border-emerald-500/20">{erpData.source}</span>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('DesignForge refactored successfully.');
