import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/router';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

// Получаем конфигурацию из переменных окружения
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const CORS_ORIGIN = process.env.CORS_ORIGIN || true;

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Регистрируем CORS
server.register(cors, {
  origin: CORS_ORIGIN,
});

// Регистрируем tRPC
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

// Запускаем сервер
const start = async (): Promise<void> => {
  try {
    await server.listen({ port: PORT, host: HOST });
    server.log.info(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Обработка сигналов завершения
const signals = ['SIGINT', 'SIGTERM'] as const;
for (const signal of signals) {
  process.on(signal, () => {
    server.log.info(`Received ${signal}, shutting down gracefully`);
    server.close(() => {
      server.log.info('Server closed');
      process.exit(0);
    });
  });
}

start(); 