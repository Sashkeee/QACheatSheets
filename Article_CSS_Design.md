---
description: 
---

# CSS Дизайн Код для статей (Шпаргалка QA)

Вставьте сюда ваш CSS дизайн-код и любые инструкции по его применению к статьям. Я буду использовать этот файл в качестве главного источника правды по стилизации при импорте или выгрузке любых статей.

/* ==========================================================================
   БАЗОВЫЕ НАСТРОЙКИ (VARIABLES & THEMES)
   ========================================================================== */
:root {
  /* Типографика: Гуманистический гротеск (например, Inter, Geist или TT Norms) [8] */
  --font-primary: 'Inter Variable', 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Адаптивные размеры шрифтов с помощью clamp() [6, 9] */
  /* Формула: clamp(min-size, viewport-width-calc, max-size) */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16px - 18px [9] */
  --text-h1: clamp(2.441rem, 2rem + 2vw, 3.052rem); /* ~39px - 48px [10] */
  --text-h2: clamp(1.953rem, 1.6rem + 1.5vw, 2.441rem); /* ~31px - 39px [10] */
  --text-h3: clamp(1.563rem, 1.3rem + 1vw, 1.953rem); /* ~25px - 31px [10] */
  --text-small: 0.875rem; /* 14px */

  /* Вертикальный ритм (Базовая сетка 8px) [4, 11] */
  --space-xs: 8px;
  --space-s: 16px;
  --space-m: 24px;
  --space-l: 32px;
  --space-xl: 48px;

  /* Светлая тема (Light Mode) [7] */
  --bg-color: #ffffff;
  --text-color: #1a1a1a; /* Мягкий черный для контраста 4.5:1 [7, 12] */
  --text-muted: #555555;
  --accent-color: #2563eb; /* Синий для ссылок и акцентов */
  --border-color: #e5e7eb;
  --quote-bg: #f9fafb;
}

/* Темная тема (Dark Mode) - Активируется автоматически [7, 12] */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212; /* Избегаем чисто черного [7] */
    --text-color: #e6e6e6; /* Избегаем чисто белого для снижения усталости глаз [7] */
    --text-muted: #a0a0a0;
    --accent-color: #60a5fa;
    --border-color: #2d3748;
    --quote-bg: #1e1e1e;
  }
}

/* ==========================================================================
   ОСНОВНАЯ СТРУКТУРА СТАТЬИ
   ========================================================================== */
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.6; /* Идеальный интерлиньяж для чтения [13, 14] */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Контейнер статьи: ограничиваем длину строки для когнитивного комфорта [2, 15] */
.article-content {
  width: 90%;
  max-width: 70ch; /* Около 65-75 символов в строке [2, 16] */
  margin: 0 auto; /* Центрирование с пустым пространством по бокам [17] */
  padding: var(--space-xl) 0;
}

/* ==========================================================================
   ТИПОГРАФИКА: ЗАГОЛОВКИ И АБЗАЦЫ
   ========================================================================== */
.article-content p {
  margin-top: 0;
  margin-bottom: var(--space-m); /* Отступ между абзацами больше, чем между строками [18] */
}

/* Иерархия заголовков [10] */
.article-content h1, 
.article-content h2, 
.article-content h3 {
  font-weight: 700;
  line-height: 1.2; /* Уменьшенный интерлиньяж для заголовков [13] */
  margin-top: var(--space-xl); /* Отступ сверху в 2 раза больше нижнего [19] */
  margin-bottom: var(--space-s);
  color: var(--text-color);
}

.article-content h1 { font-size: var(--text-h1); margin-top: 0; }
.article-content h2 { font-size: var(--text-h2); }
.article-content h3 { font-size: var(--text-h3); font-weight: 600; }

/* ==========================================================================
   ЭЛЕМЕНТЫ: СПИСКИ, ЦИТАТЫ, ССЫЛКИ, ИЗОБРАЖЕНИЯ
   ========================================================================== */
/* Ссылки */
.article-content a {
  color: var(--accent-color);
  text-decoration: underline;
  text-decoration-color: rgba(37, 99, 235, 0.3); /* Полупрозрачное подчеркивание [20] */
  text-underline-offset: 4px;
  transition: text-decoration-color 0.2s ease;
}
.article-content a:hover {
  text-decoration-color: var(--accent-color);
}

/* Списки */
.article-content ul, 
.article-content ol {
  margin-bottom: var(--space-m);
  padding-left: var(--space-l);
}
.article-content li {
  margin-bottom: var(--space-xs); /* Воздух между пунктами списка [21] */
}

/* Цитаты (Blockquotes) [22] */
.article-content blockquote {
  margin: var(--space-l) 0;
  padding: var(--space-m) var(--space-l);
  background-color: var(--quote-bg);
  border-left: 4px solid var(--accent-color);
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.25rem); /* Немного увеличенный шрифт */
  font-style: italic;
  border-radius: 0 8px 8px 0;
}

/* Изображения */
.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: var(--space-m) 0 var(--space-xs) 0; /* Отступы вокруг медиа [23, 24] */
  display: block;
}
.article-content figcaption {
  font-size: var(--text-small);
  color: var(--text-muted);
  text-align: center;
  margin-bottom: var(--space-l);
}

/* Смысловые акценты (жирный шрифт) */
.article-content strong {
  font-weight: 600;
  color: var(--text-color);
}

--------------------------------------------------------------------------------