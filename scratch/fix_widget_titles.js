const fs = require('fs');
const path = require('path');

const chartsDir = path.join(__dirname, '../client/src/components/charts');
const files = fs.readdirSync(chartsDir);

let changedFiles = 0;

for (const file of files) {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(chartsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace {title} with {widget?.title || 'Chart'}
    // Be careful to only replace exactly {title} to avoid matching other things
    if (content.includes('{title}')) {
      // For some cases where it's used inside the h3 tag
      content = content.replace(/>\{title\}</g, '>{widget?.title || "Chart"}<');
      
      // In case it's used in some other contexts, but >{title}< covers most
      if (content.includes('{title}')) {
         content = content.replace(/\{title\}/g, '{widget?.title || "Chart"}');
      }

      fs.writeFileSync(filePath, content, 'utf8');
      changedFiles++;
    }
  }
}

console.log(`Fixed titles in ${changedFiles} files`);
