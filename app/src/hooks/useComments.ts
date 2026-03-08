import { useEffect, useState } from 'react';

export interface Comment {
    id: string;
    article_id: string;
    author_name: string | null;
    comment_text: string;
    created: string;
}

export function useComments(articleId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://5.35.126.199:8090/api/collections/comments/records?filter=(article_id='${articleId}')&sort=-created`
            );

            if (!response.ok) {
                if (response.status === 404) {
                    setComments([]);
                    setError(null);
                    setLoading(false);
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setComments(data.items || []);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            setComments([]);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (articleId) {
            fetchComments();
        }
    }, [articleId]);

    const addComment = async (authorName: string | null, text: string) => {
        try {
            const response = await fetch(
                'http://5.35.126.199:8090/api/collections/comments/records',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        article_id: articleId,
                        author_name: authorName || null,
                        comment_text: text,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to add comment: ${response.status}`);
            }

            const newComment = await response.json();
            setComments([newComment, ...comments]);
            return true;
        } catch (err) {
            console.error('Error adding comment:', err);
            return false;
        }
    };

    return { comments, loading, error, addComment, refetch: fetchComments };
}
