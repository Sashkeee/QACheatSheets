import { useParams, Navigate, Link } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { BookOpen, ArrowLeft, XCircle, CheckCircle2, HelpCircle, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
                    {data.sections.map((section: any, idx: number) => (
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
                                        {section.content[0]}
                                    </p>

                                    <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-[0.2em] pt-4">
                                        Подробнее <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    }

    // ARTICLE DETAIL VIEW
    const section = data.sections[currentSectionIdx as number];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
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
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight max-w-4xl">{section.title}</h1>
                </div>
            </div>

            <div className="glass rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-3 lg:p-4 transition-all border border-white/5 mx-auto">
                <div className="rounded-[1.8rem] sm:rounded-[2.2rem] bg-background/40 p-5 sm:p-8 lg:p-10 space-y-10 sm:space-y-12 shadow-inner shadow-white/5 overflow-hidden">
                    {/* Image */}
                    {section.image && (
                        <div className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] flex justify-center items-center">
                            <img src={section.image} alt={section.title} className="w-full h-auto max-h-[700px] object-contain transition-transform duration-1000 group-hover:scale-[1.01]" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="space-y-12">
                        <div className="grid gap-8">
                            {section.content.map((item: string, i: number) => {
                                const trimmed = item.trim();
                                if (trimmed === "" || trimmed.startsWith("---")) return <div key={i} className="h-4" />;

                                // Image detection ![alt](src)
                                if (trimmed.startsWith("![") && trimmed.includes("](") && trimmed.endsWith(")")) {
                                    const alt = trimmed.match(/!\[(.*?)\]/)?.[1] || "Image";
                                    const src = trimmed.match(/\((.*?)\)/)?.[1] || "";
                                    return (
                                        <div key={i} className="my-10 rounded-[2rem] overflow-hidden border border-white/10 bg-black/20 flex justify-center items-center">
                                            <img src={src} alt={alt} className="w-full h-auto object-contain max-h-[600px] shadow-2xl" />
                                        </div>
                                    );
                                }

                                // Enhanced Header detection (Uppercase or starts with Number.)
                                const isHeader = i === 0 || /^\d+\./.test(trimmed) || (trimmed.length > 5 && !trimmed.includes(".") && /^[A-ZА-Я\s\d:.!?\-\/]+$/.test(trimmed));

                                if (isHeader) {
                                    return (
                                        <h4 key={i} className="text-xl sm:text-2xl font-black text-foreground mt-12 sm:mt-16 mb-4 sm:mb-6 tracking-tight flex items-center gap-4 group border-l-4 border-primary pl-4 sm:pl-6 leading-snug">
                                            <span className="flex-1">{trimmed}</span>
                                        </h4>
                                    );
                                }

                                // List item detection
                                const isListItem = trimmed.startsWith("•") || trimmed.startsWith("-") || /^\d+\)/.test(trimmed);

                                return (
                                    <div key={i} className={`relative group/line ${isListItem ? 'ml-4 sm:ml-6' : ''}`}>
                                        <div className="absolute -inset-y-3 -inset-x-3 sm:-inset-x-5 bg-primary/5 rounded-2xl scale-95 opacity-0 group-hover/line:scale-100 group-hover/line:opacity-100 transition-all duration-300 -z-10" />
                                        <div className="flex gap-3 sm:gap-4 font-medium leading-[1.6] sm:leading-[1.8] text-foreground/90 text-base sm:text-[1.1rem]">
                                            {isListItem ? (
                                                <div className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(0,186,149,0.5)]" />
                                            ) : null}
                                            <p className="flex-1 text-left">
                                                {isListItem ? (trimmed.startsWith("•") || trimmed.startsWith("-") ? trimmed.slice(1).trim() : trimmed) : (
                                                    // Handle bold text markers like **text** or simple emphasis
                                                    trimmed.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={index} className="font-black text-foreground">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return part;
                                                    })
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
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
                            <div className="space-y-6 sm:space-y-8 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4">
                                    <HelpCircle size={16} /> Проверка знаний: Квиз
                                </div>
                                <div className="grid gap-8 sm:gap-10">
                                    {section.quiz.map((q: any, qIdx: number) => {
                                        const key = `${currentSectionIdx}-${qIdx}`;
                                        const selectedIdx = answers[key];
                                        const isAnswered = selectedIdx !== undefined;

                                        return (
                                            <div key={qIdx} className="space-y-4 sm:space-y-6">
                                                <h5 className="text-lg sm:text-xl font-black text-foreground pr-4 sm:pr-8 leading-snug">{qIdx + 1}. {q.question}</h5>
                                                <div className="grid gap-2 sm:gap-3">
                                                    {q.options.map((option: string, oIdx: number) => {
                                                        const isCorrect = oIdx === q.correctAnswer;
                                                        const isSelected = selectedIdx === oIdx;
                                                        let bgClass = "bg-muted/30 border-white/5 hover:bg-muted/50";
                                                        let icon = null;
                                                        if (isAnswered) {
                                                            if (isCorrect) {
                                                                bgClass = "bg-emerald-500/20 border-emerald-500/30 text-emerald-400";
                                                                icon = <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" />;
                                                            } else if (isSelected) {
                                                                bgClass = "bg-red-500/20 border-red-500/30 text-red-400";
                                                                icon = <XCircle size={16} className="sm:w-[18px] sm:h-[18px]" />;
                                                            } else {
                                                                bgClass = "bg-muted/10 border-white/5 opacity-50";
                                                            }
                                                        }
                                                        return (
                                                            <button
                                                                key={oIdx}
                                                                disabled={isAnswered}
                                                                onClick={() => handleAnswer(currentSectionIdx as number, qIdx, oIdx)}
                                                                className={`w-full text-left p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-between gap-3 sm:gap-4 font-bold text-[13px] sm:text-[15px] ${bgClass} ${!isAnswered ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'cursor-default'}`}
                                                            >
                                                                <div className="flex items-center gap-3 sm:gap-4">
                                                                    <span className={`h-6 w-6 sm:h-8 sm:w-8 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-black shadow-inner ${isSelected ? 'bg-foreground text-background' : 'bg-background/50 text-foreground/60'}`}>
                                                                        {String.fromCharCode(65 + oIdx)}
                                                                    </span>
                                                                    {option}
                                                                </div>
                                                                {icon}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {isAnswered && (
                                                    <div className={`text-xs sm:text-sm font-black p-3 sm:p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500 ${selectedIdx === q.correctAnswer ? 'text-emerald-400/80 bg-emerald-500/5' : 'text-red-400/80 bg-red-500/5'}`}>
                                                        {selectedIdx === q.correctAnswer ? <>🎯 Великолепно! Правильно.</> : <>💡 Не совсем. Ответ: {String.fromCharCode(65 + q.correctAnswer)}.</>}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
