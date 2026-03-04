# 🔍 Аудит проекта QA CheatSheet

> **Дата:** 4 марта 2026  
> **Проект:** [QA CheatSheet](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet) — интерактивный справочник для QA-инженеров  
> **Стек:** React 19 + TypeScript + Vite + Tailwind CSS + Docker

---

## 📊 Общая оценка

| Критерий | Оценка | Комментарий |
|---|:---:|---|
| Дизайн и UX | ⭐⭐⭐⭐ | Современный glassmorphism, тёмная/светлая тема, приятные анимации |
| Качество контента | ⭐⭐⭐⭐⭐ | Глубокие статьи с аналогиями, квизами, глоссариями — лучшая часть проекта |
| Архитектура кода | ⭐⭐⭐ | Рабочая, но требует рефакторинга по мере роста |
| Масштабируемость данных | ⭐⭐ | Контент hardcoded в TS-файлах — потолок масштабирования |
| SEO и доступность | ⭐⭐ | SPA без SSR, минимальные мета-теги, нет OG-карточек |
| Безопасность | ⭐ | **Критическая проблема:** API-ключ в `.env` закоммичен в репозиторий |
| Тесты | ⭐ | Настроен Vitest, но тестов фактически нет |
| DevOps / CI/CD | ⭐⭐⭐⭐ | Docker + GitHub Actions — хорошая основа |

---

## ✅ Сильные стороны

### 1. Отличный образовательный контент
Самая сильная сторона проекта. Статьи написаны живым языком с реальными аналогиями (пример про Золушку, подростка из книги Савина). Каждая статья модуля `intro-qa` включает:
- Глубокий markdown-контент (~5 статей по 15-25 КБ каждая)
- Блок **«Словарь терминов»** (glossary)
- Блок **«Типичные ошибки новичков»** (mistakes)
- **Квизы** для самопроверки (quiz)
- Иллюстрации из профильной литературы

> [!TIP]
> Эта структура контента — готовая модель для всех остальных модулей. Нужно привести `basics`, `test-design`, `api`, `databases`, `security`, `infrastructure`, `ai`, `career` к тому же уровню глубины.

### 2. Современный стек технологий
- **React 19** + **TypeScript** + **Vite 7** — актуальные версии
- **Tailwind CSS 4** с кастомными glassmorphism-утилитами (`.glass`, `.volumetric`, `.mesh-bg`)
- **Zustand** для state management (тема)
- **PWA-поддержка** через `vite-plugin-pwa`
- **Radix UI** примитивы для UI-компонентов

### 3. Продуманный дизайн
- Glassmorphism + neumorphism (`.volumetric`)
- Gradient mesh-фоны
- Тёмная и светлая темы с плавными переходами
- Адаптивная типографика с `clamp()` в [article.css](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/styles/article.css)
- Микротипографика (французские кавычки, длинное тире, неразрывные пробелы)

### 4. AI-чатбот
[AIChatbot.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/chat/AIChatbot.tsx) — интересная фича: бот знакомится со всеми статьями сайта и отвечает на вопросы по QA в контексте этих материалов через OpenRouter API.

### 5. Готовая DevOps-инфраструктура
- Multi-stage [Dockerfile](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/Dockerfile) (build → nginx:alpine)
- [docker-compose.yml](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/docker-compose.yml) с лимитами ресурсов
- GitHub Actions CI/CD pipeline
- Подробная документация деплоя ([DEPLOY.md](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/DEPLOY.md))

---

## ❌ Слабые стороны и проблемы

### 🔴 Критические

#### 1. API-ключ закоммичен в репозиторий
```
# app/.env
VITE_OPENROUTER_API_KEY=sk-or-v1-b325499ebf26fb...
```

> [!CAUTION]
> **Файл `.env` с секретным API-ключом НЕ добавлен в `.gitignore`!** Любой, кто получит доступ к репозиторию, может использовать ваш ключ. Даже если вы ротируете ключ, старый останется в истории Git навсегда.

**Что делать:**
1. Добавить `.env` в `.gitignore`
2. Немедленно ротировать ключ на openrouter.ai
3. Удалить ключ из истории Git (`git filter-branch` / `git filter-repo`)
4. Использовать переменные окружения на сервере, а не `VITE_*` (которые попадают в бандл)

#### 2. API-ключ попадает в production-бандл
Переменные `VITE_*` инлайнятся Vite в клиентский JavaScript. Это значит, что **API-ключ OpenRouter виден любому пользователю вашего сайта** через DevTools → Sources.

**Что делать:** Перенести вызов API на backend (serverless function / Edge function / простой proxy-сервер).

---

### 🟡 Архитектурные

#### 3. Контент hardcoded в TypeScript-файлах
Все статьи живут в `.ts` файлах как JavaScript-объекты:
- [roadmapData.ts](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/data/roadmapData.ts) — 283 строки
- [introQa1.ts](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/data/intro-qa/introQa1.ts) — 228 строк
- [introQa2.ts](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/data/intro-qa/introQa2.ts) — 200 строк
- и т.д. (~96 КБ контента только в `intro-qa`)

