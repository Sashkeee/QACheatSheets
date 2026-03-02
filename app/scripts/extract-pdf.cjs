const fs = require('fs');
const path = require('path');
const pdfModule = require('pdf-parse');

// LOG DEBUG INFO
console.log('--- DEBUG INFO ---');
console.log('Type of pdfModule:', typeof pdfModule);
console.log('Module keys:', Object.keys(pdfModule));
if (typeof pdfModule !== 'function' && pdfModule.default) {
    console.log('Found .default, type:', typeof pdfModule.default);
}
console.log('------------------');

const pdfFunc = typeof pdfModule === 'function' ? pdfModule : pdfModule.default;

async function extractTextFromPdf(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    try {
        if (typeof pdfFunc !== 'function') {
            throw new Error('Критическая ошибка: Функция парсинга не найдена в модуле. Попробуйте переустановить pdf-parse.');
        }
        const data = await pdfFunc(dataBuffer);
        const fileName = path.parse(pdfPath).name;
        const outputPath = path.join(path.dirname(pdfPath), `${fileName}_extracted.txt`);
        fs.writeFileSync(outputPath, data.text);
        console.log(`\n✅ Готово! Текст извлечен в файл: ${outputPath}`);
    } catch (error) {
        console.error(`\n❌ Ошибка при чтении PDF:`, error);
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Использование: node app/scripts/extract-pdf.cjs <путь_к_файлу.pdf>');
    process.exit(1);
}

const pdfFile = path.resolve(args[0]);
if (!fs.existsSync(pdfFile)) {
    console.error(`\n❌ Файл не найден: ${pdfFile}`);
    process.exit(1);
}

console.log(`\n⏳ Начинаю чтение файла: ${path.basename(pdfFile)}...`);
extractTextFromPdf(pdfFile);
