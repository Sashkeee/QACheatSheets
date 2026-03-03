const fs = require('fs');
const path = require('path');

const mdPath = 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\public\\Статья 1.md';
const tsPath = 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\intro-qa\\introQa1.ts';

const mdContent = fs.readFileSync(mdPath, 'utf8');

// Split by block (double newline)
const blocks = mdContent.split(/\n\n+/).map(block => block.trim()).filter(Boolean);

// Create array of strings
const jsonContent = JSON.stringify(blocks, null, 4);
// Indent properly
const formattedContent = jsonContent.split('\n').map(line => '    ' + line).join('\n').trim();

let tsContent = fs.readFileSync(tsPath, 'utf8');

const contentRegex = /content:\s*\[[\s\S]*?\],\n\s*mistakes:/;
tsContent = tsContent.replace(contentRegex, `content: ${formattedContent},\n  mistakes:`);

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('Updated introQa1.ts!');
