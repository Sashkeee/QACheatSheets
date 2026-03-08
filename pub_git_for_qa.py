#!/usr/bin/env python3
import requests
import json
import sys

POCKETBASE_URL = "http://5.35.126.199:8090"
COLLECTION = "mini_articles"
ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQyMTY0MDYsImlkIjoidHRuN3l0anZkYnBva2RpIiwidHlwZSI6ImFkbWluIn0.Y2N-05PJ_QXhgnlqYCtnFss9TwnjhKeIOp9YJP0HQUg"

article = {
    "title": "Git для QA: Контроль версий и командная работа",
    "slug": "git-for-qa",
    "description": "Полное руководство по использованию Git для QA-инженеров. Команды, workflow, практические примеры.",
    "content": """Многие новички считают, что системы контроля версий нужны только программистам. На самом деле, Git — это абсолютно незаменимый инструмент для современного QA-инженера. В нем мы храним автоматизированные тесты, тестовую документацию и конфигурации.

## Проблема без контроля версий

Представьте классическую ситуацию: тестировщик Дима написал скрипт для проверки базы данных и сохранил его на общем сервере. Через час тестировщик Митя случайно перезаписал этот файл своей версией. Труд Димы потерян навсегда.

Git решает эту проблему, сохраняя всю историю изменений файлов и позволяя команде работать параллельно без риска удалить чужой код.

## Базовый рабочий процесс (Workflow)

Представим, что вы пишете новый автотест. Ваш процесс работы в Git будет выглядеть так:

### 1. Клонирование (Clone)

Для начала вы скачиваете проект с удаленного сервера (репозитория) на свой компьютер.

```bash
git clone https://github.com/company/qa-automation.git
```

### 2. Создание ветки (Branch)

Вы никогда не пишете код прямо в главной ветке (обычно main или master), чтобы не сломать стабильную версию. Вы создаете свою изолированную ветку (feature-branch):

```bash
git checkout -b feature/login-test
```

### 3. Фиксация изменений (Commit)

Вы написали тест. Теперь нужно сохранить эту «контрольную точку». Обязательно пишите понятные комментарии:

```bash
git add login_test.py
git commit -m "Добавлен автотест для формы авторизации"
```

### 4. Отправка на сервер (Push)

Вы отправляете свои локальные изменения на удаленный сервер, чтобы их увидели коллеги:

```bash
git push origin feature/login-test
```

### 5. Слияние (Merge Request)

Прежде чем ваш код попадет в главную ветку, вы создаете Merge Request. Коллеги проводят ревью вашего автотеста, и только после одобрения он сливается со стабильной базой.

## Почему Git критичен для QA?

Использование Git дает тестировщикам страховку: если новые тесты оказались неудачными или сломали сборку, вы всегда можете в один клик «откатиться» к предыдущей, работающей версии.

Git — это не только инструмент, это культура командной работы, прозрачности и надежности.""",
    "category": "tools"
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
        sys.stderr.write("✅ Git для QA статья опубликована!\n")
        sys.stderr.write(f"ID: {response.json()['id']}\n")
    else:
        sys.stderr.write(f"❌ Ошибка: {response.status_code}\n")
        sys.stderr.write(f"{response.text}\n")
except Exception as e:
    sys.stderr.write(f"❌ Ошибка подключения: {e}\n")
