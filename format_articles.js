const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/src/data/roadmapData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove alt text from images
content = content.replace(/!\[.*?\]\(\/extracted\//g, '![](/extracted/');

// 2. We need to auto-format uppercase headings and bullet paths in sections 1 to 4 (since 0 is already formatted)
// But we must only do this inside the content arrays. 
// It's safer to just do global regex on the strings that look like unformatted headings:
// Match strings in quotes that are all uppercase Russian/English letters with some punctuation.
content = content.replace(/"([А-ЯЁA-Z \-\(\)\?]+)"/g, (match, p1) => {
    if (p1.length > 10 && !p1.includes('ISO') && !p1.includes('QA') && !p1.includes('QC')) { // Just a heuristic to avoid replacing short acronyms
        // Let's assume it's a heading if it's longer than 15 chars and uppercase
        return `"## ${p1}"`;
    }
    return match;
});

// Also replace "• Плюсы:..." with "- **Плюсы:**..."
content = content.replace(/"[•\-]\s+(Плюсы|Минусы):\s*(.*?)"/g, `"- **$1:** $2"`);
content = content.replace(/"[•\-]\s+(.*?)"/g, `"- $1"`);

// Let's also bolden the terms at the beginning of list items like:
// "- Итеративный подход (улучшение вглубь): Качество..." -> "- **Итеративный подход (улучшение вглубь):** Качество..."
content = content.replace(/("- \s*)(.*?[a-zа-яёA-ZА-ЯЁ]\)):(.*?)"/g, `$1**$2:**$3"`);

fs.writeFileSync(filePath, content);
console.log('roadmapData is formatted.');
