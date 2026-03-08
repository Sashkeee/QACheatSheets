import { Share2, MessageCircle, Send, Mail } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    description: string;
    url: string;
}

export function ShareButtons({ title, description, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareLinks = {
        telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n${description}\n\n${url}`)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex flex-col gap-4">
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Share2 size={16} />
                    Поделиться статьей:
                </p>

                <div className="flex flex-wrap gap-2">
                    {/* Telegram */}
                    <a
                        href={shareLinks.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] font-semibold transition-all hover:scale-105 active:scale-95"
                        title="Поделиться в Telegram"
                    >
                        <Send size={16} />
                        Telegram
                    </a>

                    {/* VK (ВКонтакте) */}
                    <a
                        href={shareLinks.vk}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077ff]/10 hover:bg-[#0077ff]/20 text-[#0077ff] font-semibold transition-all hover:scale-105 active:scale-95"
                        title="Поделиться в ВКонтакте"
                    >
                        <MessageCircle size={16} />
                        ВКонтакте
                    </a>

                    {/* Twitter */}
                    <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-foreground font-semibold transition-all hover:scale-105 active:scale-95"
                        title="Поделиться в Twitter/X"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9 0 11-4s1-8 0-8c-.5.5-2 1-4 1.15A10.9 10.9 0 0123 3z" />
                        </svg>
                        Twitter
                    </a>

                    {/* Email */}
                    <a
                        href={shareLinks.email}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 font-semibold transition-all hover:scale-105 active:scale-95"
                        title="Отправить по почте"
                    >
                        <Mail size={16} />
                        Email
                    </a>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 ${
                            copied
                                ? 'bg-green-500/20 text-green-600'
                                : 'bg-primary/10 hover:bg-primary/20 text-primary'
                        }`}
                        title="Скопировать ссылку"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                        </svg>
                        {copied ? 'Скопировано!' : 'Копировать'}
                    </button>
                </div>
            </div>
        </div>
    );
}
