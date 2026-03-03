import { useParams, Navigate, Link } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { BookOpen, ArrowLeft, XCircle, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { QuizBlock } from '../components/QuizBlock';

// Микротипографика по дизайн-коду
const formatMicrotypography = (text: string) => {
    let result = text;
    // Французские кавычки
    result = result.replace(/"([^"]*)"/g, '«$1»');
    // Длинное тире
    result = result.replace(/ - /g, ' — ');
    // Неразрывные пробелы перед предлогами
    result = result.replace(/(^|\s)(а|и|в|к|с|у|о|по|из|на|от|до|за|со|об)\s/gi, '$1$2\u00A0');
    return result;
};

// Helper to safely format microtypography on text nodes
const formatChildren = (children: React.ReactNode): React.ReactNode => {
    if (typeof children === 'string') {
        return formatMicrotypography(children);
    }
    if (Array.isArray(children)) {
        return children.map((child, i) => <React.Fragment key={i}>{formatChildren(child)}</React.Fragment>);
    }
    return children;
};

export function RoadmapPage() {
    const { id, sectionIdx } = useParams<{ id: string; sectionIdx?: string }>();
    const data = id ? roadmapData[id as keyof typeof roadmapData] : null;
    const [answers, setAnswers] = useState<Record<string, number>>({});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, sectionIdx]);

    if (!data) {
        return <Navigate to="/" />;
    }

    const currentSectionIdx = sectionIdx !== undefined ? parseInt(sectionIdx) : null;
    const isDetailView = currentSectionIdx !== null && !isNaN(currentSectionIdx) && data.sections[currentSectionIdx];

    const handleAnswer = (sIdx: number, qIdx: number, oIdx: number) => {
        const key = `${sIdx}-${qIdx}`;
        if (answers[key] !== undefined) return;
        setAnswers(prev => ({ ...prev, [key]: oIdx }));
    };

    if (!isDetailView) {
        // MODULE OVERVIEW (Card Grid)
        return (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 text-center md:text-left">
                    <Link to="/">
                        <button className="volumetric flex h-14 w-14 items-center justify-center rounded-2xl text-primary bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                            <ArrowLeft size={24} className="stroke-[2.5]" />
                        </button>
                    </Link>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.25em]">Раздел</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/30 to-transparent lg:w-32 hidden md:block" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-foreground">{data.title}</h1>
                        <p className="text-lg text-foreground font-medium leading-relaxed max-w-2xl">{data.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.sections.map((section: any, idx: number) => {
                        // Находим первый абзац текста для краткого описания (пропускаем картинки и заголовки)
                        const description = section.content.find((t: string) =>
                            t && typeof t === 'string' && !t.startsWith('!') && !t.startsWith('#')
                        ) || section.content[0];

                        return (
                            <Link
                                key={idx}
                                to={`/roadmap/${id}/${idx}`}
                                className="group block"
                            >
                                <div className="glass h-full rounded-[2.5rem] p-3 transition-all duration-300 hover:scale-[1.02] border border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">
                                    <div className="h-full rounded-[2.2rem] bg-background/40 p-8 flex flex-col items-start space-y-4 shadow-inner shadow-white/5 overflow-hidden relative">
                                        <h2 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors pr-10">
                                            {section.title}
                                        </h2>

                                        <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3 flex-1">
                                            {description}
                                        </p>

                                        <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.2em] pt-4">
                                            Подробнее <ChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ARTICLE DETAIL VIEW
    const section = data.sections[currentSectionIdx as number];

    return (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Breadcrumbs / Back */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 px-2 sm:px-6">
                <Link to={`/roadmap/${id}`}>
                    <button className="volumetric flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-primary bg-background/50 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer">
                        <ArrowLeft size={24} className="stroke-[2.5] w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </Link>
                <div className="space-y-3 sm:space-y-4 w-full">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">{data.title}</span>
                        <ChevronRight size={12} className="text-muted-foreground/30 hidden sm:block" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">Статья {currentSectionIdx as number + 1}</span>
                    </div>
                    <h1 className="text-[39px] font-bold tracking-tight text-foreground leading-[1.2] max-w-3xl text-left">{formatMicrotypography(section.title)}</h1>
                </div>
            </div>

            <div className="mx-auto mt-8 transition-all">
                <div className="space-y-10 sm:space-y-12">
                    {/* Image */}
                    {section.image && (
                        <div className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] flex justify-center items-center">
                            <img src={section.image} alt={section.title} className="w-full h-auto max-h-[700px] object-contain transition-transform duration-1000 group-hover:scale-[1.01]" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="article-content">
                        <div className="flex flex-col space-y-6">
                            <ReactMarkdown>
                                {section.content.join('\n\n')}
                            </ReactMarkdown>
                        </div>

                        {/* Glossary Block */}
                        {section.glossary && section.glossary.length > 0 && (
                            <div className="p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden group/glossary mt-12">
                                <div className="absolute top-0 right-0 p-10 h-40 w-40 sm:h-60 sm:w-60 bg-primary/10 rounded-full blur-[60px] sm:blur-[80px] -mr-20 -mt-20 sm:-mr-32 sm:-mt-32 group-hover/glossary:scale-110 transition-transform duration-1000" />
                                <div className="flex items-center gap-3 text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 relative z-10">
                                    <BookOpen size={18} className="sm:w-5 sm:h-5" /> Словарь терминов
                                </div>
                                <div className="grid gap-5 sm:gap-6 relative z-10">
                                    {section.glossary.map((term: any, i: number) => (
                                        <div key={i} className="space-y-1">
                                            <span className="text-base sm:text-lg font-black text-foreground block">{term.term}</span>
                                            <p className="text-sm sm:text-base text-foreground/70 font-medium leading-relaxed">{term.definition}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mistakes Block */}
                        {section.mistakes && section.mistakes.length > 0 && (
                            <div className="p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-red-500/5 border border-red-500/20 relative overflow-hidden group/mistake mt-12">
                                <div className="absolute top-0 right-0 p-10 h-40 w-40 sm:h-60 sm:w-60 bg-red-500/10 rounded-full blur-[60px] sm:blur-[80px] -mr-20 -mt-20 sm:-mr-32 sm:-mt-32 group-hover/mistake:scale-110 transition-transform duration-1000" />
                                <div className="flex items-center gap-3 text-red-500 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6 sm:mb-8 relative z-10">
                                    <XCircle size={18} className="sm:w-5 sm:h-5" /> Типичные ошибки новичков
                                </div>
                                <div className="grid gap-4 sm:gap-6 relative z-10 text-foreground">
                                    {section.mistakes.map((mistake: string, i: number) => (
                                        <div key={i} className="p-4 sm:p-5 rounded-2xl bg-red-500/10 border border-red-500/10 font-bold leading-relaxed flex flex-col sm:flex-row gap-3 sm:gap-4 italic shadow-sm text-sm sm:text-base">
                                            <div className="h-6 w-6 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-[10px] font-black">!</div>
                                            {mistake}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quiz Block */}
                        {section.quiz && section.quiz.length > 0 && (
                            <QuizBlock
                                quiz={section.quiz}
                                currentSectionIdx={currentSectionIdx as number}
                                answers={answers}
                                onAnswer={handleAnswer}
                            />
                        )}
                    </div>
                </div>
            </div>

            <footer className="pt-20 mt-20 border-t border-white/10 flex flex-col items-center gap-10 text-center px-4">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.4em]">Источники</span>
                    <p className="text-sm text-foreground font-black tracking-tight bg-muted/30 px-8 py-3 rounded-full border border-white/5 shadow-inner leading-relaxed">
                        {data.source}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <Link to={`/roadmap/${id}`} className="volumetric bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(0,186,149,0.3)]">
                        Вернуться к списку статей
                    </Link>
                    {currentSectionIdx as number < data.sections.length - 1 && (
                        <Link to={`/roadmap/${id}/${(currentSectionIdx as number) + 1}`} className="volumetric bg-foreground text-background px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                            Следующая статья
                        </Link>
                    )}
                </div>
            </footer>
        </div>
    );
}
