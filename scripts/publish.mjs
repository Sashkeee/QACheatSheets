#!/usr/bin/env node
/**
 * Публикует .md файл из content/ в PocketBase.
 * Создаёт новую статью или обновляет существующую (по slug).
 *
 * Использование:
 *   node scripts/publish.mjs content/tech/api-testing.md
 *
 * Поддерживает:
 *   - Frontmatter: slug, title, description, category, sort_order
 *   - Контент: тело .md файла
 *   - Quiz/Glossary/Mistakes: ```json quiz ... ``` блоки в конце файла
 *   - Cover image: если cover_image в frontmatter — локальный путь к файлу
 *
 * Формат файла:
 *   ---
 *   slug: "api-testing-basics"
 *   title: "Основы API-тестирования"
 *   description: "Краткое описание"
 *   category: "tech"
 *   sort_order: 1
 *   cover_image: "./images/cover.jpg"   ← необязательно
 *   ---
 *
 *   Текст статьи...
 *
 *   ```json quiz
 *   [{"question": "...", "options": [...], "correctAnswer": 0}]
 *   ```
 */

import { readFileSync, existsSync, readFileSync as readFile } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Env ──────────────────────────────────────────────────────────────────────

const envFile = resolve(__dirname, '.env');
const env = {};
if (existsSync(envFile)) {
    readFileSync(envFile, 'utf-8').split('\n').forEach(line => {
        const [k, ...v] = line.split('=');
        if (k && v.length) env[k.trim()] = v.join('=').trim();
    });
}

const PB_URL = env.PB_URL ?? 'http://localhost:8090';
const ADMIN_EMAIL = env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = env.PB_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Нужны credentials в scripts/.env:\n  PB_ADMIN_EMAIL=...\n  PB_ADMIN_PASSWORD=...');
    process.exit(1);
}

// ─── Аргументы ────────────────────────────────────────────────────────────────

const filePath = process.argv[2];
if (!filePath) {
    console.error('Usage: node scripts/publish.mjs <путь/к/статье.md>');
    console.error('Пример: node scripts/publish.mjs content/tech/api-testing.md');
    process.exit(1);
}

const absPath = resolve(process.cwd(), filePath);
if (!existsSync(absPath)) {
    console.error(`Файл не найден: ${absPath}`);
    process.exit(1);
}

const fileDir = dirname(absPath);

// ─── Парсинг ──────────────────────────────────────────────────────────────────

/** Парсит frontmatter и тело файла */
function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) {
        throw new Error(
            'Frontmatter не найден. Файл должен начинаться с:\n---\nslug: "..."\ntitle: "..."\n---'
        );
    }

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) return;
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        // Убираем кавычки
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        if (key) frontmatter[key] = value;
    });

    return { frontmatter, body: match[2] };
}

/** Извлекает ```json quiz/glossary/mistakes``` блоки, возвращает чистое тело */
function extractJsonBlocks(body) {
    const blocks = {};
    const cleanBody = body.replace(
        /\n?```json (quiz|glossary|mistakes)\n([\s\S]*?)\n```/g,
        (_, name, json) => {
            try {
                blocks[name] = JSON.parse(json.trim());
            } catch {
                console.warn(`   ⚠ Невалидный JSON в блоке "${name}" — пропускаем`);
            }
            return '';
        }
    ).trim();
    return { blocks, cleanBody };
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
    const res = await fetch(`${PB_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
    return data;
}

function getMimeType(filename) {
    const ext = extname(filename).toLowerCase();
    const types = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
    return types[ext] || 'application/octet-stream';
}

// ─── Основная логика ──────────────────────────────────────────────────────────

async function main() {
    console.log(`\n📄 Публикую: ${filePath}`);
    console.log(`🔗 PocketBase: ${PB_URL}\n`);

    // Читаем и парсим файл
    const fileText = readFileSync(absPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(fileText);
    const { blocks, cleanBody } = extractJsonBlocks(body);

    const { slug, title, description, category, sort_order, cover_image } = frontmatter;

    // Валидация обязательных полей
    if (!slug) throw new Error('Frontmatter: обязательное поле "slug" отсутствует');
    if (!title) throw new Error('Frontmatter: обязательное поле "title" отсутствует');
    if (!category) throw new Error('Frontmatter: обязательное поле "category" отсутствует');

    console.log(`   slug:     ${slug}`);
    console.log(`   title:    ${title}`);
    console.log(`   category: ${category}`);
    if (sort_order) console.log(`   sort_order: ${sort_order}`);
    if (cover_image) console.log(`   cover_image: ${cover_image}`);
    if (blocks.quiz) console.log(`   quiz: ${blocks.quiz.length} вопросов`);
    if (blocks.glossary) console.log(`   glossary: ${blocks.glossary.length} терминов`);
    if (blocks.mistakes) console.log(`   mistakes: ${blocks.mistakes.length} пунктов`);
    console.log();

    // Авторизация
    console.log('1️⃣  Авторизация...');
    const auth = await request('/api/admins/auth-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const token = auth.token;
    const authHeaders = { 'Authorization': token };
    console.log('   ✓ Авторизован\n');

    // Проверяем, существует ли статья по slug
    console.log('2️⃣  Ищем статью по slug...');
    let existingId = null;
    const search = await request(
        `/api/collections/articles/records?filter=(slug='${slug}')&perPage=1`,
        { headers: authHeaders }
    );
    if (search.items && search.items.length > 0) {
        existingId = search.items[0].id;
        console.log(`   ✓ Найдена (id: ${existingId}) → обновляем\n`);
    } else {
        console.log('   ✓ Новая статья → создаём\n');
    }

    // Формируем payload
    const payload = {
        slug,
        title,
        description: description || '',
        category,
        content: cleanBody,
    };
    if (sort_order) payload.sort_order = Number(sort_order);
    if (blocks.quiz) payload.quiz = blocks.quiz;
    if (blocks.glossary) payload.glossary = blocks.glossary;
    if (blocks.mistakes) payload.mistakes = blocks.mistakes;

    // Создаём или обновляем статью (текстовые поля)
    console.log('3️⃣  Публикуем текст...');
    let recordId = existingId;
    if (existingId) {
        await request(`/api/collections/articles/records/${existingId}`, {
            method: 'PATCH',
            headers: { ...authHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        console.log('   ✓ Текст обновлён\n');
    } else {
        const created = await request('/api/collections/articles/records', {
            method: 'POST',
            headers: { ...authHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        recordId = created.id;
        console.log(`   ✓ Статья создана (id: ${recordId})\n`);
    }

    // Обложка — загружаем если указан локальный путь
    if (cover_image && !cover_image.startsWith('http')) {
        const imgPath = resolve(fileDir, cover_image);
        if (existsSync(imgPath)) {
            console.log('4️⃣  Загружаем обложку...');
            const imgBytes = readFile(imgPath);
            const blob = new Blob([imgBytes], { type: getMimeType(imgPath) });
            const form = new FormData();
            form.append('cover_image', blob, basename(imgPath));
            await request(`/api/collections/articles/records/${recordId}`, {
                method: 'PATCH',
                headers: authHeaders,  // без Content-Type — FormData сам ставит
                body: form,
            });
            console.log(`   ✓ Обложка загружена: ${basename(imgPath)}\n`);
        } else {
            console.warn(`   ⚠ Файл обложки не найден: ${imgPath}`);
        }
    }

    console.log(`✅ Готово! Статья опубликована.`);
    console.log(`🌐 https://qacheatsheet.ru/articles/${slug}\n`);
}

main().catch(err => {
    console.error('\n❌ Ошибка:', err.message);
    process.exit(1);
});
