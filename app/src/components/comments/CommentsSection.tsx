import { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { useComments } from '../../hooks/useComments';

interface CommentsSectionProps {
    articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
    const { comments, loading, addComment } = useComments(articleId);
    const [authorName, setAuthorName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmitting(true);
        const success = await addComment(authorName || null, commentText);
        if (success) {
            setCommentText('');
            setAuthorName('');
        }
        setSubmitting(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} часов назад`;
        if (diffDays < 7) return `${diffDays} дней назад`;

        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className="mt-16 pt-8 border-t border-white/10">
            {/* Заголовок */}
            <div className="flex items-center gap-2 mb-8">
                <MessageSquare size={24} className="text-primary" />
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Комментарии ({comments.length})
                </h2>
            </div>

            {/* Форма добавления комментария */}
            <form onSubmit={handleSubmit} className="mb-12 glass rounded-2xl p-6 border border-white/5">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">
                            Имя (опционально)
                        </label>
                        <input
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            placeholder="Ваше имя или аноним"
                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-muted-foreground mb-2">
                            Ваш комментарий
                        </label>
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Поделитесь вашим мнением..."
                            rows={4}
                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !commentText.trim()}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-bold px-6 py-2 rounded-lg transition-all disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                        {submitting ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </form>

            {/* Список комментариев */}
            {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                    Загрузка комментариев...
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    Пока нет комментариев. Будьте первым!
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                    <User size={18} className="text-primary" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <p className="font-bold text-foreground break-words">
                                            {comment.author_name || 'Аноним'}
                                        </p>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {formatDate(comment.created)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed break-words whitespace-pre-wrap">
                                        {comment.comment_text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