**Проблемы:**
- Для добавления статьи нужно знать TypeScript
- Нет возможности добавлять контент через админку
- При каждом изменении статьи нужна пересборка всего приложения
- Невозможно организовать полнотекстовый поиск по контенту

#### 4. Неравномерная глубина контента
| Модуль | Статей | Квизы | Глоссарий | Ошибки |
|---|:---:|:---:|:---:|:---:|
| intro-qa | 5 | ✅ | ✅ | ✅ |
| basics | 2 | ❌ | ❌ | ❌ |
| test-design | 1 | ❌ | ❌ | ❌ |
| databases | 2 | ❌ | ❌ | ❌ |
| api | 2 | ❌ | ❌ | ❌ |
| types | 1 | ❌ | ❌ | ❌ |
| automation | 1 | ❌ | ❌ | ❌ |
| security | 1 | ❌ | ❌ | ❌ |
| infrastructure | 1 | ❌ | ❌ | ❌ |
| ai | 1 | ❌ | ❌ | ❌ |
| career | 1 | ❌ | ❌ | ❌ |

Только `intro-qa` имеет полноценный контент с квизами, глоссарием и ошибками. Остальные 10 модулей содержат по 1-2 короткие статьи без интерактивных элементов.

#### 5. Неиспользуемый компонент Header
[Header.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Header.tsx) (62 строки) **не импортируется нигде** — его функционал дублируется внутри [Layout.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Layout.tsx). Мертвый код.

