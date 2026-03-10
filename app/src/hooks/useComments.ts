import { useEffect, useState } from 'react';
import {
    fetchComments,
    addComment as apiAddComment,
    type Comment,
} from '@/services/api';

export type { Comment };

export function useComments(articleId: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadComments = () => {
        if (!articleId) return;
        setLoading(true);
        fetchComments(articleId)
            .then(setComments)
            .catch((err) => {
                console.error('Failed to fetch comments:', err);
                setComments([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(loadComments, [articleId]);

    const addComment = async (authorName: string | null, text: string): Promise<boolean> => {
        try {
            const newComment = await apiAddComment(articleId, authorName, text);
            setComments((prev) => [newComment, ...prev]);
            return true;
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Не удалось отправить комментарий');
            return false;
        }
    };

    return { comments, loading, error, addComment, refetch: loadComments };
}
