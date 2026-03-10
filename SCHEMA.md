# PocketBase Schema — QA CheatSheet

> Единственный источник правды о структуре БД.
> Обновлять при любом изменении коллекций в PocketBase Admin UI.

---

## Окружения

| Среда | URL |
|-------|-----|
| Dev | `http://localhost:8090` (задаётся в `app/.env` как `VITE_PB_URL`) |
| Prod | задаётся в `app/.env.production` как `VITE_PB_URL` |

Все запросы идут через `app/src/services/api.ts` — единственная точка входа в PocketBase.

---

## Коллекции

### `articles`
Основные обучающие статьи. Рендерятся через `react-markdown`.

| Поле | Тип PB | TypeScript | Обязательное | Описание |
|------|--------|------------|:---:|---------|
| `id` | `text` (auto) | `string` | ✓ | Автогенерируется PocketBase |
| `slug` | `text` | `string` | ✓ | URL-идентификатор, уникальный. Пример: `api-testing-basics` |
| `title` | `text` | `string` | ✓ | Заголовок статьи |
| `description` | `text` | `string` | ✓ | Краткое описание (для карточки и SEO) |
| `content` | `editor` | `string` | ✓ | Контент в формате **Markdown** |
| `cover_image` | `file` | `string` | — | Имя файла обложки. URL строится через `pbFileUrl()` |
| `category` | `text` | `string` | ✓ | См. раздел [Категории](#категории) |
| `view_count` | `number` | `number?` | — | Счётчик просмотров. Инкремент: `PATCH { view_count: '+1' }` |
| `sort_order` | `number` | `number?` | — | Порядок в категории (используется для `intro`, сортировка ASC) |
| `quiz` | `json` | `QuizQuestion[]?` | — | Вопросы для самопроверки. `maxSize: 5000000` |
| `glossary` | `json` | `GlossaryEntry[]?` | — | Словарь терминов. `maxSize: 2000000` |
| `mistakes` | `json` | `string[]?` | — | Типичные ошибки новичков. `maxSize: 1000000` |
| `created` | `date` (auto) | `string` | ✓ | Дата создания (ISO 8601) |
| `updated` | `date` (auto) | `string` | ✓ | Дата последнего обновления |
| `collectionId` | `text` (auto) | `string` | ✓ | Системное поле PocketBase |

**Используется в:** `ArticlesPage`, `ArticleDetailPage`, `RoadmapPage`
**API-функции:** `fetchArticles(category?, sort?)`, `fetchArticleBySlug(slug)`

#### TypeScript-интерфейсы

```ts
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index 0-3
}

interface GlossaryEntry {
    term: string;
    definition: string;
}
```

---

### `article_images`
Слайды/изображения к статьям. Отображаются в `ArticleDetailPage` как галерея.

| Поле | Тип PB | TypeScript | Обязательное | Описание |
|------|--------|------------|:---:|---------|
| `id` | `text` (auto) | `string` | ✓ | |
| `article` | `relation → articles` | `string` | ✓ | ID статьи-родителя |
| `image` | `file` | `string` | ✓ | Имя файла изображения |
| `caption` | `text` | `string` | — | Подпись к слайду |
| `sort_order` | `number` | `number` | — | Порядок отображения (ASC) |
| `collectionId` | `text` (auto) | `string` | ✓ | |

**API-функции:** `fetchArticleImages(articleId)`

---

### `mini_articles`
Короткие карточки на главной странице (`Home`). Не имеют полного контента.

| Поле | Тип PB | TypeScript | Обязательное | Описание |
|------|--------|------------|:---:|---------|
| `id` | `text` (auto) | `string` | ✓ | |
| `title` | `text` | `string` | ✓ | Заголовок карточки |
| `description` | `text` | `string` | ✓ | Краткое описание |
| `reading_time` | `text` | `string` | ✓ | Время чтения. Пример: `«5 мин»` |
| `cover_image` | `file` | `string?` | — | Имя файла обложки |
| `order` | `number` | `number?` | — | Порядок отображения на главной |
| `slug` | `text` | `string?` | — | Ссылка (если кликабельная карточка) |
| `collectionId` | `text` (auto) | `string` | ✓ | |

**API-функции:** `fetchMiniArticles()`
**Лимит запроса:** `perPage=50`, сортировка `-created`

---

### `comments`
Комментарии к статьям. Без авторизации — анонимные или с именем.

| Поле | Тип PB | TypeScript | Обязательное | Описание |
|------|--------|------------|:---:|---------|
| `id` | `text` (auto) | `string` | ✓ | |
| `article_id` | `text` | `string` | ✓ | ID статьи (не relation, plain text) |
| `author_name` | `text` | `string \| null` | — | Имя автора. `null` = анонимно |
| `comment_text` | `text` | `string` | ✓ | Текст комментария |
| `created` | `date` (auto) | `string` | ✓ | |

> ⚠️ Нет модерации и каптчи. Открыто для спама — TODO.

**API-функции:** `fetchComments(articleId)`, `addComment(articleId, authorName, text)`

---

### `page_views`
Аналитика просмотров. Пишется при каждом открытии статьи.

| Поле | Тип PB | TypeScript | Обязательное | Описание |
|------|--------|------------|:---:|---------|
| `id` | `text` (auto) | `string` | ✓ | |
| `article_id` | `text` | `string` | ✓ | ID статьи |
| `referer` | `text` | `string` | ✓ | `document.referrer` или `'direct'` |
| `user_agent` | `text` | `string` | ✓ | `navigator.userAgent` |
| `created` | `date` (auto) | `string` | ✓ | Timestamp просмотра |

**API-функции:** `trackPageView(articleId)` — пишет просмотр + инкрементирует `articles.view_count`

---

## Категории

Используются в коллекции `articles.category` и в `roadmapData.ts` (поле `pbCategory`).

| Значение | Название в UI | Фильтр в ArticlesPage | roadmapData |
|----------|---------------|:---:|:---:|
| `intro` | Введение | ✓ | `intro-qa` (`pbSort: "sort_order"`) |
| `basics` | Основы и теория | ✓ | `basics` |
| `tech` | Технологии | ✓ | `api`, `automation` |
| `security` | Security | ✓ | `security` |
| `infrastructure` | Инфраструктура | ✓ | `infrastructure` |
| `databases` | Базы данных | ✓ | `databases` |
| `career` | Карьера | ✓ | `career` |
| `advanced` | — | ✗ | не используется |

---

## Файлы в PocketBase

URL файла строится функцией `pbFileUrl()` из `api.ts`:

```
{PB_URL}/api/files/{collectionId}/{recordId}/{filename}
```

Пример для обложки статьи:
```
http://localhost:8090/api/files/abc123/xyz789/cover.webp
```

---

## Особенности PocketBase API

- **Инкремент числового поля:** `PATCH { view_count: '+1' }` — PocketBase поддерживает строковый синтаксис инкремента
- **Фильтры:** `filter=(field='value')` — в URLSearchParams, одинарные кавычки внутри
- **Пагинация:** параметр `perPage`, не `limit`
- **Сортировка:** `-created` (убывание), `sort_order` (возрастание)
- **404 на коллекцию:** если коллекция не создана в PB Admin — вернёт 404, не 500
- **JSON-поля:** при создании/обновлении схемы через API требуют `options: { maxSize: <number> }`
