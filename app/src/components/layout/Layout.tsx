import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Home as HomeIcon, CheckCircle, Bug, FileCheck, Bot, Braces, Terminal, RefreshCw, Gauge } from 'lucide-react'

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans transition-colors duration-200">
            <Header />
            <div className="flex flex-1">
                <aside className="hidden w-64 flex-col border-r border-border bg-muted/10 lg:flex h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto">
                    <div className="flex flex-col p-4 gap-6">
                        <div className="rounded-xl bg-background p-4 border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-muted-foreground">Ваш прогресс</span>
                                <span className="text-xs font-bold text-primary">35%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                            <p className="mt-2 text-[10px] text-muted-foreground">3 из 8 тем изучено</p>
                        </div>

                        <div>
                            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Основные концепции</h3>
                            <nav className="flex flex-col gap-1">
                                <a className="flex items-center gap-3 rounded-lg bg-primary/20 px-3 py-2 text-sm font-medium text-primary transition-colors border-l-2 border-primary" href="#">
                                    <HomeIcon size={18} />
                                    Обзор
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/basics">
                                    <CheckCircle size={18} />
                                    Базовые понятия
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/types">
                                    <Bug size={18} />
                                    Типы тестирования
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/levels">
                                    <FileCheck size={18} />
                                    Уровни тестирования
                                </a>
                            </nav>
                        </div>

                        <div>
                            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Автоматизация и Инструменты</h3>
                            <nav className="flex flex-col gap-1">
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/tools">
                                    <Bot size={18} />
                                    Инструменты (Tools)
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/code">
                                    <Braces size={18} />
                                    Примеры кода API
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="/code">
                                    <Terminal size={18} />
                                    Cypress UI Тесты
                                </a>
                            </nav>
                        </div>

                        <div>
                            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Процессы</h3>
                            <nav className="flex flex-col gap-1">
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="#">
                                    <RefreshCw size={18} />
                                    Agile / Scrum
                                </a>
                                <a className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-border hover:text-foreground transition-colors" href="#">
                                    <Gauge size={18} />
                                    Производительность
                                </a>
                            </nav>
                        </div>

                        <div className="mt-auto rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-4 border border-primary/20">
                            <p className="text-sm font-bold text-foreground mb-1">Новичок в QA?</p>
                            <p className="text-xs text-muted-foreground mb-3">Скачайте наш полный PDF-гайд для начинающих.</p>
                            <button className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">Скачать сейчас</button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-x-hidden p-6 lg:p-10 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
