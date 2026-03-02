import { useParams, Navigate } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function RoadmapPage() {
    const { id } = useParams<{ id: string }>();
    const data = id ? roadmapData[id] : null;

    if (!data) {
        return <Navigate to="/" />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-6">
                <a href="/">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <ArrowLeft size={18} />
                    </Button>
                </a>
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{data.title}</h1>
                    <p className="text-muted-foreground">{data.description}</p>
                </div>
            </div>

            <div className="grid gap-6">
                {data.sections.map((section, idx) => (
                    <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-colors">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BookOpen className="text-primary" size={20} />
                                {section.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {section.image && (
                                <div className="mb-6 overflow-hidden rounded-xl border border-border/50 shadow-inner">
                                    <img src={section.image} alt={section.title} className="w-full object-cover max-h-[400px]" />
                                </div>
                            )}
                            <ul className="space-y-3">
                                {section.content.map((item, i) => (
                                    <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {section.tips && section.tips.length > 0 && (
                                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                                        <AlertCircle size={14} />
                                        PRO Совет
                                    </div>
                                    {section.tips.map((tip, i) => (
                                        <p key={i} className="text-xs text-muted-foreground italic">
                                            "{tip}"
                                        </p>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <footer className="pt-8 border-t border-border/50 flex flex-col items-center gap-2">
                <p className="text-xs text-muted-foreground">
                    Источник материалов: <span className="text-foreground font-medium">{data.source}</span>
                </p>
                <div className="flex gap-4 mt-2">
                    <Button variant="ghost" className="text-xs text-muted-foreground">← Предыдущая тема</Button>
                    <Button variant="default" className="text-xs px-8">Следующая тема →</Button>
                </div>
            </footer>
        </div>
    );
}
