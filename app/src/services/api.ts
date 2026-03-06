// PocketBase REST API service
const PB_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_PB_URL || 'http://localhost:8090';


export interface PbArticle {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;           // Markdown-текст статьи
    cover_image: string;       // Имя файла обложки
    created: string;
    updated: string;
    collectionId: string;
}

export interface PbArticleImage {
    id: string;
    article: string;           // ID связанной статьи
    image: string;             // Имя файла картинки
    caption: string;
    sort_order: number;
    collectionId: string;
}

/** Возвращает публичный URL файла из PocketBase */
export function pbFileUrl(collectionId: string, recordId: string, filename: string): string {
    return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}

/** Получить список всех статей (отсортированных по дате создания) */
export async function fetchArticles(): Promise<PbArticle[]> {
    const res = await fetch(
        `${PB_URL}/api/collections/articles/records?sort=-created&perPage=100`
    );
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as PbArticle[];
}

/** Получить одну статью по slug */
export async function fetchArticleBySlug(slug: string): Promise<PbArticle> {
    const res = await fetch(
        `${PB_URL}/api/collections/articles/records?filter=(slug='${slug}')&perPage=1`
    );
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    if (!data.items || data.items.length === 0) throw new Error('Article not found');
    return data.items[0] as PbArticle;
}

/** Получить все картинки (слайды) для конкретной статьи */
export async function fetchArticleImages(articleId: string): Promise<PbArticleImage[]> {
    const res = await fetch(
        `${PB_URL}/api/collections/article_images/records?filter=(article='${articleId}')&sort=sort_order&perPage=100`
    );
    if (!res.ok) throw new Error(`PocketBase error: ${res.status}`);
    const data = await res.json();
    return data.items as PbArticleImage[];
}
