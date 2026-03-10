# CLAUDE.md — QA CheatSheet

Руководство для Claude. Читать перед любыми изменениями в проекте.

---

## ⚠️ ОБЯЗАТЕЛЬНЫЙ ПОРЯДОК РАБОТЫ

**Перед выполнением ЛЮБОЙ задачи в этом проекте — прочитать все три файла:**

1. `CLAUDE.md` — архитектура, правила, что нельзя делать
2. `SCHEMA.md` — структура PocketBase коллекций и поля
3. `~/.claude/projects/.../memory/MEMORY.md` — актуальное состояние проекта, ключевые файлы, долги

Только после этого приступать к задаче. Это гарантирует понимание контекста и исключает повторение уже решённых проблем.

---

## Что за проект

Образовательный сайт-шпаргалка для начинающих QA-инженеров.
Целевая аудитория — русскоязычные (РФ, СНГ).
Контент: статьи с Markdown, квизы, глоссарии.

**Запуск в dev:**
```bash
cd app
npm run dev        # http://localhost:5173
```

**Сборка:**
```bash
npm run build      # tsc + vite build
```

**Typecheck без сборки:**
```bash
npx tsc --noEmit
```

---

## Структура проекта

```
QA CheatSheet/
├── app/                    # React-приложение (весь фронтенд)
│   ├── src/
│   │   ├── components/     # UI-компоненты
│   │   │   ├── comments/   # CommentsSection
│   │   │   ├── layout/     # Layout (сайдбар + топбар)
│   │   │   ├── seo/        # SEO (мета-теги, OG)
│   │   │   ├── share/      # ShareButtons
│   │   │   ├── ui/         # Shadcn-компоненты (не трогать руками)
│   │   │   └── QuizBlock.tsx
│   │   ├── data/           # Конфигурация разделов (без hardcoded контента)
│   │   │   └── roadmapData.ts
│   │   ├── hooks/          # React-хуки (только тонкие обёртки над api.ts)
│   │   ├── pages/          # Страницы-роуты
│   │   ├── services/
│   │   │   └── api.ts      # ← ЕДИНСТВЕННЫЙ файл с fetch к PocketBase
│   │   ├── stores/
│   │   │   └── theme.ts    # Zustand store (только тема)
│   │   └── styles/
│   │       ├── globals.css # CSS-переменные, .glass, .mesh-bg, .volumetric
│   │       └── article.css # Типографика статей
├── scripts/                # Утилиты для работы с данными
│   ├── migrate-intro-qa.mjs # Миграция intro-qa статей в PocketBase
│   └── .env                # Credentials для скриптов (gitignored)
├── pocketbase/             # БД и файлы PocketBase
├── SCHEMA.md               # ← Схема всех PocketBase коллекций
├── CLAUDE.md               # ← Этот файл
└── DEPLOY.md               # Инструкция по деплою
```

---

## Архитектурные решения

### 1. Единственный источник PocketBase-запросов
**Решение:** весь fetch к PocketBase — только в `app/src/services/api.ts`.
Хуки (`useArticles`, `useComments` и др.) — тонкие обёртки, не делают fetch напрямую.

**Почему:** URL PocketBase берётся из `VITE_PB_URL`. Если хардкодить в хуках — при смене сервера нужно менять в N местах.

**Правило:** добавляя новый запрос к PocketBase — сначала функция в `api.ts`, потом хук.

---

### 2. Единственный источник контента — PocketBase
**Текущее состояние:** весь контент, включая раздел `intro-qa`, хранится в PocketBase.

**Как определяется источник** в `RoadmapPage`:
```ts
// roadmapData.ts
{
  sections: [],       // пустой → грузить из PocketBase (pbCategory обязателен)
  pbCategory: "intro",
  pbSort: "sort_order" // опциональный PocketBase sort string
}
```

Все 8 разделов используют `pbCategory` и загружают статьи из PocketBase.
`data/intro-qa/` удалён.

---

### 3. Zustand только для темы
**Решение:** Zustand используется только для `theme` (`stores/theme.ts`). Persist в localStorage.

**Почему:** остальное состояние — серверные данные, живут в хуках через useState+useEffect. Redux/Context избыточны для одного глобального значения.

**Правило:** новый глобальный стейт → сначала подумать, нельзя ли обойтись useState в компоненте. Только если действительно нужен в разных ветках дерева — добавлять в Zustand store.

---

### 4. Shadcn UI (не трогать напрямую)
**Решение:** `components/ui/` — сгенерированные Shadcn компоненты на базе Radix UI.

**Почему:** Radix даёт accessibility (ARIA, keyboard nav) бесплатно. Tailwind — стилизация.

**Правило:** файлы в `components/ui/` не редактировать вручную. Обновлять через `npx shadcn add`. Кастомизация — через CSS-переменные в `globals.css`.

