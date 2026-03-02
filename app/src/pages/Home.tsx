import { ArrowRight, Triangle, Bug, Globe, Users, Database, Smartphone } from 'lucide-react'

export function Home() {
    return (
        <div className="mx-auto max-w-6xl w-full">
            <div className="mb-10 rounded-2xl bg-muted/20 p-6 shadow-sm ring-1 ring-border lg:flex lg:items-center lg:gap-8 lg:p-8">
                <div className="flex-1">
                    <div className="mb-4 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                        v2.4 Обновлено
                    </div>
                    <h1 className="mb-3 text-3xl font-bold text-foreground lg:text-4xl">Основные темы QA</h1>
                    <p className="mb-6 text-lg text-muted-foreground">Курируемая коллекция быстрых справок, чек-листов и лучших практик для современного инженера по обеспечению качества.</p>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
                            Начать обучение
                        </button>
                        <button className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted/50">
                            Карта развития
                        </button>
                    </div>
                </div>
                <div className="mt-6 lg:mt-0 lg:w-1/3">
                    <div className="aspect-video w-full rounded-xl bg-cover bg-center shadow-inner opacity-80"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOD6WVT5my0-2OD25ClDJnIbBR2f_pvvXqTgM-S1QLRZEW0xnLTL-_GMwXOngbumQqLH2lE3Rzwb6-ct-VCwqPBC8ZCIccWo9L6ClBjW3H91fbOpLGUVhDdIB9M8d3KBMHgmgX2YP9XZLhbIZwkPFsamDFSUl6zHrQVRZ_sYDvrTdU0RydOXmelg8fCDGUp8MVuKhwKWvSIUxnoL_VcKpeMWRGMWk__ZSwqvH5MLwDqoEEStCfo4fZzVhaDJp1AvqWlz5xhaaVP9k')" }}></div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">Карточки быстрой справки</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-blue-500 bg-blue-500/20">
                                <Triangle size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">Пирамида тестов</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Понимание соотношения Unit, Integration и E2E тестов.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Концепция</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-red-500 bg-red-500/20">
                                <Bug size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">Баг-репорт</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Стандартный шаблон для качественных отчетов об ошибках: шаги, результат и т.д.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Шаблон</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-green-500 bg-green-500/20">
                                <Globe size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">Коды ответов HTTP</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Быстрый поиск ошибок серий 200, 400 и 500.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Шпаргалка</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-purple-500 bg-purple-500/20">
                                <Users size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">Церемонии Agile</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Scrum ритуалы, планирование спринта и гайды по ретроспективе.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Процесс</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-orange-500 bg-orange-500/20">
                                <Database size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">SQL Основы</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Основные запросы для валидации баз данных: SELECT, JOIN, WHERE.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Техническое</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                    <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 cursor-pointer">
                        <div className="absolute top-4 right-4 z-10">
                            <input className="h-5 w-5 rounded border-muted bg-muted text-primary focus:ring-primary focus:ring-offset-background" title="Отметить как изученное" type="checkbox" />
                        </div>
                        <div>
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-teal-500 bg-teal-500/20">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="mb-1 text-lg font-bold text-foreground">Мобильные эвристики</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">Чек-лист для тестирования на iOS и Android: прерывания, сети и т.д.</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                            <span className="text-xs font-medium text-muted-foreground">Чек-лист</span>
                            <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" size={16} />
                        </div>
                    </div>

                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 pb-16">
                <div className="rounded-xl bg-muted/20 border border-border p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">Последние статьи</h3>
                        <a className="text-sm font-medium text-primary hover:underline" href="#">Все статьи</a>
                    </div>
                    <div className="flex flex-col gap-4">
                        <a className="flex gap-4 group" href="#">
                            <div className="h-20 w-28 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQE08VePllaXurqCV_yDF682hCUJeUBgBcaIqfWTdvv58T-8V7V4xTgwTrUeR6mZtrI69JrbWcIGfCAYVtrh8M5Ke6Pe_Ff0J7cmKE5x1mdNtO8I0AFiBUWHB7-JaxMdCsumQXiRxRUrA9Rna8ZT0w7CrHzsVR4hn40Eke8XN2Z41wP-sO2dzgbLhFdeLsrBZIlAer5XntI7o7ArzKLeFlXZVEgLaZR2yq87q2bAT7bk0f-wyc5j94jlOTwTm7ch-bEq86I2Ik-m4')" }}></div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Cypress IO в 2024: Полный обзор</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">Глубокое погружение в новейшие функции...</p>
                                <span className="mt-1 text-xs text-muted-foreground">5 мин. чтение</span>
                            </div>
                        </a>
                        <a className="flex gap-4 group" href="#">
                            <div className="h-20 w-28 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsd_r1v53rxIlvffBYm2ifG6BcfWJUdcgUWywG3Xssw9PZyekdPmoCdggseqO4x7WR_7W2_Ry9mmbi9WHTXtluDdBZyobe8aLr68SMv8PHWQfesWIt8VHdTHwQxehEWNC8RJXXEJW4stiMQdnXjAEGlp9P_sEtJBvBTrg8SccQgbXCFBNyp6efpDelrn0v8_g8Cv7GIR_Q16jj4aOT4xzqU-vtd1mOj6xY_CQFS1fqTPn0PDcpUwKjPc9FJYYljO-VFWz9aBWUMp4')" }}></div>
                            <div className="flex flex-col justify-center">
                                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">Shift Left Testing: Что это?</h4>
                                <p className="text-sm text-muted-foreground line-clamp-1">Почему раннее тестирование экономит деньги и время.</p>
                                <span className="mt-1 text-xs text-muted-foreground">7 мин. чтение</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="rounded-xl bg-muted/20 border border-border p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">Популярные инструменты</h3>
                        <a className="text-sm font-medium text-primary hover:underline" href="#">Каталог</a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            <img alt="Jira" className="h-4 w-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC2fxlsqgKFZNaaVCm53ouu06QzEvLxbAb_Ns8RNWB-Si_l3B_mlNY8zXB-cdemvBvYCgPYIvbTEA1vzeN2gJU-JqbR_mAYa-P4NUtcvXQimAsm1hoVSRrEYl24hWrKjZrVX8mN-vpghYqRfYkJ8KTn7EkZnDsYX2tgaIYFEZWXSl-3oHsLlqZ4nOSUEbzFjv7o1X7_Wt2eMXFapVBsOD5qq8sDbaCOfuamgrQ5XGj2N0wdlEZg9OeDrKJJNhbj-VHmmNa_Y5jMi0" /> Jira
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            <img alt="Selenium" className="h-4 w-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVU8xRIyu7IFZTq0zdFWWG3xB2P8pohhvN2dLq_poxvow8JAtg6nVn7vbrZE7g1SZaLOK_NXQk9_b0DRnolkubgoh2-61sKIZRM845zcRUfqvKsE3d_HZeUx9fpStnfu14_kwXAhgAilwCCLrVmV1jDlSVhE_kTFRyOryb049Wm7QrWTvMjG4uq9ZSqB--ZgyBQOo_yL7l2uWrf4gOAP4Dt56V-a7WuPWx_6Sl8Xwy8v117lkieLe-kLSbEC7DupMk3bZjpv0iy9Y" /> Selenium
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            <img alt="Postman" className="h-4 w-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_HuaCTCBLftieeGO9PjqsQqvYqJTkRTENKksCE2pV_VoZR1G5GV7jngTZie3baaPy1DFbUQSJCbt9yaci5dwL4WxYpyUlHoQvWKyGbVQJzv0Rtctg67rCH9TikMOj4gQ0H31rNZM-P7vpQgo-xHmUqsGokVUyFUHXq0Rlxenq_CzfHvUenJWFFsxveppNFe6zD8qPeWda8kF7yTNE3brum1hU9jcnaJtD9_kx2Ki4EH0W47YWOoBVp7xq3ZzDVnc5IG-rRPrYlSs" /> Postman
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            <img alt="Jenkins" className="h-4 w-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWrAWxp03SUsKxmbM5S8gpnDZI7APGOmkOkbM0nagJf3o7acuL6JuDpusaTlcMsj7lN9zRIuf6363UX4iSJwa-ZbtcByLyF35h37L48kPRR1wG76VigiW3wEAcryKDFsQ9PEFWZcOwicD_N7n4mt-6ixkpho1--NKbfkV49vM49Xr79Ek-wvQHgb2n6S2aZg0s6Da-XPxsNerslZ8fzpoAWx-nD4nnnlZqWAap8x0WB0ZCZ25Wu_-6uWsB0AE_E9FOFnBP5uHDEvU" /> Jenkins
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                            <img alt="Docker" className="h-4 w-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKWQgVhYhKe0pFPp8BLuUHr07gvugTYSfaroVxwK_5Z2SXNRx_hCfveiOjwANHkItyeFns6UeBQqqSZ6kRENocOQiKA8xKOdYMXH-vn8U3qilEdOy8Il9Bc2MFM73uYsSFb64xYfe4L1sfp9rolk2bG0jd0AlaRxVfnP7sDmfcxbC4sZTkoJAJ5I9kTQUMkeijdC1V5IrxEGo-h2JZ5sF35x596_AIb2ft4NsXPYygTaLujNu2r3TJFYhegJvu5bFmlrSRCahbpgs" /> Docker
                        </span>
                    </div>
                    <div className="mt-6 rounded-lg bg-background p-4 border border-border">
                        <p className="text-sm font-semibold text-foreground">Инструмент месяца: <span className="text-primary">Playwright</span></p>
                        <p className="mt-1 text-xs text-muted-foreground">Быстрое и надежное E2E тестирование для современных веб-приложений.</p>
                        <button className="mt-3 w-full rounded bg-primary/20 py-1.5 text-xs font-bold text-primary hover:bg-primary/30 transition-colors">Читать гайд</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
