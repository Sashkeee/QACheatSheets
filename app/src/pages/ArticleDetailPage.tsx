import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useArticleDetail } from '../hooks/useArticles';
import { pbFileUrl } from '../services/api';
import { CommentsSection } from '../components/comments/CommentsSection';

export function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { article, images, loading, error } = useArticleDetail(slug || '');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!slug) return <Navigate to="/articles" />;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
                <Loader2 size={36} className="animate-spin text-primary" />
                <p className="font-medium">Загружаем статью...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-6 text-center px-4">
                <AlertTriangle size={48} className="text-yellow-500" />
                <div>
                    <h2 className="text-2xl font-black mb-2">Статья не найдена</h2>
                    <p className="text-muted-foreground font-medium max-w-sm">
                        {error || 'Возможно, статья была удалена или URL указан неверно.'}
                    </p>
                </div>
                <Link to="/articles" className="volumetric bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    К списку статей
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Back + Title */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 px-2 sm:px-6">
                <Link to="/articles">
                    <button className="volumetric flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-primary bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                        <ArrowLeft size={24} className="stroke-[2.5] w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </Link>
                <div className="space-y-3 sm:space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">
                            Статьи
                        </span>
                    </div>
                    <h1 className="text-[32px] sm:text-[39px] font-bold tracking-tight text-foreground leading-[1.2] max-w-3xl text-left">
                        {article.title}
                    </h1>
                    {article.description && (
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            {article.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Cover image */}
            {article.cover_image && (
                <div className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] flex justify-center items-center">
                    <img
                        src={pbFileUrl(article.collectionId, article.id, article.cover_image)}
                        alt={article.title}
                        className="w-full h-auto max-h-[700px] object-contain transition-transform duration-1000 group-hover:scale-[1.01]"
                    />
                </div>
            )}

            {/* Main article content */}
            <div className="article-content">
                <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>

            {/* Slides */}
            {images.length > 0 && (
                <div className="space-y-6">
                    <hr className="border-white/10" />
                    <h2 className="text-2xl font-bold">📑 Слайды</h2>
                    {images.map((img, i) => (
                        <figure key={img.id} className="space-y-2">
                            <img
                                src={pbFileUrl(img.collectionId, img.id, img.image)}
                                alt={img.caption || `Слайд ${i + 1}`}
                                className="w-full h-auto rounded-xl"
                            />
                            {img.caption && (
                                <figcaption className="text-sm text-muted-foreground text-center italic">
                                    {img.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            )}

            {/* Comments Section */}
            <CommentsSection articleId={article.id} />

            {/* Footer */}
            <footer className="pt-20 mt-20 border-t border-white/10 flex flex-col items-center gap-10 text-center px-4">
                <Link
                    to="/articles"
                    className="volumetric bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,186,149,0.3)]"
                >
                    Все статьи
                </Link>
            </footer>
        </div>
    );
}
