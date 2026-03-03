const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

/**
 * FINAL EMERGENCY REPAIR
 * Goals:
 * 1. Fix the image markdown syntax error on line 35-36, 44, 52, 55, 60, 65, 74, 84, 86
 * 2. Fix the nested objects mess at basics -> test-design
 * 3. Fix the missing property definitions for sections
 */

console.log("Starting final emergency repair of roadmapData.ts...");

// 1. Fix broken Image Markdown
// It looks like: "![" \n ](/path)" or "![" , \n ](/path)"
content = content.replace(/"!\["\s*,\s*\n\s*\]\((.*?)\)"/g, '"![]($1)"');
content = content.replace(/"!\["\s*\n\s*\]\((.*?)\)"/g, '"![]($1)"');

// 2. Fix the specific basics -> test-design transition
// Current state around line 675:
// sections: [...] }, "test-design": { id: "test-design", ... sections: [] } } ] } , "test-design": { ... }
const databasesStart = content.indexOf('"databases": {');
const basicsStart = content.indexOf('"basics": {');

if (basicsStart !== -1 && databasesStart !== -1) {
    // We will extract everything before "basics" and everything including and after "databases"
    // and reconstruct the middle part.
    const startPart = content.substring(0, basicsStart);
    const endPart = content.substring(databasesStart);

    const cleanMiddle = `    "basics": {
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
                    "- **Ошибка (Error):** Оплошность программиста.",
                    "- **Дефект/Баг (Bug):** Ошибка, воплощенная в коде.",
                    "- **Сбой (Failure):** Когда пользователь увидел проблему воочию."
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
    "test-design": {
        id: "test-design",
        title: "Мастер Тест-дизайна",
        description: "Искусство создания идеальных проверок с минимальными усилиями.",
        source: "Ольга Назина, Ли Копланд, Крис Уиттакер",
        sections: [
            {
                title: "Техники 'Черного ящика' (Практика)",
                image: "/test_design_techniques_diagram.png",
                content: [
                    "1. Классы Эквивалентности (Equivalence Partitioning):",
                    "• Пример 'Золушка' (О. Назина): Принц ищет девушку с 35 размером ноги. Классы: [0-34] (не подходит), [35] (подходит!), [36-50] (не подходит). Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса.",
                    "2. Анализ Граничных Значений (BVA):",
                    "• Ошибки живут на краях. Для диапазона [6-20] символов пароля тестируем: 5, 6, 7 (нижний край) и 19, 20, 21 (верхний край).",
                    "3. Таблица решений (Decision Table):",
                    "• Матрица для сложных условий: 'Если VIP AND сумма > 5000 AND город = Москва -> Логика скидки'.",
                    "4. Переход состояний (State Transition):",
                    "• Валидация логики статусов: Нельзя перевести заказ из 'Новый' сразу в 'Доставлен', минуя 'Оплачен'."
                ],
                tips: [
                    "Начинайте с позитивного теста (Happy Path). Если он не прошел — остальное не имеет смысла.",
                    "Используйте Pairwise, чтобы не тестировать миллион комбинаций браузеров и ОС."
                ]
            }
        ]
    },
`;

    content = startPart + cleanMiddle + endPart;
}

// 3. Fix the split string in Docker (line 839-840)
content = content.replace(/"Docker решает проблему: 'У меня на компе работает",\s*"а у тебя — нет'."/g,
    '"Docker решает проблему: \'У меня на компе работает, а у тебя — нет\'."');

// 4. Global indent and property fix
// This will fix the missing quotes and indentation for property names
content = content.replace(/^\s*id: /gm, '        id: ');
content = content.replace(/^\s*title: /gm, '        title: ');
content = content.replace(/^\s*description: /gm, '        description: ');
content = content.replace(/^\s*source: /gm, '        source: ');
content = content.replace(/^\s*sections: /gm, '        sections: ');

fs.writeFileSync(filePath, content);
console.log("Repair finished successfully.");
