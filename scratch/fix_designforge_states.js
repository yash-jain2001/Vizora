const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../client/src/pages/DesignForge.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The first attempt failed due to \r\n, let's use regex
const compRegex = /const DesignForge = \(\) => \{\r?\n/;
const stateVars = `  const [loading, setLoading] = useState(true);
  const [erpData, setErpData] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [erpConfig, setErpConfig] = useState({ datasourceId: '' });
  const [datasources, setDatasources] = useState([]);\n
`;

if (!content.includes('const [loading, setLoading]')) {
  content = content.replace(compRegex, (match) => match + stateVars);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed DesignForge states');
