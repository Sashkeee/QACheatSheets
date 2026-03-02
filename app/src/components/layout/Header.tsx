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
        <header className="sticky top-4 z-50 flex items-center justify-between glass mx-4 lg:mx-8 px-6 py-3 rounded-2xl transition-all duration-300">
            <div className="flex items-center gap-12">
                <div className="flex items-center gap-3 text-foreground cursor-pointer group" onClick={() => navigate('/')}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                        <FileText size={24} className="stroke-[2.5]" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-black leading-none tracking-tight">QA CHEAT</h2>
                        <span className="text-[10px] font-bold text-primary tracking-[0.3em] uppercase">Sheet</span>
                    </div>
                </div>
                <label className="hidden md:flex flex-col min-w-[360px]">
                    <div className="flex w-full items-center rounded-xl bg-muted/20 border border-white/10 px-4 py-2.5 transition-all focus-within:bg-background/40 focus-within:ring-2 focus-within:ring-primary/30">
                        <Search className="text-muted-foreground/60" size={18} />
                        <input className="ml-3 w-full bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none font-medium" placeholder="Поиск тем, инструментов..." />
                        <div className="flex items-center gap-1 rounded-md border border-border bg-background/50 px-2 py-0.5 text-[10px] font-bold text-muted-foreground/70">
                            ⌘K
                        </div>
                    </div>
                </label>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="volumetric flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground">
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="h-6 w-[1px] bg-border mx-1" />
                <button className="volumetric flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground">
                    <User size={20} />
                </button>
                {/* Mobile menu button */}
                <button className="lg:hidden volumetric flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-foreground">
                    <Menu size={20} />
                </button>
                <button className="hidden lg:flex h-11 px-6 cursor-pointer items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0">
                    Стать PRO
                </button>
            </div>
        </header>
    )
}
