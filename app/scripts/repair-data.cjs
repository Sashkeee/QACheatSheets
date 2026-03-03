const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

// Fix the mangled image tags
// Pattern: "![" \n ](/path)"
content = content.replace(/"!\["\s*\n\s*\]\((.*?)\)"/g, '"![]($1)"');
// Also check for "![" content followed by "]"
content = content.replace(/"!\["\s*,\s*\n\s*"(.*?)\]\((.*?)\)"/g, '"![]($2)"');

// Remove redundant empty quotes or double quotes
content = content.replace(/""/g, '"');

// Ensure each section.content array element is a proper string on its own line
const sectionsMatch = /content:\s*\[([\s\S]*?)\]/g;
content = content.replace(sectionsMatch, (match, p1) => {
    // Collect all text, ignoring the broken structure
    // We basically want to find anything between quotes or anything that looks like an image/text
    const items = [];
    const regex = /"([\s\S]*?)"/g;
    let m;
    while ((m = regex.exec(p1)) !== null) {
        let text = m[1].trim();
        if (!text) continue;

        // Clean text from internal escaped quotes or artifacts
        text = text.replace(/\\"/g, '"');

        // Final check for image alts
        text = text.replace(/!\[.*?\]\((\/extracted\/.*?)\)/g, '![]($1)');

        // Header formatting
        if (/^[0-9]+\.\s+[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text)) {
            if (!text.startsWith('## ')) text = `## ${text}`;
        } else if (/^[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text) && text.length > 5 && !text.includes('![')) {
            if (!text.startsWith('## ')) text = `## ${text}`;
        }

        items.push(text);
    }

    return `content: [\n                    "${items.join('",\n                    "')}"\n                ]`;
});

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts fixed and formatted.');
