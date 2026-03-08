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
}

import { introQa1 } from './intro-qa/introQa1';
import { introQa2 } from './intro-qa/introQa2';
import { introQa3 } from './intro-qa/introQa3';
import { introQa4 } from './intro-qa/introQa4';
import { introQa5 } from './intro-qa/introQa5';
import { careerNavigator } from './careerNavigator';

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
        description: "Фундаментальные знания: от истории до этапов разработки ПО (SDLC).",
        source: "Ольга Назина 'Что такое тестирование', Роман Савин 'Тестирование Dot Com'",
        sections: [
            {
                title: "Суть и Цели",
                image: "/bug_lifecycle.png",
                content: [
                    "Тестирование — это не просто 'поиск багов'. Это процесс обеспечения уверенности в качестве продукта.",
                    "Аналогия 'Кондитер Анечка' (О. Назина): Представьте кондитера, который печет торты. Сначала она делает всё сама. Но когда заказов становится 100 в день, ей нужен отдельный человек, который проверит: не перепутала ли она сахар с солью?",
                    "Эвристика 'Зачем эта программа?': Прежде чем жать кнопки, поймите бизнес-цель. Если софт работает идеально технически, но не решает задачу юзера — тесты провалены.",
                    "• Ошибка (Error): Оплошность программиста.",
                    "• Дефект/Баг (Bug): Ошибка, воплощенная в коде.",
                    "• Сбой (Failure): Когда пользователь увидел проблему воочию."
                ],
                tips: ["Тестировщик — это не просто тот, кто находит ошибки, а тот, кто мешает им попасть к пользователю."]
            },
            {
                title: "Жизненный цикл (SDLC)",
                image: "/sdlc_diagram.png",
                content: [
                    "Согласно Agile, тестирование идет ПАРАЛЛЕЛЬНО разработке, а не в конце.",
                    "1. Инициация: Идея продукта.",
                    "2. Анализ требований: Ищем дыры в ТЗ. Самый дешевый этап для поиска багов!",
                    "3. Архитектура: Описываем БД и API.",
                    "4. Разработка: Код пишется, QA готовит тесты.",
                    "5. Стабилизация: Поиск и фикс багов.",
                    "6. Поддержка: Сбор фидбека и новые фичи."
                ]
            }
        ]
    },
    api: {
        id: "api",
        title: "Тестирование API & Микросервисов",
        description: "Как тестировать 'мозги' приложения без кнопок и макетов.",
        source: "Ольга Назина 'Что такое тестирование', Postman Learning Center",
        sections: [
            {
                title: "Архитектура Client-Server",
                image: "/api_diagram.png",
                content: [
                    "REST (Representational State Transfer) — это не стандарт, а стиль.",
                    "1. Клиент (Браузер/Мобилка) делает запрос.",
                    "2. Сервер обрабатывает и возвращает ответ.",
                    "3. Stateless: Сервер не обязан 'помнить' клиента между запросами.",
                    "JSON (JavaScript Object Notation): Самый популярный формат обмена данными. Читается и людьми, и роботами."
                ]
            },
            {
                title: "HTTP Методы и Статусы",
                content: [
                    "Глаголы (Методы):",
                    "• GET: Получить данные (безопасный).",
                    "• POST: Создать новый ресурс.",
                    "• PUT / PATCH: Обновить (заменить целиком или частично).",
                    "• DELETE: Удалить.",
                    "",
                    "Классы статус-кодов:",
                    "• 1xx: Инфо (Редко увидите).",
                    "• 2xx: Успех (200 OK, 201 Created).",
                    "• 3xx: Редирект (Ушли на другой адрес).",
                    "• 4xx: Ошибка клиента (400 Bad Request, 404 Not Found).",
                    "• 5xx: Ошибка сервера (500 Internal Error, 502 Bad Gateway)."
                ]
            }
        ]
    },
    automation: {
        id: "automation",
        title: "Основы Автоматизации",
        description: "Как написать код, который будет тестировать за тебя.",
        source: "Roy Osherove 'Art of Unit Testing', Playwright Docs",
        sections: [
            {
                title: "Пирамида автоматизации",
                image: "/test_pyramid_diagram.png",
                content: [
                    "Идеальная пирамида по Майку Кону:",
                    "• Юнит-тесты (Unit): Фундамент. Тысячи быстрых тестов на маленькие кусочки кода. Пишут программисты.",
                    "• Интеграционные/API: Середина. Проверяют логику без UI (Postman, Supertest).",
                    "• UI-тесты (E2E): Верхушка. Медленные, имитируют клики браузера. Не должно быть слишком много.",
                    "Главный принцип: Чем выше уровень — тем дороже и медленнее тест."
                ]
            }
        ]
    },
    security: {
        id: "security",
        title: "Безопасность (Sec)",
        description: "Как мыслить как хакер, чтобы защитить продукт.",
        source: "OWASP Top 10, Ройс Д. 'Искусство тестирования на проникновение'",
        sections: [
            {
                title: "Главные угрозы (OWASP)",
                image: "/security_diagram.png",
                content: [
                    "Информационная безопасность — это не только шифры, но и психология.",
                    "• SQL Injection: Взлом БД через поле ввода. Пример: ввести `' OR 1=1 --` в поле пароля, чтобы зайти под админом.",
                    "• IDOR: 'Проблема соседа'. Вы зашли в профиль `/user/100`, помена на `/user/101` и увидели чужие данные.",
                    "• XSS (Cross-Site Scripting): Внедрение скрипта, который ворует куки. Полезно проверять все поля, куда можно вставить `<script>`.",
                    "• Перебор (Brute Force): Отсутствие лимита на попытки входа."
                ]
            }
        ]
    },
    infrastructure: {
        id: "infrastructure",
        title: "Инфраструктура",
        description: "Git, Docker и CI/CD — база современного инженера.",
        source: "DevOps for Beginners",
        sections: [
            {
                title: "Docker: Контейнеры",
                image: "/docker_concept.png",
                content: [
                    "Docker решает проблему: 'У меня на компе работает, а у тебя — нет'.",
                    "Image (Образ) — это чертеж. Container (Контейнер) — это запущенный по этому чертежу экземпляр.",
                    "QA часто запускает в Docker базы данных или Selenium-Grid для тестов."
                ]
            }
        ]
    },
    ai: {
        id: "ai",
        title: "AI в QA: Будущее наступило",
        description: "Бустим продуктивность в 3 раза с помощью нейросетей.",
        source: "Modern Testing Blog 2026",
        sections: [
            {
                title: "Как AI помогает сегодня",
                content: [
                    "1. Генерация тестов: 'Придумай 20 негативных проверок для логина'.",
                    "2. Код автотестов: 'Напиши селекторы на Playwright по скриншоту'.",
                    "3. Анализ логов: AI мгновенно находит причину ошибки в 1000 строк лога.",
                    "4. Тестовые данные: 'Сгенерируй 50 уникальных JSON объектов для заказа'."
                ],
                tips: ["AI — отличный ассистент, но плохой начальник. Всегда перепроверяйте результат."]
            }
        ]
    },
    career: {
        id: "career",
        title: "Твоя карьера в QA",
        description: "От составления резюме до оффера в Google.",
        source: "QA Community, 'How Google Tests Software' (Whittaker)",
        sections: [
            {
                title: "Резюме, которое читают",
                content: [
                    "• Стек технологий: Пишите только то, что сможете объяснить.",
                    "• Опыт в результатах: 'Снизил время регресса на 20% за счет оптимизации чек-листов' — круто.",
                    "• Портфолио: Ссылка на GitHub с автотестами на Playwright/Java или примеры тест-кейсов в Notion."
                ]
            }
        ]
    },
    articles: careerNavigator
};
