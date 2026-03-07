import { useState, useEffect } from 'react';
import {
    fetchArticles,
    fetchArticleBySlug,
    fetchArticleImages,
    PbArticle,
    PbArticleImage,
} from '../services/api';

// Hook: список статей (с опциональным фильтром по категории)
export function useArticles(category?: string) {
    const [articles, setArticles] = useState<PbArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchArticles(category)
            .then(setArticles)
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, [category]);

    return { articles, loading, error };
}


// Hook: один конкретный материал по slug + его слайды
export function useArticleDetail(slug: string) {
    const [article, setArticle] = useState<PbArticle | null>(null);
    const [images, setImages] = useState<PbArticleImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetchArticleBySlug(slug)
            .then(async (art) => {
                setArticle(art);
                // Ошибка загрузки слайдов не блокирует показ статьи
                try {
                    const imgs = await fetchArticleImages(art.id);
                    setImages(imgs);
                } catch {
                    setImages([]);
                }
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    return { article, images, loading, error };
}
