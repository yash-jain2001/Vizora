const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, '../client/src/components/charts');
const files = fs.readdirSync(chartsDir);

let fixedFiles = 0;

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(chartsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // If it uses useWidgetData but doesn't import it
    if (content.includes('useWidgetData') && !content.includes("import useWidgetData")) {
      // Find the last import statement or the top of the file
      const importLine = "import useWidgetData from '../../hooks/useWidgetData';\n";
      
      // Inject it after the imports or at the top
      content = importLine + content;
      fs.writeFileSync(filePath, content, 'utf8');
      fixedFiles++;
    }
  }
}

console.log(`Added missing import to ${fixedFiles} files`);
