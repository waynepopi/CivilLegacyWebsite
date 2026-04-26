const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'pages');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Text colors
  content = content.replace(/\btext-gray-400\b/g, 'text-gray-600 dark:text-gray-400');
  
  // Borders
  content = content.replace(/\bborder-white\/5\b/g, 'border-black/5 dark:border-white/5');
  content = content.replace(/\bborder-white\/10\b/g, 'border-black/10 dark:border-white/10');
  content = content.replace(/\bborder-white\/20\b/g, 'border-black/20 dark:border-white/20');
  
  // Backgrounds
  content = content.replace(/\bbg-white\/5\b/g, 'bg-black/5 dark:bg-white/5');
  content = content.replace(/\bbg-white\/10\b/g, 'bg-black/10 dark:bg-white/10');
  
  // Ensure we didn't duplicate e.g. text-gray-600 dark:text-gray-600 dark:text-gray-400
  content = content.replace(/text-gray-600 dark:text-gray-600 dark:text-gray-400/g, 'text-gray-600 dark:text-gray-400');
  content = content.replace(/bg-black\/5 dark:bg-black\/5 dark:bg-white\/5/g, 'bg-black/5 dark:bg-white/5');
  content = content.replace(/border-black\/5 dark:border-black\/5 dark:border-white\/5/g, 'border-black/5 dark:border-white/5');
  content = content.replace(/border-black\/10 dark:border-black\/10 dark:border-white\/10/g, 'border-black/10 dark:border-white/10');
  content = content.replace(/border-black\/20 dark:border-black\/20 dark:border-white\/20/g, 'border-black/20 dark:border-white/20');
  
  fs.writeFileSync(filePath, content);
  console.log('Updated colors in ' + file);
});
