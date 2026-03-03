const fs = require('fs');

const tsPath = 'C:\\Users\\user\\Documents\\Antigravity\\QA CheatSheet\\app\\src\\data\\intro-qa\\introQa1.ts';
let content = fs.readFileSync(tsPath, 'utf8');

// Replace images
content = content.replace(/"!\[слайд (\d+)\]"/g, '"![слайд $1](/extracted/Слайд$1.JPG)"');

// Replace H3 headers with numbered list items
content = content.replace(/### 1\. Тестирование/g, '1. **Тестирование');
content = content.replace(/"1\. \*\*Тестирование демонстрирует наличие дефектов"/g, '"1. **Тестирование демонстрирует наличие дефектов**"');

content = content.replace(/"### 2\. Исчерпывающее тестирование невозможно"/g, '"2. **Исчерпывающее тестирование невозможно**"');
content = content.replace(/"### 3\. Раннее тестирование экономит деньги"/g, '"3. **Раннее тестирование экономит деньги**"');
content = content.replace(/"### 4\. Скопление дефектов \(Принцип Парето\)"/g, '"4. **Скопление дефектов (Принцип Парето)**"');
content = content.replace(/"### 5\. Парадокс пестицида"/g, '"5. **Парадокс пестицида**"');
content = content.replace(/"### 6\. Тестирование зависит от контекста"/g, '"6. **Тестирование зависит от контекста**"');
content = content.replace(/"### 7\. Заблуждение об отсутствии ошибок"/g, '"7. **Заблуждение об отсутствии ошибок**"');

// Ensure that paragraphs inside the list are indented so the markdown list doesn't break
// "Тестирование может показать... -> "   Тестирование...
// I will just let markdown handle it normally, actually if it's joined by \n\n then if the paragraph doesn't have indentation, it will reset the list.
// In Formating.md, it's fine. Wait, if it resets the list, the numbers will all be 1, 1, 1... or not be a list.
// Instead of separate string elements, let's just indent the next string.
content = content.replace(/"Тестирование может показать, что дефекты присутствуют/g, '"    Тестирование может показать, что дефекты присутствуют');
content = content.replace(/"Многим новичкам кажется, что/g, '"    Многим новичкам кажется, что');
content = content.replace(/'Тестирование должно стартовать/g, "'    Тестирование должно стартовать");
content = content.replace(/"Эмпирический опыт показывает, что большая/g, '"    Эмпирический опыт показывает, что большая');
content = content.replace(/"Представьте, что вы каждый день/g, '"    Представьте, что вы каждый день');
content = content.replace(/"Универсального подхода не/g, '"    Универсального подхода не');
content = content.replace(/"Даже если мы найдем и исправим/g, '"    Даже если мы найдем и исправим');

fs.writeFileSync(tsPath, content, 'utf8');
console.log('Fixed introQa1!');
