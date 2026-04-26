const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove standalone bg-black and text-white
  content = content.replace(/\bbg-black\b/g, '');
  content = content.replace(/\btext-white\b/g, '');
  
  // Clean up extra spaces in className attributes
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');
  
  fs.writeFileSync(filePath, content);
  console.log('Updated ' + file);
});
