#!/usr/bin/env node
/**
 * Удаляет статью из PocketBase по slug.
 * Требует подтверждения перед удалением.
 *
 * Использование:
 *   node scripts/delete.mjs <slug>
 *
 * Пример:
 *   node scripts/delete.mjs api-testing-basics
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

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

const slug = process.argv[2];
if (!slug) {
    console.error('Usage: node scripts/delete.mjs <slug>');
    console.error('Пример: node scripts/delete.mjs api-testing-basics');
    process.exit(1);
}

// ─── Утилиты ──────────────────────────────────────────────────────────────────

async function request(path, options = {}) {
    const res = await fetch(`${PB_URL}${path}`, options);
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`${res.status}: ${JSON.stringify(data)}`);
    return data;
}

function confirm(question) {
    return new Promise(resolve => {
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim().toLowerCase());
        });
    });
}

// ─── Основная логика ──────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🗑  Удаление статьи: "${slug}"`);
    console.log(`🔗 PocketBase: ${PB_URL}\n`);

    // Авторизация
    const auth = await request('/api/admins/auth-with-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const token = auth.token;
    const authHeaders = { 'Authorization': token };

    // Ищем статью
    const search = await request(
        `/api/collections/articles/records?filter=(slug='${slug}')&perPage=1`,
        { headers: authHeaders }
    );

    if (!search.items || search.items.length === 0) {
        console.error(`❌ Статья со slug "${slug}" не найдена в PocketBase.`);
        process.exit(1);
    }

    const article = search.items[0];
    console.log(`📄 Найдена:`);
    console.log(`   Заголовок:  ${article.title}`);
    console.log(`   Категория:  ${article.category}`);
    console.log(`   ID:         ${article.id}`);
    console.log();

    // Подтверждение
    const answer = await confirm(`⚠️  Удалить статью с сайта? Это необратимо. (да/нет): `);

    if (answer !== 'да' && answer !== 'y' && answer !== 'yes') {
        console.log('\n🚫 Отменено.\n');
        process.exit(0);
    }

    // Удаляем
    await request(`/api/collections/articles/records/${article.id}`, {
        method: 'DELETE',
        headers: authHeaders,
    });

    console.log(`\n✅ Статья "${article.title}" удалена с сайта.`);
    console.log(`💡 Локальный файл в content/ НЕ тронут — удали его сам если нужно.\n`);
}

main().catch(err => {
    console.error('\n❌ Ошибка:', err.message);
    process.exit(1);
});
