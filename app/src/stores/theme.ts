import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
    theme: 'dark' | 'light' | 'system'
    toggleTheme: () => void
    setTheme: (theme: 'dark' | 'light' | 'system') => void
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'theme-storage',
        }
    )
)
