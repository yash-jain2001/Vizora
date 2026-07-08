const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, '../client/src/components/charts');
const files = fs.readdirSync(chartsDir);

let changedFiles = 0;

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(chartsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace useWidgetData('some-string', initialOption) with useWidgetData(widget, initialOption)
    if (content.match(/useWidgetData\('[^']+',\s*initialOption\)/)) {
      content = content.replace(/useWidgetData\('[^']+',\s*initialOption\)/g, 'useWidgetData(widget, initialOption)');
      fs.writeFileSync(filePath, content, 'utf8');
      changedFiles++;
    }
  }
}

console.log(`Fixed useWidgetData calls in ${changedFiles} files`);
