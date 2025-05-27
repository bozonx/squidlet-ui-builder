import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { z } from 'zod';

// Инициализируем tRPC
const t = initTRPC.context<Context>().create();

// Создаем базовые процедуры
export const router = t.router;
export const publicProcedure = t.procedure;

// Пример процедуры
export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'world'}!`,
      };
    }),
});

// Экспортируем тип роутера
export type AppRouter = typeof appRouter; 