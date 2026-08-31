import fs from 'fs';
const content = fs.readFileSync('c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/components/SilentValleyPage.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('4,000') || line.includes('4000')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
