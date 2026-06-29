const fs = require('fs');

const filePath = 'C:\\Users\\Harsh\\.gemini\\antigravity\\brain\\5dcd6380-7579-4611-9f80-7f5869009679\\.system_generated\\steps\\3\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

const regex = /class="[^"]*plugin-card[^"]*"\s+id=([^\s>]+)/g;
const ids = [];
let match;
while ((match = regex.exec(content)) !== null) {
  ids.push(match[1]);
}

console.log('Found plugin-card IDs:', ids);

// Let's also parse the attributes from those div elements to get name, author, type, etc.
const cardRegex = /<div class="col col--sm-6 col--md-4 plugin-card" id=([^\s>]+) data-keywords='(.*?)' data-name=([^\s>]+) data-type="([^"]+)" data-author="?([^">]+)"?/g;
const cards = [];
regex.lastIndex = 0;
// A more general regex to find all card elements
const divRegex = /<div class="col col--sm-6 col--md-4 plugin-card"\s+id=([^\s>]+)[^>]*>/g;
const cardIds = [];
while ((match = divRegex.exec(content)) !== null) {
  cardIds.push(match[1]);
}
console.log('Found card IDs using divRegex:', cardIds);
