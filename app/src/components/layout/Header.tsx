import { FileText, Search, Sun, Moon, User, Menu } from 'lucide-react'
import { useTheme } from '../../stores/theme'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Header() {
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

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
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4 lg:px-10">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-foreground cursor-pointer" onClick={() => navigate('/')}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-xl font-bold leading-tight tracking-tight">QA CheatSheet</h2>
                </div>
                <label className="hidden md:flex flex-col min-w-[320px]">
                    <div className="flex w-full items-center rounded-lg bg-muted/30 border border-border px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary/50">
                        <Search className="text-muted-foreground" size={20} />
                        <input className="ml-2 w-full bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none" placeholder="Поиск тем, инструментов или концепций..." />
                        <div className="flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                            ⌘K
                        </div>
                    </div>
                </label>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={toggleTheme} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted/30 text-foreground hover:bg-border transition-colors border border-border">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted/30 text-foreground hover:bg-border transition-colors border border-border">
                    <User size={20} />
                </button>
                {/* Mobile menu button */}
                <button className="lg:hidden flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted/30 text-foreground hover:bg-border transition-colors border border-border">
                    <Menu size={20} />
                </button>
                <button className="hidden lg:flex h-10 px-4 cursor-pointer items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-colors">
                    PRO Доступ
                </button>
            </div>
        </header>
    )
}
