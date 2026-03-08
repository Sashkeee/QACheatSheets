import { useEffect, useState } from 'react';

export interface MiniArticle {
    id: string;
    title: string;
    description: string;
    reading_time: string;
    cover_image?: string;
    order?: number;
    slug?: string;
}

export function useMiniArticles() {
    const [articles, setArticles] = useState<MiniArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMiniArticles = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    'http://5.35.126.199:8090/api/collections/mini_articles/records?sort=order'
                );

                if (!response.ok) {
                    // Если collection не существует, возвращаем пустой массив
                    if (response.status === 404) {
                        setArticles([]);
                        setError(null);
                        setLoading(false);
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setArticles(data.items || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch mini articles:', err);
                setArticles([]);
                setError(null); // Не показываем ошибку, просто используем значение по умолчанию
            } finally {
                setLoading(false);
            }
        };

        fetchMiniArticles();
    }, []);

    return { articles, loading, error };
}
