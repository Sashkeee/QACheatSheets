import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    keywords?: string;
    author?: string;
}

export function SEO({
    title,
    description,
    image = 'https://qacheatsheet.ru/og-image.png',
    url,
    type = 'website',
    keywords,
    author = 'QA CheatSheet'
}: SEOProps) {
    const fullTitle = title.includes('QA CheatSheet') ? title : `${title} | QA CheatSheet`;

    return (
        <Helmet>
            {/* Основные мета-теги */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

            {/* Региональные теги для СНГ */}
            <meta name="geo.placename" content="Russia, Belarus, Kazakhstan, Ukraine" />
            <meta name="geo.region" content="RU" />

            {/* Open Graph (для соцсетей: VK, Telegram, Facebook) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {url && <meta property="og:url" content={url} />}
            <meta property="og:locale" content="ru_RU" />
            <meta property="og:locale:alternate" content="be_BY" />
            <meta property="og:locale:alternate" content="uk_UA" />
            <meta property="og:locale:alternate" content="kk_KZ" />

            {/* VK теги (для красивого превью в ВКонтакте) */}
            <meta property="vk:image" content={image} />

            {/* Twitter Card (если будут посты в Twitter) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Яндекс спецификация */}
            <meta name="yandex-verification" content="YOUR_YANDEX_ID" />
            <meta name="format-detection" content="telephone=no" />

            {/* Canonical URL (для избежания дублей) */}
            {url && <link rel="canonical" href={url} />}

            {/* Robots для поисковиков */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="yandexbot" content="index, follow" />

            {/* Для статей - время публикации */}
            {type === 'article' && (
                <>
                    <meta property="article:author" content={author} />
                    <meta property="article:published_time" content={new Date().toISOString()} />
                </>
            )}
        </Helmet>
    );
}
