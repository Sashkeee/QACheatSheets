import { useEffect } from 'react';

export function usePageView(articleId: string) {
    useEffect(() => {
        // Track the page view
        const trackView = async () => {
            try {
                // Get referer
                const referer = document.referrer || 'direct';

                // Get user agent
                const userAgent = navigator.userAgent;

                // Send to PocketBase
                await fetch(
                    'http://5.35.126.199:8090/api/collections/page_views/records',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            article_id: articleId,
                            referer: referer,
                            user_agent: userAgent,
                        }),
                    }
                );

                // Increment view_count in articles
                await fetch(
                    `http://5.35.126.199:8090/api/collections/articles/records/${articleId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            view_count: '+1', // PocketBase supports increment syntax
                        }),
                    }
                ).catch(() => {
                    // If increment fails, silent fail
                    return null;
                });
            } catch (err) {
                console.error('Error tracking page view:', err);
            }
        };

        trackView();
    }, [articleId]);
}

// Format view count nicely
export function formatViewCount(count: number | null | undefined): string {
    if (!count) return '0';
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1000000).toFixed(1) + 'M';
}