---

### 5. Glassmorphism design system
**Решение:** дизайн строится на трёх CSS-утилитах из `globals.css`:

```css
.glass        /* backdrop-filter: blur(14px) + полупрозрачный фон */
.mesh-bg      /* mesh-gradient фон страницы */
.volumetric   /* объёмная карточка с тенями + transition */
```

CSS-переменные темы: `--background`, `--foreground`, `--primary` (#00D4AA), `--muted`.

**Правило:** при добавлении новых карточек/панелей использовать `.glass` + `.volumetric`, не писать backdrop-filter вручную.

---

### 6. Расширенный контент статей (quiz, glossary, mistakes)
**Решение:** коллекция `articles` имеет дополнительные JSON-поля:
- `quiz: QuizQuestion[]` — вопросы для самопроверки
- `glossary: GlossaryEntry[]` — словарь терминов
- `mistakes: string[]` — типичные ошибки новичков
- `sort_order: number` — порядок в категории (используется в `intro`)

**Рендеринг:** `ArticleDetailPage` рендерит эти блоки после основного контента, если поля не пустые. `QuizBlock.tsx` — переиспользуемый компонент квиза.

---

### 7. SEO под российский рынок
**Решение:** `components/seo/SEO.tsx` через `react-helmet-async`.

Включает: Open Graph для VK/Telegram, Yandex-специфику, региональные теги (RU, BY, UA, KZ), canonical URL.

**Правило:** каждая новая страница/статья → обернуть в `<SEO title="..." description="..." />`.

---

### 8. PWA
**Решение:** `vite-plugin-pwa` с `registerType: 'autoUpdate'`.
Манифест: name "QA CheatSheet", theme_color #00D4AA, иконки 192x192 и 512x512.

---

### 9. Deploy
Docker образ → GitHub Container Registry → SSH на VPS → Caddy reverse proxy.
CI/CD: GitHub Actions на каждый push в `main`.
Секреты: `VPS_IP`, `VPS_USERNAME`, `VPS_SSH_KEY` в GitHub Secrets.
Подробности: `DEPLOY.md`.

---

## Роутинг

```
/                          → Home
/roadmap/:id               → RoadmapPage (список статей из PocketBase)
/roadmap/:id/:sectionIdx   → RoadmapPage (детальная статья — только для hardcoded секций)
/articles                  → ArticlesPage (список с фильтром по категории)
/articles/:slug            → ArticleDetailPage
```

Все роуты вложены в `<Layout>` (сайдбар + топбар).

---

## Паттерны кода

### Добавить новый запрос к PocketBase
1. Добавить интерфейс в `api.ts` (если нужен новый тип)
2. Написать async-функцию в `api.ts`
3. Создать хук в `hooks/` — только useState + useEffect + вызов функции из `api.ts`

### Добавить новый раздел Roadmap
1. Добавить запись в `roadmapData.ts` с `pbCategory: "нужная_категория"`
2. Добавить пункт навигации в `Layout.tsx` → `navGroups`
3. Создать статьи в PocketBase с нужной категорией
4. Добавить категорию в `ArticlesPage.tsx` → `CATEGORIES` (если нужна в фильтре)

### Добавить Shadcn компонент
```bash
cd app
npx shadcn add <component-name>
```

---

## Что НЕ делать

- **Не писать fetch() в хуках напрямую** — только через функции из `api.ts`
- **Не хардкодить URL PocketBase** — только `VITE_PB_URL` из env
- **Не редактировать `components/ui/`** — это Shadcn, обновлять через CLI
- **Не добавлять `@ts-ignore`** — разобраться с типом правильно
- **Не добавлять `console.log` в продакшн код** — только `console.error` в catch-блоках
- **Не использовать inline-стили** — только Tailwind классы или CSS-переменные

---

## Переменные окружения

| Переменная | Файл | Описание |
|-----------|------|---------|
| `VITE_PB_URL` | `app/.env` / `app/.env.production` | URL PocketBase. Dev: `http://localhost:8090` |

Скрипты в `scripts/` читают credentials из `scripts/.env` (gitignored):
- `PB_URL` — URL PocketBase
- `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` — для admin API

---

## Известные долги (TODO)

| # | Проблема | Файл |
|---|---------|------|
| 1 | Нет пагинации (`perPage: '100'`) | `api.ts` → `fetchArticles` |
| 2 | Нет модерации комментариев | `CommentsSection.tsx` |
| 3 | Поиск в Layout не реализован (input есть, `fuse.js` установлен, логики нет) | `Layout.tsx` |
| 4 | Кнопка User в Layout ни к чему не привязана | `Layout.tsx` |
| 5 | Нет тестов (Vitest настроен, файлов нет) | `app/src/` |

---

## Полная схема БД

→ см. `SCHEMA.md` в корне проекта.
