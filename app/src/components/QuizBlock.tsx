import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizBlockProps {
    quiz: QuizQuestion[];
    currentSectionIdx: number;
    answers: Record<string, number>;
    onAnswer: (sIdx: number, qIdx: number, oIdx: number) => void;
}

export function QuizBlock({ quiz, currentSectionIdx, answers, onAnswer }: QuizBlockProps) {
    if (!quiz || quiz.length === 0) return null;

    return (
        <div className="space-y-6 sm:space-y-8 pt-10 border-t border-white/5">
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4">
                <HelpCircle size={16} /> Проверка знаний: Квиз
            </div>
            <div className="grid gap-8 sm:gap-10">
                {quiz.map((q, qIdx) => {
                    const key = `${currentSectionIdx}-${qIdx}`;
                    const selectedIdx = answers[key];
                    const isAnswered = selectedIdx !== undefined;

                    return (
                        <div key={qIdx} className="space-y-4 sm:space-y-6">
                            <h5 className="text-lg sm:text-xl font-black text-foreground pr-4 sm:pr-8 leading-snug">{qIdx + 1}. {q.question}</h5>
                            <div className="grid gap-1 sm:gap-1.5">
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
                                            onClick={() => onAnswer(currentSectionIdx, qIdx, oIdx)}
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
    );
}

