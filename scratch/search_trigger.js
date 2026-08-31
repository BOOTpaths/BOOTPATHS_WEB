import fs from 'fs';
const content = fs.readFileSync('c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/App.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('handleTrigger') || line.includes('book_trek')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
