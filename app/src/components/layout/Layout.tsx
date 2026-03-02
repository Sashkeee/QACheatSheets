import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Terminal, GraduationCap, ListChecks, Layers, Database, Network, Shield, GitBranch, Brain, Briefcase } from 'lucide-react'

const navGroups = [
    {
        title: "Основы & Теория",
        items: [
            { icon: GraduationCap, label: "Базовые понятия", href: "/roadmap/basics" },
            { icon: ListChecks, label: "Тест-дизайн & Доки", href: "/roadmap/test-design" },
            { icon: Layers, label: "Виды & Уровни", href: "/roadmap/types" },
        ]
    },
    {
        title: "Технологии",
        items: [
            { icon: Database, label: "SQL & Базы данных", href: "/roadmap/databases" },
            { icon: Network, label: "API & REST", href: "/roadmap/api" },
            { icon: Terminal, label: "Автоматизация", href: "/roadmap/automation" },
        ]
    },
    {
        title: "Продвинутое",
        items: [
            { icon: Shield, label: "Security & Perf", href: "/roadmap/security" },
            { icon: GitBranch, label: "Инфраструктура", href: "/roadmap/infrastructure" },
            { icon: Brain, label: "AI в Тестировании", href: "/roadmap/ai" },
        ]
    },
    {
        title: "Карьера",
        items: [
            { icon: Briefcase, label: "Подготовка к работе", href: "/roadmap/career" },
        ]
    }
]

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans transition-colors duration-200">
            <Header />
            <div className="flex flex-1">
                <aside className="hidden w-64 flex-col border-r border-border bg-muted/10 lg:flex h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
                    <div className="flex flex-col p-4 gap-6">

                        {navGroups.map((group) => (
                            <div key={group.title}>
                                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h3>
                                <nav className="flex flex-col gap-1">
                                    {group.items.map((item) => (
                                        <a
                                            key={item.label}
                                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors"
                                            href={item.href}
                                        >
                                            <item.icon size={18} />
                                            {item.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="flex-1 overflow-x-hidden p-6 lg:p-10 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
