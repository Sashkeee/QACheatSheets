import { Link } from 'react-router-dom'
import { ArrowRight, Brain, GraduationCap, Network, Terminal, Shield, GitBranch, Sparkles, Briefcase, LucideIcon, ChevronRight } from 'lucide-react'
import { useMiniArticles } from '../hooks/useMiniArticles'

interface KnowledgeSection {
    href: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    title: string;
    tag: string;
}

const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
    { href: '/roadmap/intro-qa',       icon: Brain,         color: 'text-sky-400',     bgColor: 'bg-sky-400/10',     title: 'Основы QA',        tag: 'Старт' },
    { href: '/roadmap/basics',         icon: GraduationCap, color: 'text-violet-400',  bgColor: 'bg-violet-400/10',  title: 'Теория',           tag: 'База' },
    { href: '/roadmap/api',            icon: Network,       color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', title: 'API & REST',       tag: 'Гайд' },
    { href: '/roadmap/automation',     icon: Terminal,      color: 'text-amber-400',   bgColor: 'bg-amber-400/10',   title: 'Автоматизация',    tag: 'Код' },
    { href: '/roadmap/security',       icon: Shield,        color: 'text-rose-400',    bgColor: 'bg-rose-400/10',    title: 'Security',         tag: 'Важно' },
    { href: '/roadmap/infrastructure', icon: GitBranch,     color: 'text-purple-400',  bgColor: 'bg-purple-400/10',  title: 'Инфраструктура',   tag: 'DevOps' },
    { href: '/roadmap/ai',             icon: Sparkles,      color: 'text-pink-400',    bgColor: 'bg-pink-400/10',    title: 'AI в QA',          tag: 'Будущее' },
    { href: '/roadmap/career',         icon: Briefcase,     color: 'text-teal-400',    bgColor: 'bg-teal-400/10',    title: 'Карьера',          tag: 'Работа' },
]

export function Home() {
    const { articles } = useMiniArticles()

    return (
        <div className="mx-auto max-w-6xl w-full space-y-20 animate-in fade-in duration-1000 pb-20">

            {/* ── Hero Logo ── */}
            <div className="flex flex-col items-center justify-center pt-6 pb-2">
                <img
                    src="/qa-logo.webp"
                    alt="QA CheatSheet"
                    className="w-64 sm:w-80 lg:w-96 h-auto drop-shadow-2xl"
                    loading="eager"
                    decoding="async"
                />
            </div>

            {/* ── База знаний ── */}
            <section className="space-y-8">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-1 w-12 rounded-full bg-primary mb-1" />
                    <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                        База знаний
                    </h2>
                    <p className="text-muted-foreground font-medium">
                        Выбери раздел и начни изучение
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {KNOWLEDGE_SECTIONS.map((section) => (
                        <KnowledgeCard key={section.href} {...section} />
                    ))}
                </div>
            </section>

            {/* ── Мини-статьи ── */}
            <section className="space-y-8">
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <div className="h-1 w-12 rounded-full bg-primary" />
                        <h2 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                            Мини-статьи
                        </h2>
                    </div>
                    <Link
                        to="/articles"
                        className="flex items-center gap-1.5 text-primary text-xs font-black uppercase tracking-[0.2em] hover:gap-2.5 transition-all"
                    >
                        Все статьи <ChevronRight size={14} />
                    </Link>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {articles.length > 0 ? (
                        articles.slice(0, 4).map((article) => (
                            <MiniArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                description={article.description}
                                reading_time={article.reading_time}
                                slug={article.slug}
                            />
                        ))
                    ) : (
                        <>
                            <EmptyMiniCard />
                            <EmptyMiniCard />
                            <EmptyMiniCard />
                            <EmptyMiniCard />
                        </>
                    )}
                </div>
            </section>

        </div>
    )
}

/* ── Knowledge Card ── */
function KnowledgeCard({ href, icon: Icon, color, bgColor, title, tag }: KnowledgeSection) {
    return (
        <Link to={href} className="volumetric group flex flex-col justify-between rounded-2xl p-5 transition-all cursor-pointer overflow-hidden hover:scale-[1.03]">
            <div className="space-y-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} ${bgColor} shadow-inner`}>
                    <Icon size={22} className="stroke-[2]" />
                </div>
                <h3 className="text-base font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{tag}</span>
                <div className="h-7 w-7 rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </Link>
    )
}

/* ── Mini Article Card ── */
interface MiniArticleCardProps {
    id: string;
    title: string;
    description: string;
    reading_time: string;
    slug?: string;
}

function MiniArticleCard({ title, description, reading_time, slug }: MiniArticleCardProps) {
    const href = slug ? `/articles/${slug}` : '/articles'

    return (
        <Link to={href} className="group block">
            <div className="glass h-full rounded-[2rem] p-3 transition-all duration-300 hover:scale-[1.02] border border-white/5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
                <div className="h-full rounded-[1.7rem] bg-background/40 p-6 flex flex-col gap-3 shadow-inner shadow-white/5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {reading_time} чтение
                    </span>
                    <h3 className="text-base font-black tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3 flex-1">
                        {description}
                    </p>
                    <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-[0.2em] pt-1">
                        Читать <ChevronRight size={12} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

/* ── Empty placeholder card ── */
function EmptyMiniCard() {
    return (
        <div className="glass rounded-[2rem] p-3 border border-white/5 opacity-40">
            <div className="rounded-[1.7rem] bg-background/40 p-6 flex flex-col gap-3 h-44">
                <div className="h-2 w-16 rounded-full bg-primary/20" />
                <div className="h-3 w-full rounded-full bg-foreground/10" />
                <div className="h-3 w-3/4 rounded-full bg-foreground/10" />
                <div className="h-2 w-full rounded-full bg-foreground/5 mt-1" />
                <div className="h-2 w-2/3 rounded-full bg-foreground/5" />
            </div>
        </div>
    )
}
