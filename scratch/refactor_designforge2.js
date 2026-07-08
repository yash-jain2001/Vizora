const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/pages/DesignForge.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
content = content.replace(/\r\n/g, '\n');

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

fs.writeFileSync(filePath, content, 'utf8');
console.log('DesignForge logic refactored successfully.');
