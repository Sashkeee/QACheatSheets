import { useEffect, useState } from 'react';
import { fetchMiniArticles, type MiniArticle } from '@/services/api';

export type { MiniArticle };

export function useMiniArticles() {
    const [articles, setArticles] = useState<MiniArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetchMiniArticles()
            .then(setArticles)
            .catch((err) => {
                console.error('Failed to fetch mini articles:', err);
                setError(err.message);
                setArticles([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return { articles, loading, error };
}
