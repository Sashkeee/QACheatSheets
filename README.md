# QA CheatSheet — Интерактивный справочник для QA-инженеров

Образовательный сайт-шпаргалка для начинающих и практикующих QA-специалистов. Содержит структурированные статьи с Markdown-контентом, квизы для самопроверки, глоссарии терминов и пошаговый roadmap по тестированию.

**Целевая аудитория:** русскоязычные специалисты (РФ, СНГ).

**Сайт:** [qa.orangebrew.ru](https://qa.orangebrew.ru)

---

## Возможности

- **Roadmap** — 8 тематических разделов: от введения в QA до карьеры
- **Статьи** — Markdown-контент с подсветкой кода, фильтрацией по категориям
- **Квизы** — интерактивные тесты для самопроверки в конце статей
- **Глоссарий** — словарь терминов к каждой статье
- **Типичные ошибки** — разбор частых ошибок новичков
- **AI-чатбот** — плавающий чат-помощник (OpenRouter API)
- **Комментарии** — обсуждение под статьями
- **Тёмная/светлая тема** — переключение с сохранением в localStorage
- **PWA** — установка как приложение, офлайн-кеш
- **SEO** — Open Graph для VK/Telegram, Yandex-специфика, региональные теги

---

## Разделы Roadmap

| Раздел | Описание |
|--------|---------|
| **Введение в QA** | Основы профессии, первые шаги |
| **Основы тестирования** | Теория, виды тестирования, тест-дизайн |
| **API тестирование** | REST, HTTP-методы, Postman, автоматизация API |
| **Автоматизация** | Selenium, Cypress, Page Object Model, фреймворки |
| **Безопасность** | OWASP Top 10, SQL Injection, XSS, IDOR |
| **Инфраструктура** | CI/CD, Docker, Git, Linux для тестировщиков |
| **Базы данных** | SQL (SELECT, JOIN, подзапросы), NoSQL |
| **Карьера** | Резюме, собеседования, профессиональный рост |

---

## Технологический стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | React 19, TypeScript (strict), Vite 7 |
| **UI** | Tailwind CSS 4, Shadcn/Radix UI, Lucide icons |
| **Дизайн** | Glassmorphism (`.glass`, `.volumetric`, `.mesh-bg`) |
| **Контент** | Markdown → `react-markdown` + `prism-react-renderer` |
| **CMS / БД** | PocketBase (self-hosted) |
| **State** | Zustand (тема) |
| **SEO** | `react-helmet-async` |
| **PWA** | `vite-plugin-pwa` |
| **Деплой** | Docker + Nginx → GitHub Actions CI/CD → VPS + Caddy |

---

## Быстрый старт

### Требования

- Node.js >= 20
- PocketBase (для работы с контентом)

### Установка и запуск

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Sashkeee/QACheatSheets.git
cd QACheatSheets

# 2. Установить зависимости
cd app
npm install --legacy-peer-deps

# 3. Настроить переменные окружения
cp .env.example .env
# Отредактировать .env — указать VITE_PB_URL
```

```bash
# 4. Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

### Переменные окружения

| Переменная | Файл | Описание |
|-----------|------|---------|
| `VITE_PB_URL` | `app/.env` | URL PocketBase. Dev: `http://localhost:8090` |
| `VITE_OPENROUTER_API_KEY` | `app/.env` | API-ключ [OpenRouter](https://openrouter.ai) для AI-чатбота (опционально) |

Скрипты в `scripts/` читают credentials из `scripts/.env` (gitignored):
- `PB_URL` — URL PocketBase
- `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` — admin-доступ к PocketBase

---

## Структура проекта

```
QA CheatSheet/
├── app/                        # React-приложение
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/           # AI-чатбот (OpenRouter)
│   │   │   ├── comments/       # Комментарии к статьям
│   │   │   ├── layout/         # Layout (сайдбар + топбар)
│   │   │   ├── seo/            # SEO-компонент
│   │   │   ├── share/          # Кнопки «Поделиться»
│   │   │   ├── ui/             # Shadcn UI (автогенерация, не редактировать)
│   │   │   └── QuizBlock.tsx   # Компонент квиза
│   │   ├── data/
│   │   │   └── roadmapData.ts  # Конфигурация 8 разделов roadmap
│   │   ├── hooks/              # React-хуки (обёртки над api.ts)
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Главная страница
│   │   │   ├── ArticlesPage.tsx    # Список статей с фильтрами
│   │   │   ├── ArticleDetailPage.tsx # Страница статьи
│   │   │   └── RoadmapPage.tsx     # Раздел roadmap
│   │   ├── services/
│   │   │   └── api.ts          # Единственная точка запросов к PocketBase
│   │   ├── stores/
│   │   │   └── theme.ts        # Zustand store (тема)
│   │   └── styles/
│   │       ├── globals.css     # CSS-переменные, glassmorphism
│   │       └── article.css     # Типографика статей
│   ├── Dockerfile
│   └── docker-compose.yml
├── scripts/                    # Утилиты для контент-менеджмента
│   ├── pull.mjs                # Скачать статьи из PocketBase → content/
│   ├── sync.mjs                # Синхронизировать content/ → PocketBase
│   ├── publish.mjs             # Опубликовать один .md файл
│   ├── delete.mjs              # Удалить статью по slug
│   └── new-article.mjs         # Создать новый .md с frontmatter
├── content/                    # Markdown-статьи (Obsidian vault)
├── SCHEMA.md                   # Схема PocketBase коллекций
├── DEPLOY.md                   # Инструкция по деплою
└── CLAUDE.md                   # Инструкции для AI-ассистента
```

---

## Архитектура

### PocketBase как единственный источник контента

Весь контент (статьи, квизы, глоссарии) хранится в PocketBase. Hardcoded контента в TypeScript нет. Все запросы к PocketBase идут через единственный файл `app/src/services/api.ts`.

### Категории статей

| Категория | Описание |
|----------|---------|
| `intro` | Введение в QA |
| `basics` | Основы и теория |
| `tech` | Технологии (API, автоматизация) |
| `security` | Безопасность |
| `infrastructure` | Инфраструктура |
| `databases` | Базы данных |
| `career` | Карьера |
| `mini` | Мини-статьи (карточки на главной) |

### Роутинг

| Путь | Страница |
|------|---------|
| `/` | Главная с мини-статьями |
| `/roadmap/:id` | Список статей раздела |
| `/articles` | Все статьи с фильтром по категории |
| `/articles/:slug` | Страница статьи |

---

## Workflow написания статей

Статьи пишутся в [Obsidian](https://obsidian.md) (папка `content/` как vault) и синхронизируются с PocketBase через скрипты.

| Команда | Описание |
|---------|---------|
| `node scripts/pull.mjs` | Скачать все статьи с сервера в `content/` |
| `node scripts/sync.mjs` | Синхронизировать `content/` → PocketBase |
| `node scripts/publish.mjs content/tech/article.md` | Опубликовать одну статью |
| `node scripts/delete.mjs <slug>` | Удалить статью с сервера |
| `node scripts/new-article.mjs` | Создать новый .md с frontmatter |

### Frontmatter статьи

```yaml
---
slug: "nazvaniye-stati"
title: "Название статьи"
description: "Краткое описание для карточки и SEO"
category: "tech"
sort_order: 1
---
```

Квизы, глоссарий и типичные ошибки добавляются в конце файла как JSON-блоки:

````markdown
```json quiz
[{"question": "Вопрос?", "options": ["A", "B", "C"], "correctAnswer": 0}]
```

```json glossary
[{"term": "Регрессия", "definition": "Повторное тестирование после изменений"}]
```

```json mistakes
["Не проверять граничные значения", "Игнорировать негативные сценарии"]
```
````

---

## Сборка и деплой

### Локальная сборка

```bash
cd app
npm run build       # TypeScript проверка + Vite сборка
npm run preview     # Просмотр собранного приложения
```

### Docker

```bash
cd app
docker compose up -d --build
```

Контейнер поднимает Nginx на порту **8082**.

### CI/CD (GitHub Actions)

При пуше в `main` автоматически:
1. Собирается Docker-образ
2. Пушится в GitHub Container Registry
3. Деплоится на VPS по SSH

Необходимые **GitHub Secrets**: `VPS_IP`, `VPS_USERNAME`, `VPS_SSH_KEY`.

Подробнее: [DEPLOY.md](DEPLOY.md).

---

## Скрипты npm

| Команда | Описание |
|---------|---------|
| `npm run dev` | Dev-сервер (Vite, порт 5173) |
| `npm run build` | Сборка для продакшна |
| `npm run preview` | Просмотр собранного приложения |
| `npm run lint` | ESLint проверка |
| `npm run test` | Запуск тестов (Vitest) |

---

## Источники

Контент справочника базируется на классической литературе и современных практиках:

- *Роман Савин* — «Тестирование DOT COM»
- *Копланд* — «Практическое руководство по тест-дизайну»
- *Святослав Куликов* — «Тестирование программного обеспечения. Базовый курс»
- *Алан Бьюли* — «Изучаем SQL»

---

## Лицензия

MIT License. Вы можете использовать этот проект в учебных или коммерческих целях.
