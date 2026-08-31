import fs from 'fs';
const content = fs.readFileSync('c:/Users/sreel/OneDrive/Documents/BootPaths_demo/src/components/AdminConsole.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('packages') || line.includes('updateDoc') || line.includes('setDoc') || line.includes('addDoc') || line.includes('db')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
