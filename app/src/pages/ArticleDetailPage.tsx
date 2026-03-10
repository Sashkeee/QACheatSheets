import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, Eye, BookOpen, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useArticleDetail } from '../hooks/useArticles';
import { pbFileUrl } from '../services/api';
import { CommentsSection } from '../components/comments/CommentsSection';
import { usePageView, formatViewCount } from '../hooks/useAnalytics';
import { SEO } from '../components/seo/SEO';
import { ShareButtons } from '../components/share/ShareButtons';
import { QuizBlock } from '../components/QuizBlock';

export function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { article, images, loading, error } = useArticleDetail(slug || '');
    const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

    const handleAnswer = (sIdx: number, qIdx: number, oIdx: number) => {
        const key = `${sIdx}-${qIdx}`;
        if (quizAnswers[key] !== undefined) return;
        setQuizAnswers(prev => ({ ...prev, [key]: oIdx }));
    };

    // Track page view when article loads
    usePageView(article?.id || '');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!slug) return <Navigate to="/articles" />;

    if (loading) {
        return (
            <>
                <SEO
                    title="Загрузка статьи..."
                    description="Пожалуйста, подождите, статья загружается"
                />
                <div className="flex flex-col items-center justify-center py-40 gap-4 text-muted-foreground">
                    <Loader2 size={36} className="animate-spin text-primary" />
                    <p className="font-medium">Загружаем статью...</p>
                </div>
            </>
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

    const coverImageUrl = article?.cover_image
        ? pbFileUrl(article.collectionId, article.id, article.cover_image)
        : undefined;

    return (
        <>
            <SEO
                title={article?.title || 'Статья'}
                description={article?.description || ''}
                image={coverImageUrl}
                url={`https://qacheatsheet.ru/articles/${slug}`}
                type="article"
                keywords={`QA, тестирование, ${article?.category}`}
            />
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
                        {article?.view_count && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground/5 text-muted-foreground text-[9px] sm:text-[10px] font-semibold">
                                <Eye size={12} />
                                {formatViewCount(article.view_count)}
                            </span>
                        )}
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

                {/* Glossary */}
                {article.glossary && article.glossary.length > 0 && (
                    <div className="p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden group/glossary mt-12">
                        <div className="absolute top-0 right-0 h-40 w-40 sm:h-60 sm:w-60 bg-primary/10 rounded-full blur-[60px] sm:blur-[80px] -mr-20 -mt-20 sm:-mr-32 sm:-mt-32 group-hover/glossary:scale-110 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 relative z-10">
                            <BookOpen size={18} /> Словарь терминов
                        </div>
                        <div className="grid gap-5 sm:gap-6 relative z-10">
                            {article.glossary.map((entry, i) => (
                                <div key={i} className="space-y-1">
                                    <span className="text-base sm:text-lg font-black text-foreground block">{entry.term}</span>
                                    <p className="text-sm sm:text-base text-foreground/70 font-medium leading-relaxed">{entry.definition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mistakes */}
                {article.mistakes && article.mistakes.length > 0 && (
                    <div className="p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-red-500/5 border border-red-500/20 relative overflow-hidden group/mistake mt-12">
                        <div className="absolute top-0 right-0 h-40 w-40 sm:h-60 sm:w-60 bg-red-500/10 rounded-full blur-[60px] sm:blur-[80px] -mr-20 -mt-20 sm:-mr-32 sm:-mt-32 group-hover/mistake:scale-110 transition-transform duration-1000" />
                        <div className="flex items-center gap-3 text-red-500 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 relative z-10">
                            <XCircle size={18} /> Типичные ошибки новичков
                        </div>
                        <div className="grid gap-4 sm:gap-6 relative z-10 text-foreground">
                            {article.mistakes.map((mistake, i) => (
                                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/10 font-bold leading-relaxed flex flex-col sm:flex-row gap-3 sm:gap-4 italic shadow-sm text-sm sm:text-base">
                                    <div className="h-6 w-6 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-black">!</div>
                                    {mistake}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quiz */}
                {article.quiz && article.quiz.length > 0 && (
                    <QuizBlock
                        quiz={article.quiz}
                        currentSectionIdx={0}
                        answers={quizAnswers}
                        onAnswer={handleAnswer}
                    />
                )}
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

            {/* Share Buttons */}
            <ShareButtons
                title={article?.title || ''}
                description={article?.description || ''}
                url={`https://qacheatsheet.ru/articles/${slug}`}
            />

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
        </>
    );
}
