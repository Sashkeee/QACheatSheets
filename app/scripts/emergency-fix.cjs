const fs = require('fs');
const filePath = 'c:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\roadmapData.ts';

let content = fs.readFileSync(filePath, 'utf8');

/**
 * STRATEGY: 
 * The file is heavily corrupted with broken arrays and misplaced structural characters.
 * Instead of surgical regex, we will rewrite the most problematic sections using a template 
 * to ensure valid TypeScript syntax while preserving the Russian content.
 */

// 1. Repair structural mess in "intro-qa" sections where images were split
content = content.replace(/"!\["\s*\n\s*\]\((.*?)\)"/g, '"![]($1)"');
content = content.replace(/"!\["\s*,\s*\n\s*"(.*?)\]\((.*?)\)"/g, '"![]($2)"');

// 2. Fix the specific "Zolushka" (Cinderella) error reported by the user
// It looks like: "text" ] (extra text) ...
// We need to move the "]" and reconstruct the string correctly.
const zolushkaStart = "• Пример 'Золушка' (О. Назина): Принц ищет девушку с 35 размером ноги. Классы: [0-34";
const zolushkaEnd = "] (не подходит), [35] (подходит!), [36-50] (не подходит). Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса.";

// Match the broken block across lines
const zolushkaRegex = /"• Пример 'Золушка' \(О\. Назина\): Принц ищет девушку с 35 размером ноги\. Классы: \[0-34"\s*\] \(не подходит\), \[35\] \(подходит!\), \[36-50\] \(не подходит\)\. Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса\."/g;
content = content.replace(zolushkaRegex, `"${zolushkaStart}] (не подходит), [35] (подходит!), [36-50] (не подходит). Нам не нужно примерять туфельку всем 1000 гостьям, достаточно одной из каждого класса."`);

// 3. Fix the "empty comma" lines like `",` or `,` that appear between content items
content = content.replace(/",\s*,/g, '",');
content = content.replace(/\[\s*,\s*"/g, '["');

// 4. Force repair of the "test-design" section structure which got mangled in the last edit
// We look for where the sections array was broken
const testDesignBroken = /"test-design": {[\s\S]*?sections: \[[\s\S]*?}\s*\]\s*}\s*\]\s*}\s*,\s*"test-design": {/;
if (testDesignBroken.test(content)) {
    console.log("Detected duplicate/broken test-design keys. Fixing...");
    // This is complex, so let's find the whole block from "test-design" to "databases" and replace it with a clean version
    const fullBlockRegex = /"test-design": {[\s\S]*?id: "databases"/;
    const cleanBlock = `"test-design": {
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
    "databases": {
        id: "databases"`;
    content = content.replace(fullBlockRegex, cleanBlock);
}

// 5. Final pass to fix any dangling commas or unmatched quotes in content arrays
const contentCleanupRegex = /content: \[\s*([\s\S]*?)\s*\]/g;
content = content.replace(contentCleanupRegex, (match, p1) => {
    // Extract everything that looks like a string, ignoring the noise
    const strings = [];
    const internalQuoteRegex = /"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = internalQuoteRegex.exec(p1)) !== null) {
        let text = m[1].trim();
        if (text && text !== ",") {
            strings.push(text);
        }
    }
    if (strings.length === 0) return match;
    return `content: [\n                    "${strings.join('",\n                    "')}"\n                ]`;
});

// 6. Fix any residual double IDs or keys
content = content.replace(/"id": "intro-qa",\s*"id": "intro-qa"/g, '"id": "intro-qa"');

fs.writeFileSync(filePath, content);
console.log('roadmapData.ts structure restored and syntax fixed.');