#### 6. Дублирование логики темы
[Layout.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Layout.tsx#L57-L66) и [Header.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Header.tsx#L10-L19) содержат одинаковый `useEffect` для применения темы к `<html>`. Это должно быть в одном месте (в `main.tsx` или в хуке).

#### 7. Поиск — заглушка
Поле поиска в [Layout.tsx:138-141](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Layout.tsx#L138-L141) — это чистая заглушка без функциональности. `fuse.js` установлен в зависимостях, но нигде не используется.

#### 8. Кнопки-заглушки
- **«Карта развития»** на главной — не ведёт никуда
- **«Стать PRO»** в Header — не делает ничего
- **«Все статьи»** и **«Каталог»** — ведут на `#`
- **User icon** — декорация без функционала
- **«Читать гайд» Playwright** — не ведёт никуда

---

### 🟠 Технические

#### 9. `<a>` вместо `<Link>` для навигации
В [Layout.tsx:111](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/components/layout/Layout.tsx#L111) навигация по sidebar использует обычные `<a href>` теги вместо React Router `<Link>`, что вызывает **полную перезагрузку страницы** вместо SPA навигации. То же самое на [Home.tsx](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/pages/Home.tsx) — все карточки используют `<a href>`.

#### 10. Использование `any` типов
```typescript
// RoadmapPage.tsx:74
data.sections.map((section: any, idx: number) => { ... })

// RoadmapPage.tsx:156
section.glossary.map((term: any, i: number) => { ... })

// Home.tsx:161
function QuickCard({ href, icon: Icon, color, bgColor, title, desc, tag }: any) { ... }
```
Типы определены в `roadmapData.ts`, но не используются в компонентах.

#### 11. Тёмная тема в article.css конфликтует
[article.css](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/src/styles/article.css#L37-L46) использует `@media (prefers-color-scheme: dark)` для переменных, но Tailwind CSS настроен на `darkMode: "class"`. Это создаёт конфликт:
- Если пользователь выберет светлую тему, а у системы тёмная — `@media` применит тёмные стили к `:root`, перезаписав ваши переменные.

#### 12. `lang="en"` в HTML для русскоязычного сайта
[index.html:2](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/index.html#L2): `<html lang="en">` — нужно `<html lang="ru">`.

#### 13. Тяжелые изображения в public/
Диаграммы не оптимизированы:
- `docker_concept.png` — **1.9 МБ**
- `api_diagram.png` — **1.7 МБ**
- `sdlc_diagram.png` — **1.7 МБ**
- `test_pyramid_diagram.png` — **1.5 МБ**

Суммарно ~12 МБ только на диаграммы. При этом используется PNG формат вместо WebP/AVIF.

#### 14. 20 скриптов-«костылей» в scripts/
Папка [scripts/](file:///c:/Users/user/Documents/Antigravity/QA%20CheatSheet/app/scripts) содержит 20 одноразовых скриптов (`emergency-fix.cjs`, `deep-repair.cjs`, `final-repair.cjs`), которые, вероятно, использовались для разовой обработки данных. Они захламляют проект.

#### 15. Нет тестов
`vitest` и `@testing-library/react` установлены, но ни одного тестового файла в проекте нет.

#### 16. Recharts, mermaid, i18next — установлены, но не используются
Эти библиотеки добавляют ~500KB к бандлу, но нигде не импортируются.

---

## 💡 Рекомендации по улучшению

### 🏆 Приоритет 1: Критические фиксы

| # | Задача | Сложность |
|---|---|:---:|
| 1 | Убрать API-ключ из `.env` и добавить `.env` в `.gitignore` | 🟢 Лёгко |
| 2 | Перенести вызов AI API на серверную сторону (Cloudflare Workers / Vercel Edge) | 🟡 Средне |
| 3 | Заменить `<a href>` на `<Link>` из react-router-dom | 🟢 Лёгко |
| 4 | Изменить `lang="en"` на `lang="ru"` | 🟢 Лёгко |

### 🏆 Приоритет 2: Контент и данные

| # | Задача | Сложность | Описание |
|---|---|:---:|---|
| 5 | **Перевести контент в Markdown/MDX файлы** | 🟡 Средне | Вместо `.ts` файлов хранить статьи в `.md`/`.mdx` с frontmatter. Это позволит: редактировать без знания TS, использовать CMS, делать полнотекстовый поиск |
| 6 | **Или: добавить headless CMS** | 🔴 Сложно | Подключить Strapi / Sanity / Contentlayer для управления контентом через веб-интерфейс |
| 7 | **Или: использовать JSON/YAML файлы + БД** | 🟡 Средне | Перенести данные в JSON и подгружать их динамически. Для масштабного решения — SQLite (через IndexedDB) или Supabase |
| 8 | Развить все модули до уровня `intro-qa` | 🔴 Долго | Добавить квизы, глоссарии, ошибки во все 10 оставшихся модулей |
| 9 | Реализовать работающий поиск на базе Fuse.js | 🟡 Средне | Библиотека уже установлена, нужно привязать к полю поиска |

### 🏆 Приоритет 3: Архитектура и DX

| # | Задача | Сложность |
|---|---|:---:|
| 10 | Удалить мёртвый код: `Header.tsx`, 20 скриптов из `scripts/` | 🟢 Лёгко |
| 11 | Удалить неиспользуемые зависимости: `recharts`, `mermaid`, `i18next`, `react-i18next` | 🟢 Лёгко |
| 12 | Убрать типы `any`, использовать интерфейсы из `roadmapData.ts` | 🟢 Лёгко |
| 13 | Написать базовые тесты: рендеринг страниц, роутинг, квиз | 🟡 Средне |
| 14 | Оптимизировать изображения: конвертировать в WebP, добавить lazy loading | 🟡 Средне |
| 15 | Починить конфликт `@media` vs `.dark` в `article.css` | 🟢 Лёгко |

### 🏆 Приоритет 4: Новые фичи (идеи)

| # | Фича | Описание |
|---|---|---|
| 16 | **📊 Прогресс обучения** | Сохранять прогресс пользователя: прочитанные статьи, результаты квизов. localStorage → потом можно авторизация + Supabase |
| 17 | **🔍 Полнотекстовый поиск** | Поиск по всему контенту с подсветкой результатов (Fuse.js уже установлен) |
| 18 | **📝 Интерактивные SQL-песочницы** | Встроенный SQL Playground прямо в статьях о базах данных (sql.js — SQLite в браузере) |
| 19 | **🗂 Система закладок** | Позволить пользователю сохранять отдельные статьи в избранное |
| 20 | **📱 Полноценный PWA с офлайном** | Кешировать статьи для чтения без интернета (Service Worker + Cache API) |
| 21 | **🌍 i18n (English)** | `i18next` уже установлен — можно добавить англоязычную версию для портфолио |
| 22 | **💬 Комментарии к статьям** | Giscus (на основе GitHub Discussions) — бесплатно и без бэкенда |
| 23 | **📈 Аналитика** | Подключить Plausible / Umami (privacy-first) для понимания, какие разделы популярны |
| 24 | **🎯 Карта знаний (Roadmap)** | Визуальная интерактивная карта: дерево или граф связей между темами |
| 25 | **OG-карточки** | Добавить Open Graph мета-теги для красивых превью при шаринге в Telegram/LinkedIn |

---

## 📐 Рекомендуемая архитектура контента

Текущая архитектура:
```
data/roadmapData.ts → содержит ВСЁ → компоненты читают напрямую
```

Рекомендуемая архитектура (вариант MDX):
```
content/
├── intro-qa/
│   ├── 01-what-is-testing.mdx      ← сама статья
│   ├── 02-sdlc.mdx
│   └── _meta.json                   ← метаданные модуля (title, description, order)
├── basics/
│   ├── 01-core-concepts.mdx
│   └── _meta.json
└── ...

src/
├── lib/content-loader.ts            ← загрузчик MDX файлов
├── pages/
│   ├── Home.tsx
│   └── ArticlePage.tsx              ← универсальная страница статьи
└── ...
```

**Преимущества:**
- Легко добавлять контент без знания React
- Git-friendly diff для текста
- Возможность подключить CMS (Contentlayer/Velite)
- Lazy loading контента (не загружать все статьи сразу)

---

## 🎯 Итог

Проект имеет **отличную содержательную базу** и **стильный modern UI**. Главный вектор развития — **масштабирование контента** (наполнить все модули до уровня intro-qa) и **отделение данных от кода** (перейти на MDX или headless CMS). Также критически важно решить проблему с утечкой API-ключа.

По техническому долгу — убрать мёртвый код, заменить `any` на настоящие типы, починить SPA-навигацию и добавить хотя бы базовые тесты. Всё это реально сделать за 2-3 сессии работы.

