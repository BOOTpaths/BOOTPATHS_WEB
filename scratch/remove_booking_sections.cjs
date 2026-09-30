const fs = require('fs');
const path = require('path');

const treksDir = path.resolve('public/treks');

function findHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allHtmlFiles = findHtmlFiles(treksDir);
console.log(`Found ${allHtmlFiles.length} HTML files`);

for (const filePath of allHtmlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match <!-- BOOKING ... --> (optional) followed by <section ...id="booking"...>...</section>
  // Note: Handle both id="booking" and id="booking-section"
  const regex = /(\s*<!--\s*(?:BOOKING|REDESIGNED PAYMENT|CTA)[\s\S]*?-->\s*)?<section[^>]*id=["']booking["'][^>]*>[\s\S]*?<\/section>/gi;

  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed booking section from: ${filePath}`);
  } else {
    console.log(`No matching booking section in: ${filePath}`);
  }
}
