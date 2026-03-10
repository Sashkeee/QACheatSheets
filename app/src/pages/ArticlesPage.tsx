import { Link, useSearchParams } from 'react-router-dom';
import { FileText, ChevronRight, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { pbFileUrl } from '../services/api';
import { formatViewCount } from '../hooks/useAnalytics';

const CATEGORIES = [
    { key: '', label: 'Все' },
    { key: 'intro', label: 'Введение' },
    { key: 'basics', label: 'Основы и теория' },
    { key: 'tech', label: 'Технологии' },
    { key: 'databases', label: 'Базы данных' },
    { key: 'security', label: 'Security' },
    { key: 'infrastructure', label: 'Инфраструктура' },
    { key: 'career', label: 'Карьера' },
];

export function ArticlesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || '';
    const { articles, loading, error } = useArticles(activeCategory || undefined);

    const setCategory = (key: string) => {
        if (key) setSearchParams({ category: key });
        else setSearchParams({});
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.25em]">
                        Материалы
                    </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                    Статьи
                </h1>
                <p className="text-lg text-foreground/70 font-medium max-w-2xl">
                    Полезные материалы о тестировании, инструментах и карьере в QA.
                </p>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${activeCategory === key
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]'
                                : 'bg-background/50 text-foreground/60 hover:text-foreground hover:bg-background/80 border border-white/10'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* States */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
                    <Loader2 size={36} className="animate-spin text-primary" />
                    <p className="font-medium">Загружаем статьи...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center px-4">
                    <AlertTriangle size={48} className="text-yellow-500" />
                    <div>
                        <h2 className="text-2xl font-black mb-2">Не удалось загрузить статьи</h2>
                        <p className="text-muted-foreground font-medium max-w-sm">
                            Убедитесь, что PocketBase запущен. Ошибка: <code>{error}</code>
                        </p>
                    </div>
                </div>
            )}

            {!loading && !error && articles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                    <FileText size={48} className="text-muted-foreground/40" />
                    <div>
                        <h2 className="text-2xl font-black mb-2">Статей пока нет</h2>
                        <p className="text-muted-foreground font-medium">
                            {activeCategory
                                ? `В категории «${CATEGORIES.find(c => c.key === activeCategory)?.label}» статей ещё нет.`
                                : 'Добавьте первую статью через панель администратора PocketBase.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Article grid */}
            {!loading && !error && articles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            to={`/articles/${article.slug}`}
                            className="group block"
                        >
                            <div className="glass h-full rounded-[2.5rem] p-3 transition-all duration-300 hover:scale-[1.02] border border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                                <div className="h-full rounded-[2.2rem] bg-background/40 overflow-hidden flex flex-col">
                                    {article.cover_image && (
                                        <div className="overflow-hidden h-48">
                                            <img
                                                src={pbFileUrl(article.collectionId, article.id, article.cover_image)}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <div className="p-8 flex flex-col items-start space-y-4 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {article.category && (
                                                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                                                    {CATEGORIES.find(c => c.key === article.category)?.label || article.category}
                                                </span>
                                            )}
                                            {article.view_count && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-foreground/5 text-muted-foreground text-[10px] font-semibold">
                                                    <Eye size={10} />
                                                    {formatViewCount(article.view_count)}
                                                </span>
                                            )}
                                        </div>
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
            )}
        </div>
    );
}
