#!/usr/bin/env node
/**
 * Синхронизирует все .md файлы из content/ в PocketBase.
 * Категория берётся из имени папки (если в frontmatter нет поля category).
 *
 * Использование:
 *   node scripts/sync.mjs
 *
 * Что делает:
 *   - Сканирует content/**\/*.md
 *   - Для каждого файла: создаёт статью или обновляет существующую (по slug)
 *   - Категория = имя папки (intro/basics/tech/career/...) если не задана в frontmatter
 *   - Удалением не занимается — для этого есть delete.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, basename, relative, sep } from 'path';
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
const CONTENT_DIR = resolve(__dirname, '../content');

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Нужны credentials в scripts/.env:\n  PB_ADMIN_EMAIL=...\n  PB_ADMIN_PASSWORD=...');
    process.exit(1);
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
    const res = await fetch(`${PB_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
    return data;
}

/** Рекурсивно собирает все .md файлы из папки */
function collectMdFiles(dir) {
    const results = [];
    if (!existsSync(dir)) return results;
    for (const entry of readdirSync(dir)) {
        const fullPath = resolve(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            results.push(...collectMdFiles(fullPath));
        } else if (entry.endsWith('.md')) {
            results.push(fullPath);
        }
    }
    return results;
}

/** Парсит frontmatter и тело файла */
function parseFrontmatter(text) {
    const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return null;

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx < 0) return;
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        if (key) frontmatter[key] = value;
    });

    return { frontmatter, body: match[2] };
}

/** Извлекает ```json quiz/glossary/mistakes``` блоки */
function extractJsonBlocks(body) {
    const blocks = {};
    const cleanBody = body.replace(
        /\n?```json (quiz|glossary|mistakes)\n([\s\S]*?)\n```/g,
        (_, name, json) => {
            try { blocks[name] = JSON.parse(json.trim()); } catch { /* пропускаем */ }
            return '';
        }
    ).trim();
    return { blocks, cleanBody };
}

/** Определяет категорию из пути файла (имя папки внутри content/) */
function categoryFromPath(filePath) {
    const rel = relative(CONTENT_DIR, filePath);  // например: "tech/api-testing.md"
    const parts = rel.split(sep);
    return parts.length > 1 ? parts[0] : 'uncategorized';
}

// ─── Основная логика ──────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🔗 PocketBase: ${PB_URL}`);
    console.log(`📁 Контент: ${CONTENT_DIR}\n`);

    if (!existsSync(CONTENT_DIR)) {
        console.error('Папка content/ не найдена. Сначала запусти: node scripts/pull.mjs');
        process.exit(1);
    }

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

    // Загружаем текущие slugs из PocketBase для быстрого поиска
    console.log('2️⃣  Загружаем индекс из PocketBase...');
    const pbIndex = {};
    let page = 1;
    while (true) {
        const data = await request(
            `/api/collections/articles/records?fields=id,slug,category&perPage=200&page=${page}`,
            { headers: authHeaders }
        );
        for (const item of data.items) pbIndex[item.slug] = item;
        if (data.items.length < 200) break;
        page++;
    }
    console.log(`   ✓ В PocketBase: ${Object.keys(pbIndex).length} статей\n`);

    // Сканируем локальные файлы
    const files = collectMdFiles(CONTENT_DIR);
    console.log(`3️⃣  Найдено локально: ${files.length} файлов\n`);

    const stats = { created: 0, updated: 0, skipped: 0, errors: 0 };

    for (const filePath of files) {
        const relPath = relative(CONTENT_DIR, filePath);
        const text = readFileSync(filePath, 'utf-8');
        const parsed = parseFrontmatter(text);

        if (!parsed) {
            console.log(`   ⚠ Нет frontmatter: ${relPath}`);
            stats.skipped++;
            continue;
        }

        const { frontmatter, body } = parsed;
        const { blocks, cleanBody } = extractJsonBlocks(body);

        const slug = frontmatter.slug;
        if (!slug) {
            console.log(`   ⚠ Нет slug: ${relPath}`);
            stats.skipped++;
            continue;
        }

        // Категория: из frontmatter или из имени папки
        const category = frontmatter.category || categoryFromPath(filePath);

        const payload = {
            slug,
            title: frontmatter.title || basename(filePath, '.md'),
            description: frontmatter.description || '',
            category,
            content: cleanBody,
        };
        if (frontmatter.sort_order) payload.sort_order = Number(frontmatter.sort_order);
        if (blocks.quiz) payload.quiz = blocks.quiz;
        if (blocks.glossary) payload.glossary = blocks.glossary;
        if (blocks.mistakes) payload.mistakes = blocks.mistakes;

        const existing = pbIndex[slug];

        try {
            if (existing) {
                // Обновляем
                await request(`/api/collections/articles/records/${existing.id}`, {
                    method: 'PATCH',
                    headers: { ...authHeaders, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const categoryChanged = existing.category !== category;
                const marker = categoryChanged ? ` (категория: ${existing.category} → ${category})` : '';
                console.log(`   ✏  ${relPath}${marker}`);
                stats.updated++;
            } else {
                // Создаём
                await request('/api/collections/articles/records', {
                    method: 'POST',
                    headers: { ...authHeaders, 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                console.log(`   ✨ ${relPath} (новая)`);
                stats.created++;
            }
        } catch (err) {
            console.error(`   ✗ ${relPath}: ${err.message}`);
            stats.errors++;
        }
    }

    console.log('\n─────────────────────────────────');
    console.log(`✅ Готово!`);
    console.log(`   Создано:   ${stats.created}`);
    console.log(`   Обновлено: ${stats.updated}`);
    console.log(`   Пропущено: ${stats.skipped}`);
    if (stats.errors > 0) console.log(`   Ошибки:    ${stats.errors}`);
    console.log('─────────────────────────────────\n');

    if (files.length > 0) {
        console.log('💡 Чтобы удалить статью с сайта:');
        console.log('   node scripts/delete.mjs <slug>\n');
    }
}

main().catch(err => {
    console.error('\n❌ Ошибка:', err.message);
    process.exit(1);
});
