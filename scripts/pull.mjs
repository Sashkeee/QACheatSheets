#!/usr/bin/env node
/**
 * Скачивает все статьи из PocketBase → создаёт .md файлы в папке content/
 *
 * Использование:
 *   node scripts/pull.mjs
 *
 * Читает credentials из scripts/.env (PB_URL, PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
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

const PB_URL = process.argv[2] ?? env.PB_URL ?? 'http://localhost:8090';
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

/** Сериализует объект в YAML frontmatter */
function toFrontmatter(fields) {
    const lines = ['---'];
    for (const [k, v] of Object.entries(fields)) {
        if (v === null || v === undefined || v === '') continue;
        if (typeof v === 'number') {
            lines.push(`${k}: ${v}`);
        } else {
            const escaped = String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            lines.push(`${k}: "${escaped}"`);
        }
    }
    lines.push('---');
    return lines.join('\n');
}

/** Строит .md содержимое статьи */
function buildMarkdown(article) {
    const fm = {
        slug: article.slug,
        title: article.title,
        description: article.description,
        category: article.category,
    };
    if (article.sort_order != null) fm.sort_order = article.sort_order;
    if (article.cover_image) {
        fm.cover_image_url = `${PB_URL}/api/files/${article.collectionId}/${article.id}/${article.cover_image}`;
    }

    let md = toFrontmatter(fm) + '\n\n' + (article.content || '').trimEnd();

    // Добавляем quiz/glossary/mistakes как JSON-блоки (скрыты от рендера Obsidian как code)
    if (Array.isArray(article.quiz) && article.quiz.length > 0) {
        md += '\n\n```json quiz\n' + JSON.stringify(article.quiz, null, 2) + '\n```';
    }
    if (Array.isArray(article.glossary) && article.glossary.length > 0) {
        md += '\n\n```json glossary\n' + JSON.stringify(article.glossary, null, 2) + '\n```';
    }
    if (Array.isArray(article.mistakes) && article.mistakes.length > 0) {
        md += '\n\n```json mistakes\n' + JSON.stringify(article.mistakes, null, 2) + '\n```';
    }

    return md + '\n';
}

// ─── Основная логика ──────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🔗 PocketBase: ${PB_URL}`);
    console.log(`📁 Контент → ${CONTENT_DIR}\n`);

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

    // Загружаем все статьи
    console.log('2️⃣  Загружаем статьи из PocketBase...');
    let allArticles = [];
    let page = 1;
    while (true) {
        const data = await request(
            `/api/collections/articles/records?sort=category,sort_order,-created&perPage=100&page=${page}`,
            { headers: authHeaders }
        );
        allArticles = allArticles.concat(data.items);
        if (data.items.length < 100) break;
        page++;
    }
    console.log(`   ✓ Найдено статей: ${allArticles.length}\n`);

    // Создаём файлы
    mkdirSync(CONTENT_DIR, { recursive: true });
    console.log('3️⃣  Создаём файлы...');

    const categories = new Set();
    for (const article of allArticles) {
        const cat = article.category || 'uncategorized';
        categories.add(cat);

        const dir = resolve(CONTENT_DIR, cat);
        mkdirSync(dir, { recursive: true });

        const filePath = resolve(dir, `${article.slug}.md`);
        writeFileSync(filePath, buildMarkdown(article), 'utf-8');
        console.log(`   ✓ ${cat}/${article.slug}.md`);
    }

    console.log(`\n✅ Готово! ${allArticles.length} статей в ${allArticles.length > 0 ? [...categories].join(', ') : 'content/'}`);
    console.log('\n👉 Открой Obsidian → "Open folder as vault" → выбери папку:');
    console.log(`   ${CONTENT_DIR}\n`);
}

main().catch(err => {
    console.error('\n❌ Ошибка:', err.message);
    process.exit(1);
});
