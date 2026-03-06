import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../../stores/theme'
import { useEffect, useState } from 'react'
import { Terminal, GraduationCap, ListChecks, Layers, Database, Network, Shield, GitBranch, Brain, Briefcase, FileText, Sun, Moon, User, Search, Menu, X } from 'lucide-react'
import { AIChatbot } from '../chat/AIChatbot'

const navGroups = [
    {
        title: "Введение",
        items: [
            { icon: Brain, label: "Начало. Основы QA", href: "/roadmap/intro-qa" },
            { icon: FileText, label: "Статьи", href: "/articles?category=intro" },
        ]
    },
    {
        title: "Основы & Теория",
        items: [
            { icon: GraduationCap, label: "Базовые понятия", href: "/roadmap/basics" },
            { icon: ListChecks, label: "Тест-дизайн & Доки", href: "/roadmap/test-design" },
            { icon: Layers, label: "Виды & Уровни", href: "/roadmap/types" },
            { icon: FileText, label: "Статьи", href: "/articles?category=basics" },
        ]
    },
    {
        title: "Технологии",
        items: [
            { icon: Database, label: "SQL & Базы данных", href: "/roadmap/databases" },
            { icon: Network, label: "API & REST", href: "/roadmap/api" },
            { icon: Terminal, label: "Автоматизация", href: "/roadmap/automation" },
            { icon: FileText, label: "Статьи", href: "/articles?category=tech" },
        ]
    },
    {
        title: "Продвинутое",
        items: [
            { icon: Shield, label: "Security & Perf", href: "/roadmap/security" },
            { icon: GitBranch, label: "Инфраструктура", href: "/roadmap/infrastructure" },
            { icon: Brain, label: "AI в Тестировании", href: "/roadmap/ai" },
            { icon: FileText, label: "Статьи", href: "/articles?category=advanced" },
        ]
    },
    {
        title: "Карьера",
        items: [
            { icon: Briefcase, label: "Подготовка к работе", href: "/roadmap/career" },
            { icon: FileText, label: "Статьи", href: "/articles?category=career" }
        ]
    }
]

export function Layout() {
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Закрывать меню при смене пути
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            root.classList.add(systemTheme)
        } else {
            root.classList.add(theme)
        }
    }, [theme])

    return (
        <div className="min-h-screen flex mesh-bg text-foreground antialiased font-sans transition-colors duration-200">
            {/* Mobile Sidebar Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar with Logo */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-80 flex-col glass border-r border-white/10 p-5 h-screen overflow-y-auto shrink-0 transition-transform duration-300 lg:sticky lg:top-0 lg:flex lg:translate-x-0 scrollbar-hide flex ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-3 text-foreground cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <FileText size={22} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black leading-none tracking-tight text-foreground">QA CHEAT</h2>
                            <span className="text-[10px] font-bold text-primary tracking-[0.4em] uppercase">Sheet</span>
                        </div>
                    </div>
                    {/* Close button for mobile inside sidebar */}
                    <button
                        className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-foreground glass border border-white/10 hover:bg-background/50 active:scale-95 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {navGroups.map((group) => (
                        <div key={group.title}>
                            <div className="mb-3 flex items-center gap-2 px-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                                    {group.title}
                                </h3>
                            </div>
                            <nav className="flex flex-col gap-1.5">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.label}
                                        className="volumetric flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all group"
                                        to={item.href}
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                                            <item.icon size={18} className="stroke-[1.5]" />
                                        </div>
                                        <span className="leading-tight text-[13px]">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0">
                {/* Floating Top Controls */}
                <div className="absolute top-4 right-4 sm:top-5 sm:right-8 z-30 flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden volumetric flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-foreground glass border border-white/10 shadow-sm"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="hidden md:flex items-center rounded-2xl bg-background/30 glass border border-white/10 px-4 py-2 transition-all focus-within:bg-background/60 focus-within:ring-2 focus-within:ring-primary/20 w-64 lg:w-80 shadow-sm">
                        <Search className="text-muted-foreground/60" size={16} />
                        <input className="ml-3 w-full bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none font-medium" placeholder="Поиск..." />
                    </div>
                    <button onClick={toggleTheme} className="volumetric flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-foreground glass border border-white/10 shadow-sm">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="volumetric flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-foreground glass border border-white/10 shadow-sm">
                        <User size={18} />
                    </button>
                </div>

                <main className="flex-1 p-4 pt-16 sm:p-8 lg:p-12 xl:px-16 xl:pb-16 xl:pt-20 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="glass rounded-[2rem] sm:rounded-[3.5rem] p-5 sm:p-8 lg:p-12 xl:p-16 min-h-full transition-all duration-500 shadow-2xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Глобальный AI Помощник */}
            <AIChatbot />
        </div>
    )
}
