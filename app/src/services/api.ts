// @ts-ignore
const PB_URL = import.meta.env.VITE_PB_URL ?? 'http://localhost:8090';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index 0-3
}

export interface GlossaryEntry {
    term: string;
    definition: string;
}

export interface PbArticle {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    cover_image: string;
    category: string;           // intro | basics | tech | advanced | career | databases | security | infrastructure
    created: string;
    updated: string;
    collectionId: string;
    view_count?: number;
    sort_order?: number;        // порядок в категории (используется для intro)
    quiz?: QuizQuestion[];      // вопросы для самопроверки
    glossary?: GlossaryEntry[]; // словарь терминов
    mistakes?: string[];        // типичные ошибки новичков
}

export interface PbArticleImage {
    id: string;
    article: string;
    image: string;
    caption: string;
    sort_order: number;
    collectionId: string;
}

export interface MiniArticle {
    id: string;
    title: string;
    description: string;
    reading_time: string;
    cover_image?: string;
    order?: number;
    slug?: string;
    collectionId: string;
}

export interface Comment {
    id: string;
    article_id: string;
    author_name: string | null;
    comment_text: string;
    created: string;
}

/** Возвращает публичный URL файла из PocketBase */
export function pbFileUrl(collectionId: string, recordId: string, filename: string): string {
    return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}

/** Получить список статей. Если передана category — фильтрует по ней.
 *  sort: PocketBase sort string, например 'sort_order' или '-created' */
export async function fetchArticles(category?: string, sort = '-created'): Promise<PbArticle[]> {
    const params = new URLSearchParams({ sort, perPage: '100' });
    if (category) params.set('filter', `(category='${category}')`);
    const res = await fetch(`${PB_URL}/api/collections/articles/records?${params}`);
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as PbArticle[];
}


/** Получить одну статью по slug */
export async function fetchArticleBySlug(slug: string): Promise<PbArticle> {
    const params = new URLSearchParams({ filter: `(slug='${slug}')`, perPage: '1' });
    const res = await fetch(`${PB_URL}/api/collections/articles/records?${params}`);
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    if (!data.items || data.items.length === 0) throw new Error('Article not found');
    return data.items[0] as PbArticle;
}

/** Получить все картинки (слайды) для конкретной статьи */
export async function fetchArticleImages(articleId: string): Promise<PbArticleImage[]> {
    const params = new URLSearchParams({ filter: `(article='${articleId}')`, sort: 'sort_order', perPage: '100' });
    const res = await fetch(`${PB_URL}/api/collections/article_images/records?${params}`);
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as PbArticleImage[];
}

/** Получить список мини-статей для главной страницы */
export async function fetchMiniArticles(): Promise<MiniArticle[]> {
    const params = new URLSearchParams({ sort: '-created', perPage: '50' });
    const res = await fetch(`${PB_URL}/api/collections/mini_articles/records?${params}`);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as MiniArticle[];
}

/** Получить комментарии к статье */
export async function fetchComments(articleId: string): Promise<Comment[]> {
    const params = new URLSearchParams({
        filter: `(article_id='${articleId}')`,
        sort: '-created',
    });
    const res = await fetch(`${PB_URL}/api/collections/comments/records?${params}`);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as Comment[];
}

/** Добавить комментарий к статье */
export async function addComment(
    articleId: string,
    authorName: string | null,
    text: string,
): Promise<Comment> {
    const res = await fetch(`${PB_URL}/api/collections/comments/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            article_id: articleId,
            author_name: authorName || null,
            comment_text: text,
        }),
    });
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    return res.json() as Promise<Comment>;
}

/** Записать просмотр статьи в аналитику и увеличить счётчик */
export async function trackPageView(articleId: string): Promise<void> {
    const referer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;

    await fetch(`${PB_URL}/api/collections/page_views/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, referer, user_agent: userAgent }),
    });

    await fetch(`${PB_URL}/api/collections/articles/records/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ view_count: '+1' }),
    }).catch(() => null); // тихий фейл если increment не поддерживается
}
