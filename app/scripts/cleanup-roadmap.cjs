const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix broken image strings across lines
content = content.replace(/!\["\s*\]\((.*?)\)"/g, '![]($1)"');
content = content.replace(/"!\["\s*\n\s*\]\((.*?)\)"/g, '"![]($1)"');

// 2. Fix the split content arrays that got mangled with loose quotes
// Specifically the start and end of content blocks
content = content.replace(/content: \[\n\s+""/g, 'content: [\n                    "');
content = content.replace(/""\n\s+\]/g, '"\n                ]');

// 3. Fix cases where multiple quotes appeared like ""Some text""
content = content.replace(/""(.*?)""/g, '"$1"');

// 4. Correct the overall structure if some lines were left without opening/closing quotes
// We search for each article's content and ensure all items are clean.
const roadmapDataRegex = /content: \[([\s\S]*?)\]/g;
content = content.replace(roadmapDataRegex, (match, p1) => {
    // Collect all lines, filter out empty ones, and clean them
    const lines = p1.split(',').map(l => l.trim()).filter(l => l.length > 0);
    const cleanedLines = lines.map(line => {
        let text = line;
        // Strip existing quotes
        if (text.startsWith('"')) text = text.slice(1);
        if (text.endsWith('"')) text = text.slice(0, -1);

        // Final polish for image tags
        text = text.replace(/!\[.*?\]\((\/extracted\/.*?)\)/g, '![]($1)');

        // Heading check
        if (/^[0-9]+\.\s+[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text)) {
            if (!text.startsWith('## ')) text = `## ${text}`;
        } else if (/^[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text) && text.length > 5 && !text.includes('![')) {
            if (!text.startsWith('## ')) text = `## ${text}`;
        }

        return `"${text}"`;
    });
    return `content: [\n                    ${cleanedLines.join(',\n                    ')}\n                ]`;
});

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts cleaned successfully.');
