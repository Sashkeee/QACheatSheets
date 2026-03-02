import { ArrowRight, Triangle, Bug, Globe, Database, Zap, Shield, Sparkles } from 'lucide-react'

export function Home() {
    return (
        <div className="mx-auto max-w-6xl w-full space-y-16 animate-in fade-in duration-1000">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[3rem] glass p-1 lg:p-2 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative rounded-[2.5rem] bg-background/40 p-10 lg:p-14 lg:flex lg:items-center lg:gap-12">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">
                            <Sparkles size={12} />
                            Обновлено: Март 2026
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-tight italic">
                                QA CHEAT<br /><span className="text-primary not-italic">SHEET</span>
                            </h1>
                            <p className="text-xl text-muted-foreground/90 font-medium leading-relaxed max-w-xl">
                                Твой интерактивный навигатор по миру тестирования. Глубокие знания, упакованные в современные аналоги и практические кейсы.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <a href="/roadmap/basics" className="h-14 px-10 inline-flex items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all">
                                Начать обучение
                            </a>
                            <button className="volumetric h-14 px-10 inline-flex items-center justify-center rounded-2xl font-black text-sm uppercase tracking-widest text-foreground cursor-pointer">
                                Карта развития
                            </button>
                        </div>
                    </div>
                    <div className="mt-10 lg:mt-0 lg:w-2/5 relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl" />
                        <div className="relative aspect-square w-full rounded-3xl glass p-4 rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="h-full w-full rounded-2xl bg-cover bg-center shadow-2xl"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop')" }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-1.5 w-8 rounded-full bg-primary" />
                    <h2 className="text-2xl font-black text-foreground tracking-tight">База знаний</h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickCard
                        href="/roadmap/types"
                        icon={Triangle}
                        color="text-blue-500"
                        bgColor="bg-blue-500/10"
                        title="Пирамида тестов"
                        desc="Глубокий разбор Unit, Integration и E2E по стандартам Google."
                        tag="Теория"
                    />
                    <QuickCard
                        href="/roadmap/test-design"
                        icon={Bug}
                        color="text-red-500"
                        bgColor="bg-red-500/10"
                        title="Тест-дизайн"
                        desc="Мастерство EP, BVA и Pairwise на живых примерах."
                        tag="Практика"
                    />
                    <QuickCard
                        href="/roadmap/api"
                        icon={Globe}
                        color="text-emerald-500"
                        bgColor="bg-emerald-500/10"
                        title="REST API"
                        desc="Все о методах, статус-кодах и HTTP протоколе."
                        tag="Гайд"
                    />
                    <QuickCard
                        href="/roadmap/databases"
                        icon={Database}
                        color="text-amber-500"
                        bgColor="bg-amber-500/10"
                        title="SQL Основы"
                        desc="SELECT, JOIN и агрегаты — то, что реально нужно QA."
                        tag="Шпаргалка"
                    />
                    <QuickCard
                        href="/roadmap/infrastructure"
                        icon={Zap}
                        color="text-purple-500"
                        bgColor="bg-purple-500/10"
                        title="Инфраструктура"
                        desc="Docker, Git и CI/CD: база для современного инженера."
                        tag="DevOps"
                    />
                    <QuickCard
                        href="/roadmap/security"
                        icon={Shield}
                        color="text-rose-500"
                        bgColor="bg-rose-500/10"
                        title="Security"
                        desc="Основы пентеста и OWASP Top 10 для мануальщиков."
                        tag="Важно"
                    />
                </div>
            </div>

            {/* Extra Info Grid */}
            <div className="grid gap-8 lg:grid-cols-2 pb-16 px-2">
                <div className="glass rounded-[2rem] p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Мини-статьи</h3>
                        <a className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" href="#">Все статьи</a>
                    </div>
                    <div className="flex flex-col gap-6">
                        <ArticleItem
                            title="Shift Left Testing"
                            desc="Почему раннее тестирование экономит бюджет."
                            time="7 мин."
                            img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                        />
                        <ArticleItem
                            title="Playwright vs Cypress"
                            desc="Что выбрать для автотестов в 2026 году?"
                            time="12 мин."
                            img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
                        />
                    </div>
                </div>

                <div className="glass rounded-[2rem] p-8 space-y-8">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Топ Инструментов</h3>
                        <a className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" href="#">Каталог</a>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {['Jira', 'Selenium', 'Postman', 'Jenkins', 'Docker', 'K6'].map(tool => (
                            <span key={tool} className="volumetric px-5 py-2 rounded-xl text-xs font-bold text-foreground cursor-default">
                                {tool}
                            </span>
                        ))}
                    </div>
                    <div className="relative rounded-3xl bg-primary p-8 overflow-hidden group/card shadow-2xl shadow-primary/20">
                        <div className="absolute top-0 right-0 p-12 h-40 w-40 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover/card:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-2">
                            <p className="text-[10px] font-black text-primary-foreground/60 uppercase tracking-[0.3em]">Инструмент месяца</p>
                            <h4 className="text-3xl font-black text-primary-foreground italic tracking-tight">Playwright</h4>
                            <p className="text-sm text-primary-foreground/80 font-medium">Молниеносный фреймворк для E2E тестирования.</p>
                            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-2.5 text-xs font-black text-primary uppercase tracking-widest shadow-xl shadow-black/5 hover:translate-x-1 transition-transform">
                                Читать гайд <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickCard({ href, icon: Icon, color, bgColor, title, desc, tag }: any) {
    return (
        <a href={href} className="volumetric group relative flex flex-col justify-between rounded-3xl p-6 transition-all cursor-pointer overflow-hidden">
            <div className="space-y-4 relative z-10">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color} ${bgColor} shadow-inner`}>
                    <Icon size={26} className="stroke-[2.5]" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground/80 font-medium line-clamp-2 leading-relaxed">{desc}</p>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{tag}</span>
                <div className="h-8 w-8 rounded-lg bg-background/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </a>
    )
}

function ArticleItem({ title, desc, time, img }: any) {
    return (
        <a className="flex gap-5 group items-center p-2 rounded-2xl hover:bg-white/5 transition-colors" href="#">
            <div className="h-20 w-24 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <img src={img} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
            </div>
            <div className="flex flex-col">
                <h4 className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight italic">{title}</h4>
                <p className="text-xs text-muted-foreground/70 line-clamp-1 font-medium mt-1">{desc}</p>
                <span className="mt-2 text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{time} чтение</span>
            </div>
        </a>
    )
}
