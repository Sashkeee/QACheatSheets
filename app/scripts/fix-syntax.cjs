const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

/**
 * The issue is that the content arrays are broken with "]" ending strings too early 
 * or loose text between array elements.
 * Example: "text" ] loose text, "next text"
 */

// Step 1: Find all sections and reconstruct their content arrays properly
const sectionRegex = /{[\s\S]*?title:[\s\S]*?content: \[([\s\S]*?)\][\s\S]*?}/g;

content = content.replace(sectionRegex, (sectionMatch, contentBody) => {
    // 1. Try to extract all meaningful text from the content body
    // We'll look for anything inside quotes OR anything that looks like it should have been in quotes
    // (text between commas or brackets that isn't structural)

    // First, let's normalize the body by removing the broken quotes logic
    // We'll replace the existing structure with a list of clean strings

    // Split by comma or closing bracket + comma
    const parts = contentBody.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

    const cleanLines = [];
    parts.forEach(part => {
        let text = part.trim();
        if (!text) return;

        // Remove leading/trailing quotes if they exist
        text = text.replace(/^"/, '').replace(/"$/, '');
        // Remove trailing bracket if it was part of a broken line like `... ] loose text`
        text = text.replace(/\]\s*$/, '');
        // Trim again
        text = text.trim();

        if (text) {
            // Apply standard formatting back to these recovered lines
            text = text.replace(/!\[.*?\]\((\/extracted\/.*?)\)/g, '![]($1)');

            if (/^[0-9]+\.\s+[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text)) {
                if (!text.startsWith('## ')) text = `## ${text}`;
            } else if (/^[A-ZА-ЯЁ\s\-\(\)\/\?\!\:\,]+$/.test(text) && text.length > 5 && !text.includes('![')) {
                if (!text.startsWith('## ')) text = `## ${text}`;
            }

            cleanLines.push(text);
        }
    });

    // Rebuild the content array part of the section
    const newContentArray = `content: [\n                    "${cleanLines.join('",\n                    "')}"\n                ]`;

    return sectionMatch.replace(/content: \[[\s\S]*?\]/, newContentArray);
});

// Step 2: Fix specific "Zolushka" broken line manually just in case
content = content.replace(/"• Пример 'Золушка' \(О. Назина\): Принц ищет девушку с 35 размером ноги. Классы: \[0-34"\n\s+\] \(не подходит\), \[35\] \(подходит!\), \[36-50\] \(не подходит\)\. Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса\.",/g,
    `"• Пример 'Золушка' (О. Назина): Принц ищет девушку с 35 размером ноги. Классы: [0-34] (не подходит), [35] (подходит!), [36-50] (не подходит). Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса.",`);

// Step 3: Remove double commas or weird quote remnants
content = content.replace(/",\s*,\s*"/g, '",\n                    "');
content = content.replace(/""/g, '"');

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts syntax repaired.');
