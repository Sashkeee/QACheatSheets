#!/usr/bin/env python3
import requests
import json
import sys

POCKETBASE_URL = "http://5.35.126.199:8090"
COLLECTION = "mini_articles"
ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQyMTY0MDYsImlkIjoidHRuN3l0anZkYnBva2RpIiwidHlwZSI6ImFkbWluIn0.Y2N-05PJ_QXhgnlqYCtnFss9TwnjhKeIOp9YJP0HQUg"

article = {
    "title": "Автоматизация UI: Cypress против Selenium (с примерами)",
    "slug": "cypress-vs-selenium",
    "description": "Сравнение инструментов для автоматизации UI-тестирования: Cypress vs Selenium. Преимущества и недостатки каждого с примерами кода.",
    "content": """Выбор правильного инструмента для автоматизации графического интерфейса (UI) — важный шаг для любой QA-команды. На рынке выделяются два принципиально разных подхода.

## Selenium: промышленный стандарт

Selenium существует с 2004 года и использует протокол WebDriver для управления браузерами "снаружи".

**Преимущества:**
- Поддерживает Java, Python, C#, Ruby, JS
- Легко справляется с тестированием нескольких вкладок одновременно

**Недостатки:**
- Выполнение тестов может быть медленным
- Часто требует явного прописывания ожиданий элементов (waits)

### Пример теста на Python

Сценарий открывает страницу браузера, находит поле поиска, вводит текст и отправляет запрос.

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://www.google.com")

search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("Selenium Python")
search_box.submit()

driver.quit()
```

## Cypress: выбор современных команд

Cypress — современный фреймворк, который запускает тесты прямо внутри браузера, в одном цикле с тестируемым приложением.

**Преимущества:**
- Мгновенная обратная связь
- Встроенное автоматическое ожидание элементов
- Удобная отладка с "путешествием во времени" (time-travel debugging)

**Недостатки:**
- Строго ограничен языками JavaScript/TypeScript
- Не поддерживает навигацию по нескольким вкладкам браузера

### Пример теста на JavaScript

Сценарий переходит на сайт и автоматически дожидается проверки правильного заголовка.

```javascript
describe('Homepage', () => {
  it('should display correct title', () => {
    cy.visit('https://example.com');
    cy.title().should('include', 'Example Domain');
  });
});
```

## Итог

Если проекту нужна поддержка разных языков программирования, тестирование реальных мобильных устройств и сложных сценариев с вкладками — выбирайте **Selenium**.

Если вся команда пишет на JavaScript, а в приоритете скорость создания тестов и удобная визуальная отладка — **Cypress** будет лучшим выбором.""",
    "category": "automation"
}

try:
    response = requests.post(
        f"{POCKETBASE_URL}/api/collections/{COLLECTION}/records",
        json=article,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ADMIN_TOKEN}"
        }
    )

    if response.status_code == 201:
        sys.stderr.write("✅ Cypress vs Selenium статья опубликована!\n")
        sys.stderr.write(f"ID: {response.json()['id']}\n")
    else:
        sys.stderr.write(f"❌ Ошибка: {response.status_code}\n")
        sys.stderr.write(f"{response.text}\n")
except Exception as e:
    sys.stderr.write(f"❌ Ошибка подключения: {e}\n")
