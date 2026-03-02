import fs from 'fs';
import path from 'path';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas, Image } from 'canvas';

// Настройка путей для Windows
const workerPath = path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
pdfjs.GlobalWorkerOptions.workerSrc = `file://${workerPath.split(path.sep).join('/')}`;

class NodeCanvasFactory {
    create(width, height) {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        return {
            canvas,
            context,
        };
    }

    reset(canvasAndContext, width, height) {
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    }

    destroy(canvasAndContext) {
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    }
}

async function extractPagesAsImages(pdfPath) {
    const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
    const outputDir = path.join(process.cwd(), 'public', 'extracted');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        const fontPath = path.resolve('node_modules/pdfjs-dist/standard_fonts');
        const loadingTask = pdfjs.getDocument({
            data: dataBuffer,
            standardFontDataUrl: `file://${fontPath.split(path.sep).join('/')}/`,
            nativeImageDecoderSupport: 'none',
        });

        const pdf = await loadingTask.promise;
        console.log(`\n⏳ В файле ${pdf.numPages} страниц. Начинаю экспорт страниц в PNG...`);

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2.0 });

            const canvasFactory = new NodeCanvasFactory();
            const { canvas, context } = canvasFactory.create(viewport.width, viewport.height);

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
                canvasFactory: canvasFactory,
            };

            await page.render(renderContext).promise;

            const buffer = canvas.toBuffer('image/png');
            const fileName = `foundation_slide_${i.toString().padStart(2, '0')}.png`;
            const filePath = path.join(outputDir, fileName);

            fs.writeFileSync(filePath, buffer);
            console.log(`📸 Сохранена страница ${i}: ${fileName}`);

            // Очистка
            page.cleanup();
        }

        console.log(`\n✅ Готово! Все страницы сохранены в: public/extracted`);
    } catch (error) {
        console.error(`\n❌ Ошибка при обработке PDF:`, error);
    }
}

const args = process.argv.slice(2);
const pdfFile = args[0] || 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\Software_Quality_Foundations.pdf';
extractPagesAsImages(pdfFile);
