import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');

const pdfFunc = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;

async function extractTextFromPdf(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    try {
        if (typeof pdfFunc !== 'function') {
            throw new Error('Could not find PDF parsing function in the module');
        }
        const data = await pdfFunc(dataBuffer);
        const fileName = path.parse(pdfPath).name;
        // Save text file in the same directory as PDF
        const outputPath = path.join(path.dirname(pdfPath), `${fileName}_extracted.txt`);
        fs.writeFileSync(outputPath, data.text);
        console.log(`\n✅ Готово! Текст извлечен в файл: ${outputPath}`);
    } catch (error) {
        console.error(`\n❌ Ошибка при чтении PDF:`, error);
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Использование: node scripts/extract-pdf.js <путь_к_вашему_файлу.pdf>');
    process.exit(1);
}

const pdfFile = path.resolve(args[0]);
if (!fs.existsSync(pdfFile)) {
    console.error(`\n❌ Файл не найден: ${pdfFile}`);
    process.exit(1);
}

console.log(`\n⏳ Начинаю чтение файла: ${path.basename(pdfFile)}...`);
extractTextFromPdf(pdfFile);
