#!/usr/bin/env python3
import requests
import json
import sys

POCKETBASE_URL = "http://5.35.126.199:8090"
COLLECTION = "mini_articles"
ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzQyMTY0MDYsImlkIjoidHRuN3l0anZkYnBva2RpIiwidHlwZSI6ImFkbWluIn0.Y2N-05PJ_QXhgnlqYCtnFss9TwnjhKeIOp9YJP0HQUg"

article = {
    "title": "REST API тестирование: проверка бизнес-логики",
    "slug": "rest-api-testing",
    "description": "Как тестировать REST API. Методы HTTP, коды ответов, примеры с curl и инструментами.",
    "content": """В современных веб-приложениях графический интерфейс (фронтенд) и серверная часть (бэкенд) разделены. Они общаются друг с другом с помощью API — программного интерфейса приложения. Самый популярный архитектурный стиль для такого общения называется REST (Representational State Transfer).

В REST все сущности системы (пользователи, товары, заказы) представляются в виде ресурсов, к которым мы обращаемся по уникальным адресам (URL). Обмен данными чаще всего происходит в удобном текстовом формате JSON.

## Главные HTTP-методы (CRUD)

Для взаимодействия с ресурсами тестировщик использует стандартные методы протокола HTTP:

### GET (Чтение)

Запрашивает информацию с сервера.

**Пример:** `GET /api/users/10` — получить данные пользователя с ID 10.

### POST (Создание)

Отправляет данные на сервер для создания нового объекта.

**Пример:** `POST /api/users` с телом запроса:
```json
{
  "name": "Иван",
  "email": "ivan@test.com"
}
```

### PUT / PATCH (Обновление)

Изменяет существующие данные.

**Пример:** `PATCH /api/users/10` с телом:
```json
{
  "email": "new_ivan@test.com"
}
```

### DELETE (Удаление)

Безвозвратно удаляет ресурс.

**Пример:** `DELETE /api/users/10` — удалит карточку Ивана из базы.

## Что проверяет тестировщик API?

Тестирование API выполняется без браузера, с помощью специальных инструментов вроде Postman или Swagger. QA-инженер отправляет запросы и анализирует два главных параметра:

### 1. Коды состояния (Status Codes)

Сервер всегда возвращает трехзначный код ответа:

- **200 OK** или **201 Created** — позитивный сценарий, запрос успешно обработан
- **400 Bad Request** — ошибка клиента (например, вы передали текст в поле, где ожидается число)
- **401 Unauthorized** — попытка выполнить действие без авторизации в системе
- **500 Internal Server Error** — сервер не смог обработать запрос и "упал" (отличный баг!)

### 2. Тело ответа (Response Body)

Если мы запрашиваем список товаров, в ответ должен прийти корректный JSON со всеми полями, описанными в документации, а не пустая строка или обрывки кода.

## Почему API-тестирование критично?

Тестирование API крайне важно, потому что оно работает намного быстрее UI-тестов и позволяет вылавливать баги бизнес-логики на самых ранних этапах, когда графического интерфейса еще даже не существует.""",
    "category": "testing"
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
        sys.stderr.write("✅ REST API тестирование статья опубликована!\n")
        sys.stderr.write(f"ID: {response.json()['id']}\n")
    else:
        sys.stderr.write(f"❌ Ошибка: {response.status_code}\n")
        sys.stderr.write(f"{response.text}\n")
except Exception as e:
    sys.stderr.write(f"❌ Ошибка подключения: {e}\n")
