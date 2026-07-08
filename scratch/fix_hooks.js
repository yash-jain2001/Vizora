const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/pages/DesignForge.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove jobs, activeJobDetail, materials, batches from their current locations
content = content.replace(/const \[jobs, setJobs\] = useState\(\[\]\);\n/g, '');
content = content.replace(/const \[activeJobDetail, setActiveJobDetail\] = useState\(null\);\n/g, '');
content = content.replace(/const \[materials, setMaterials\] = useState\(\[\]\);\n/g, '');
content = content.replace(/const \[batches, setBatches\] = useState\(\[\]\);\n/g, '');

// 2. Insert them at the top before activeTab
const insertPos = content.indexOf('const [activeTab');
const newStates = `  const [jobs, setJobs] = useState([]);
  const [activeJobDetail, setActiveJobDetail] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);

`;

content = content.slice(0, insertPos) + newStates + content.slice(insertPos);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed React hook ordering.');
