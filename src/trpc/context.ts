import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

// Создаем контекст для каждого запроса
export const createContext = async ({ req, res }: CreateFastifyContextOptions) => {
  return {
    req,
    res,
    // Здесь можно добавить дополнительные данные в контекст
    // например, сессию пользователя, подключение к БД и т.д.
  };
};

// Экспортируем тип контекста
export type Context = inferAsyncReturnType<typeof createContext>; 