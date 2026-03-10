import { useEffect } from 'react';
import { trackPageView } from '@/services/api';

export function usePageView(articleId: string) {
    useEffect(() => {
        if (!articleId) return;
        trackPageView(articleId).catch((err) =>
            console.error('Error tracking page view:', err),
        );
    }, [articleId]);
}

export function formatViewCount(count: number | null | undefined): string {
    if (!count) return '0';
    if (count < 1000) return count.toString();
    if (count < 1_000_000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1_000_000).toFixed(1) + 'M';
}
