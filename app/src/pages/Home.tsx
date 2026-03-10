import { Link } from 'react-router-dom'
import { ArrowRight, Brain, GraduationCap, Network, Terminal, Shield, Sparkles, Briefcase, LucideIcon, ChevronRight, BookOpen } from 'lucide-react'
import { useMiniArticles } from '../hooks/useMiniArticles'
import { SEO } from '../components/seo/SEO'

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
    { href: '/roadmap/databases',      icon: Sparkles,      color: 'text-pink-400',    bgColor: 'bg-pink-400/10',    title: 'Базы данных',      tag: 'SQL' },
    { href: '/roadmap/career',         icon: Briefcase,     color: 'text-teal-400',    bgColor: 'bg-teal-400/10',    title: 'Карьера',          tag: 'Работа' },
]

export function Home() {
    const { articles } = useMiniArticles()

    return (
        <>
            <SEO
                title="QA CheatSheet | Шпаргалка для тестировщика"
                description="Полная база знаний по QA и тестированию: SQL, API, автоматизация, безопасность, карьера. Статьи, гайды и практические советы для QA инженеров из России и СНГ."
                image="https://qacheatsheet.ru/og-image.png"
                url="https://qacheatsheet.ru"
                keywords="QA, тестирование, SQL, API, автоматизация, безопасность, инженер по тестированию"
            />
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
        </>
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

function MiniArticleCard({ title, reading_time, slug }: MiniArticleCardProps) {
    const href = slug ? `/articles/${slug}` : '/articles'

    return (
        <Link to={href} className="volumetric group flex flex-col justify-between rounded-2xl p-5 transition-all cursor-pointer overflow-hidden hover:scale-[1.03]">
            <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl text-primary bg-primary/10 shadow-inner">
                    <BookOpen size={22} className="stroke-[2]" />
                </div>
                <h3 className="text-base font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-3">
                    {title}
                </h3>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{reading_time}</span>
                <div className="h-7 w-7 rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </Link>
    )
}

/* ── Empty placeholder card ── */
function EmptyMiniCard() {
    return (
        <div className="volumetric flex flex-col justify-between rounded-2xl p-5 opacity-40 pointer-events-none">
            <div className="space-y-3">
                <div className="h-11 w-11 rounded-xl bg-primary/10" />
                <div className="h-3 w-full rounded-full bg-foreground/10" />
                <div className="h-3 w-3/4 rounded-full bg-foreground/10" />
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="h-2 w-16 rounded-full bg-foreground/10" />
                <div className="h-7 w-7 rounded-lg bg-background/50" />
            </div>
        </div>
    )
}
