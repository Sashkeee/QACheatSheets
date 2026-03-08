export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number; // index 0-3
}

export interface RoadmapSection {
    title: string;
    content: string[];
    tips?: string[];
    image?: string;
    mistakes?: string[];
    quiz?: QuizQuestion[];
    glossary?: { term: string; definition: string; }[];
}

export interface RoadmapItem {
    id: string;
    title: string;
    description: string;
    sections: RoadmapSection[];
    source: string;
    pbCategory?: string; // если задан — статьи грузятся из PocketBase
}

import { introQa1 } from './intro-qa/introQa1';
import { introQa2 } from './intro-qa/introQa2';
import { introQa3 } from './intro-qa/introQa3';
import { introQa4 } from './intro-qa/introQa4';
import { introQa5 } from './intro-qa/introQa5';

export const roadmapData: Record<string, RoadmapItem> = {
    "intro-qa": {
        id: "intro-qa",
        title: "Начало. Основы QA и процессы",
        description: "Фундаментальное введение в мир качества: разница между QA/QC/Testing и базовые принципы индустрии.",
        source: "ISTQB, Роман Савин 'Тестирование dot com', Ольга Назина 'Курс молодого бойца'",
        sections: [
            introQa1,
            introQa2,
            introQa3,
            introQa4,
            introQa5
        ]
    },
    basics: {
        id: "basics",
        title: "Основы тестирования",
        description: "Фундаментальные знания: виды тестирования, классификации, базовые принципы QA.",
        source: "ISTQB Foundation Level, Роман Савин 'Тестирование Dot Com'",
        sections: [],
        pbCategory: "basics"
    },
    api: {
        id: "api",
        title: "Тестирование API & Микросервисов",
        description: "Как тестировать 'мозги' приложения — инструменты, методы, протоколы и практика.",
        source: "Postman Learning Center, Ольга Назина",
        sections: [],
        pbCategory: "tech"
    },
    automation: {
        id: "automation",
        title: "Основы Автоматизации",
        description: "Как написать код, который будет тестировать за тебя. Selenium, CI/CD и фреймворки.",
        source: "Roy Osherove 'Art of Unit Testing', Playwright Docs",
        sections: [],
        pbCategory: "tech"
    },
    security: {
        id: "security",
        title: "Продвинутое тестирование",
        description: "Продвинутые техники: безопасность, GraphQL, pairwise и оптимизация запросов.",
        source: "OWASP Top 10, Modern Testing Practices",
        sections: [],
        pbCategory: "advanced"
    },
    infrastructure: {
        id: "infrastructure",
        title: "Инфраструктура & DevOps",
        description: "Git, Docker и CI/CD — база современного инженера по тестированию.",
        source: "DevOps for Beginners, Atlassian Guides",
        sections: [],
        pbCategory: "advanced"
    },
    ai: {
        id: "ai",
        title: "AI в QA: Будущее наступило",
        description: "Бустим продуктивность с помощью нейросетей. Инструменты и практики 2026 года.",
        source: "Modern Testing Blog 2026",
        sections: [],
        pbCategory: "advanced"
    },
    career: {
        id: "career",
        title: "Твоя карьера в QA",
        description: "От составления резюме до успешного собеседования. Путь от новичка до специалиста.",
        source: "QA Community, 'How Google Tests Software' (Whittaker)",
        sections: [],
        pbCategory: "career"
    },
};
