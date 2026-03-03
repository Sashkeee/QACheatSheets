const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/data/roadmapData.ts');
let content = fs.readFileSync(srcPath, 'utf8');

const regex = /sections:\s*\[\s*(\{[\s\S]*?\n\s{12}\}),\s*(\{[\s\S]*?\n\s{12}\}),\s*(\{[\s\S]*?\n\s{12}\}),\s*(\{[\s\S]*?\n\s{12}\}),\s*(\{[\s\S]*?\n\s{12}\})\s*\]/m;

const match = content.match(regex);
if (!match) {
    console.error("Could not match the sections array!");
    process.exit(1);
}

const dir = path.join(__dirname, '../src/data/intro-qa');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 5; i++) {
    const sectionData = match[i];
    const fileContent = `import { RoadmapSection } from '../roadmapData';\n\nexport const introQa${i}: RoadmapSection = ${sectionData};\n`;
    fs.writeFileSync(path.join(dir, `introQa${i}.ts`), fileContent);
    console.log(`Created introQa${i}.ts`);
}

// Replace the sections array in the original file
const replaceText = `sections: [\n            introQa1,\n            introQa2,\n            introQa3,\n            introQa4,\n            introQa5\n        ]`;
const importText = `import { introQa1 } from './intro-qa/introQa1';\nimport { introQa2 } from './intro-qa/introQa2';\nimport { introQa3 } from './intro-qa/introQa3';\nimport { introQa4 } from './intro-qa/introQa4';\nimport { introQa5 } from './intro-qa/introQa5';\n\nexport const roadmapData`;

content = content.replace(regex, replaceText);
content = content.replace('export const roadmapData', importText);

fs.writeFileSync(srcPath, content);
console.log("Updated roadmapData.ts");
