import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { pbFileUrl } from '../services/api';

export function ArticlesPage() {
    const { articles, loading, error } = useArticles();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="font-medium">Загружаем статьи...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center px-4">
                <AlertTriangle size={48} className="text-yellow-500" />
                <div>
                    <h2 className="text-2xl font-black mb-2">Не удалось загрузить статьи</h2>
                    <p className="text-muted-foreground font-medium max-w-sm">
                        Убедитесь, что PocketBase запущен и доступен. Ошибка: <code>{error}</code>
                    </p>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-center px-4">
                <FileText size={48} className="text-muted-foreground/40" />
                <div>
                    <h2 className="text-2xl font-black mb-2">Статей пока нет</h2>
                    <p className="text-muted-foreground font-medium">
                        Добавьте первую статью через панель администратора PocketBase.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                        Карьера
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                    Статьи
                </h1>
                <p className="text-lg text-foreground/70 font-medium max-w-2xl">
                    Полезные материалы о карьере в QA, инструментах и профессиональном росте.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        to={`/articles/${article.slug}`}
                        className="group block"
                    >
                        <div className="glass h-full rounded-[2.5rem] p-3 transition-all duration-300 hover:scale-[1.02] border border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                            <div className="h-full rounded-[2.2rem] bg-background/40 overflow-hidden flex flex-col">
                                {/* Cover image */}
                                {article.cover_image && (
                                    <div className="overflow-hidden h-48">
                                        <img
                                            src={pbFileUrl(article.collectionId, article.id, article.cover_image)}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-8 flex flex-col items-start space-y-4 flex-1 shadow-inner shadow-white/5">
                                    <h2 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3 flex-1">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.2em] pt-2">
                                        Читать <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
