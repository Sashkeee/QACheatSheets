import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { roadmapData } from '../../data/roadmapData';

// Генерируем контекст для ИИ из наших статей
const generateSystemContext = () => {
    let context = "Ты дружелюбный и экспертный помощник на сайте QA CheatSheet. Твоя задача — отвечать на вопросы пользователей по тестированию, опираясь на материалы этого сайта.\n\nМатериалы сайта:\n";

    Object.values(roadmapData).forEach(module => {
        context += `\n=== Раздел: ${module.title} ===\n`;
        module.sections.forEach(section => {
            context += `\nСтатья: ${section.title}\n`;
            context += section.content.join('\n') + '\n';
            if (section.glossary) {
                context += "Словарь терминов:\n";
                section.glossary.forEach(g => {
                    context += `- ${g.term}: ${g.definition}\n`;
                });
            }
        });
    });

    context += "\nОпирайся только на эти знания. Отвечай кратко, экспертно и доброжелательно, используя форматирование Markdown и эмодзи. Если вопрос не про тестирование или IT, вежливо скажи, что ты специализируешься только на QA.";
    return context;
};

type Message = {
    id: string;
    role: 'user' | 'model';
    text: string;
};

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: 'Привет! Я AI-помощник этого сайта. 🤖\nЯ изучил все статьи и глоссарии здесь. Что бы ты хотел узнать про QA?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Автоскролл вниз при новом сообщении
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // @ts-ignore
        const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

        if (!API_KEY) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: '❌ Ошибка: Ключ API не найден. Добавьте `VITE_OPENROUTER_API_KEY` в файл `.env` (получить бесплатно на openrouter.ai).'
            }]);
            setIsLoading(false);
            return;
        }

        try {
            const systemContext = generateSystemContext();

            // Формируем историю для чата в формате OpenAI (который требует OpenRouter)
            const history = messages.filter(m => m.id !== '1').map(m => ({
                role: m.role === 'model' ? 'assistant' : 'user',
                content: m.text,
            }));

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.href, // Обязательно для OpenRouter
                    "X-Title": "QA CheatSheet", // Обязательно для OpenRouter
                },
                body: JSON.stringify({
                    // Используем универсальный умный роутер, который сам выберет доступную на данный момент бесплатную модель
                    model: "openrouter/free",
                    messages: [
                        { role: "system", content: systemContext },
                        ...history,
                        { role: "user", content: userMsg.text }
                    ]
                })
            });

            if (!response.ok) {
                const errStr = await response.text();
                throw new Error(`OpenRouter HTTP ${response.status}: ${errStr}`);
            }

            const data = await response.json();
            const responseText = data.choices[0].message.content;

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: responseText
            }]);
        } catch (error: any) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: `Простите, произошла ошибка подключения к ИИ: ${error?.message || 'Неизвестная ошибка'}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] flex flex-col items-end">
            {/* Окно чата */}
            {isOpen && (
                <div className="w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] glass rounded-[2rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                    {/* Хедер чата */}
                    <div className="flex items-center justify-between p-5 bg-background/50 border-b border-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="font-black text-foreground leading-tight">QA Copilot</h3>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Online
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Сообщения */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] rounded-2xl p-4 text-sm font-medium leading-relaxed ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm shadow-lg shadow-primary/20'
                                        : 'bg-background/60 shadow-inner rounded-bl-sm border border-white/5 text-foreground/90 whitespace-pre-wrap'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-bl-sm p-4 text-sm font-medium bg-background/60 border border-white/5 flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Поле ввода */}
                    <div className="p-4 bg-background/50 border-t border-white/5 backdrop-blur-md">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Задай вопрос по QA..."
                                className="w-full bg-background/50 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 shadow-inner"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 h-8 w-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                            >
                                <Send size={14} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Кнопка открытия */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in"
                    aria-label="Открыть AI чат"
                >
                    <Sparkles size={24} className="animate-pulse" />
                </button>
            )}
        </div>
    );
}
