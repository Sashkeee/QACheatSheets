// @ts-ignore
const PB_URL = import.meta.env.VITE_PB_URL ?? 'http://localhost:8090';


export interface PbArticle {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    cover_image: string;
    category: string;          // intro | basics | tech | advanced | career
    created: string;
    updated: string;
    collectionId: string;
    view_count?: number;       // количество просмотров
}

export interface PbArticleImage {
    id: string;
    article: string;
    image: string;
    caption: string;
    sort_order: number;
    collectionId: string;
}

/** Возвращает публичный URL файла из PocketBase */
export function pbFileUrl(collectionId: string, recordId: string, filename: string): string {
    return `${PB_URL}/api/files/${collectionId}/${recordId}/${filename}`;
}

/** Получить список статей. Если передана category — фильтрует по ней */
export async function fetchArticles(category?: string): Promise<PbArticle[]> {
    const params = new URLSearchParams({ sort: '-created', perPage: '100' });
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
