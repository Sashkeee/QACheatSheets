const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

/**
 * STRATEGY:
 * The file is mangled with duplicate keys and broken objects.
 * We will perform a surgical extraction and replacement to restore the canonical 
 * state while keeping the fixed formatting.
 */

// 1. Detect the corrupted intersection between "basics" and "test-design"
console.log("Analyzing file for structural corruption...");

// The corruption looks like:
// basics: { ... sections: [ ... ] }, "test-design": { ... sections: [] } } ] } , "test-design": { ... }
// We need to cut at the end of "basics" and jump directly to a clean "test-design"

const corruptionPoint = content.indexOf('    "test-design": {');
const nextSectionPoint = content.indexOf('"databases": {');

if (corruptionPoint !== -1 && nextSectionPoint !== -1) {
    console.log("Found corrupted block between basics and databases. Reconstructing...");

    // Everything before the first "test-design" key starting from the end of the previous section
    // Actually, line 675 is the end of "basics".
    const beforeBasicsEnd = content.lastIndexOf('    basics: {');
    const basicsSectionsEnd = content.indexOf('        ]', beforeBasicsEnd + 100);
    const basicsEnd = content.indexOf('    },', basicsSectionsEnd);

    if (basicsEnd !== -1) {
        const startPart = content.substring(0, basicsEnd + 6); // Includes "    },"
        const endPart = content.substring(nextSectionPoint);

        const cleanTestDesign = `
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
                    "## Техники 'Черного ящика' (Практика)",
                    "1. Классы Эквивалентности (Equivalence Partitioning):",
                    "• Пример 'Золушка' (О. Назина): Принц ищет девушку с 35 размером ноги. Классы: [0-34] (не подходит), [35] (подходит!), [36-50] (не подходит). Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса.",
                    "2. Анализ Граничных Значений (BVA):",
                    "   • Ошибки живут на краях. Для диапазона [6-20] символов пароля тестируем: 5, 6, 7 (нижний край) и 19, 20, 21 (верхний край).",
                    "3. Таблица решений (Decision Table):",
                    "   • Матрица для сложных условий: 'Если VIP AND сумма > 5000 AND город = Москва -> Логика скидки'.",
                    "4. Переход состояний (State Transition):",
                    "   • Валидация логики статусов: Нельзя перевести заказ из 'Новый' сразу в 'Доставлен', минуя 'Оплачен'."
                ],
                tips: [
                    "Начинайте с позитивного теста (Happy Path). Если он не прошел — остальное не имеет смысла.",
                    "Используйте Pairwise, чтобы не тестировать миллион комбинаций браузеров и ОС."
                ]
            }
        ]
    },
    `;

        content = startPart + cleanTestDesign + endPart;
    }
}

// 2. Fix the broken indentation and property structure for remaining sections (databases, automation, etc.)
// They look like: 
// id: "databases",
//     title: "SQL...",
// These should be properties of an object inside Record<string, RoadmapItem>
// The current state is key: { property: val, property: val } but with weird nested braces sometimes.

// Generic fix for the property indentation mess
content = content.replace(/(\w+): {\s+id: "(.*?)",\s+title: "(.*?)",\s+description: "(.*?)",\s+source: "(.*?)",/g,
    (m, key, id, title, desc, source) => {
        return `    "${key}": {\n        id: "${id}",\n        title: "${title}",\n        description: "${desc}",\n        source: "${source}",`;
    });

// 3. Fix the "content" arrays throughout the file to ensure they are clean strings
const contentArrayFixRegex = /content: \[\s*([\s\S]*?)\s*\]/g;
content = content.replace(contentArrayFixRegex, (match, p1) => {
    // Extract all strings, filter out structural noise
    const lines = p1.split(',').map(l => {
        let text = l.trim();
        // Remove leading/trailing quotes
        text = text.replace(/^"/, '').replace(/"$/, '');
        // Remove structural artifacts
        if (text === "}" || text === "]" || text === ",") return null;
        return text;
    }).filter(l => l !== null && l !== "");

    if (lines.length === 0) return match;

    return `content: [\n                    "${lines.join('",\n                    "')}"\n                ]`;
});

// 4. Fix specific broken strings (like Docker split line)
content = content.replace(/"Docker решает проблему: 'У меня на компе работает",\s*"а у тебя — нет'."/g,
    '"Docker решает проблему: \'У меня на компе работает, а у тебя — нет\'."');

// 5. Cleanup residual structural characters
content = content.replace(/},\s+]\s+}/g, '}\n                ]\n            }');

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts deep structural repair completed.');
