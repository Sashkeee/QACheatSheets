const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

if (!fs.existsSync(filePath)) {
    console.error('File not found: ' + filePath);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Regex for content arrays
const roadmapDataRegex = /content:\s*\[([\s\S]*?)\]/g;

content = content.replace(roadmapDataRegex, (match, p1) => {
    // Correct split: we need to handle entries inside quotes that might contain commas
    // but the array structure is basically ["line", "line"]
    // A simpler way: split by '",' and look for a newline
    const lines = p1.split(/",\s*\n\s*"/);
    const newLines = lines.map((line, idx) => {
        let text = line.replace(/^\s*"/, '').replace(/"\s*$/, '');

        // 1. Convert uppercase headings
        // Matches "1. HEADING" or just "HEADING" (Russian and English)
        if (/^[0-9]+\.\s+[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text)) {
            text = `## ${text}`;
        } else if (/^[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text) && text.length > 5 && !text.includes('![')) {
            text = `## ${text}`;
        }

        // 2. Remove alt text from image tags
        text = text.replace(/!\[.*?\]\((\/extracted\/.*?)\)/g, '![]($1)');

        return `"${text}"`;
    });

    return `content: [\n                    ${newLines.join(',\n                    ')}\n                ]`;
});

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts formatted successfully.');
