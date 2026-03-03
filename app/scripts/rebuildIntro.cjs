const fs = require('fs');

const mdPath = 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\public\\Статья 1.md';
const tsPath = 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\intro-qa\\introQa1.ts';

let mdContent = fs.readFileSync(mdPath, 'utf8');

// Replace image tags with correct path
mdContent = mdContent.replace(/!\[слайд (\d+)\]/g, '![слайд $1](/extracted/Слайд$1.JPG)');

// Replace headings 
mdContent = mdContent.replace(/^1\. \*\*Введение в обеспечение качества\. В чем реальная разница между QA, QC и тестированием\?\*\*/gm, '## Введение в обеспечение качества. В чем реальная разница между QA, QC и тестированием');
mdContent = mdContent.replace(/^\*\*Что такое тестирование ПО на самом деле\?\*\*/gm, '## Что такое тестирование ПО на самом деле');
mdContent = mdContent.replace(/^\*\*7 фундаментальных принципов тестирования\*\*/gm, '## 7 фундаментальных принципов тестирования');
mdContent = mdContent.replace(/^\*\*Иерархия качества: QA vs QC vs Testing\*\*/gm, '## Иерархия качества: QA vs QC vs Testing');
mdContent = mdContent.replace(/^\*\*Атрибуты качества ПО\*\*/gm, '## Атрибуты качества ПО');

// Convert list logic for Markdown to preserve spacing for 7 principles
const lines = mdContent.split('\n');
const processedLines = [];
let inNumberedList = false;
let currentListNumber = 1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if it's one of the 7 principles (starts with "1. ")
    const principleMatch = line.match(/^1\. (Тестирование демонстрирует наличие дефектов|Исчерпывающее тестирование невозможно|Раннее тестирование экономит деньги|Скопление дефектов \(Принцип Парето\)|Парадокс пестицида|Тестирование зависит от контекста|Заблуждение об отсутствии ошибок)$/);

    if (principleMatch) {
        processedLines.push(`${currentListNumber}. **${principleMatch[1]}**`);
        currentListNumber++;
        inNumberedList = true;
    } else if (inNumberedList && line.trim() !== '' && !line.startsWith('##') && !line.startsWith('![') && !line.startsWith('**') && currentListNumber <= 8) {
        // Indent paragraphs under principles so they belong to the list item
        processedLines.push(`    ${line}`);
    } else {
        if (line.startsWith('##') || line.startsWith('**Иерархия')) {
            inNumberedList = false;
        }
        processedLines.push(line);
    }
}

const finalMdContent = processedLines.join('\n');

const blocks = finalMdContent.split(/\n\n+/).map(block => block.trim()).filter(Boolean);
const jsonContent = JSON.stringify(blocks, null, 4);
const formattedContent = jsonContent.split('\n').map(line => '    ' + line).join('\n').trim();

let tsContent = fs.readFileSync(tsPath, 'utf8');
const contentRegex = /content:\s*\[[\s\S]*?\],\n\s*mistakes:/;
tsContent = tsContent.replace(contentRegex, `content: ${formattedContent},\n  mistakes:`);

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('Rebuilt introQa1.ts completely!');
