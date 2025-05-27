# UI Builder Backend

Backend сервер для UI Builder, построенный на Node.js, TypeScript, Fastify и tRPC.

## Требования

- Node.js 18+
- npm или yarn

## Установка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Запуск в продакшн режиме
npm start
```

## Структура проекта

```
src/
  ├── index.ts          # Точка входа приложения
  ├── trpc/
  │   ├── context.ts    # Контекст tRPC
  │   └── router.ts     # Роутер tRPC
  └── ...
```

## API Endpoints

Все API endpoints доступны через tRPC на `/trpc`.

### Пример запроса

```typescript
// Клиентский код
const greeting = await trpc.hello.query({ name: 'John' });
console.log(greeting); // { greeting: 'Hello John!' }
```

## Разработка

- `npm run dev` - запуск в режиме разработки с hot-reload
- `npm run lint` - проверка кода линтером
- `npm run build` - сборка проекта
- `npm start` - запуск собранного проекта 