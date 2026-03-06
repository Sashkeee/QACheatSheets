import { useState, useEffect } from 'react';
import {
    fetchArticles,
    fetchArticleBySlug,
    fetchArticleImages,
    PbArticle,
    PbArticleImage,
} from '../services/api';

// Hook: список всех статей
export function useArticles() {
    const [articles, setArticles] = useState<PbArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchArticles()
            .then(setArticles)
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

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
                const imgs = await fetchArticleImages(art.id);
                setImages(imgs);
            })
            .catch((e: Error) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    return { article, images, loading, error };
}
