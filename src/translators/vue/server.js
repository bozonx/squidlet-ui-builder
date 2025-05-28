import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { initTRPC } from '@trpc/server'

// Инициализируем tRPC
const t = initTRPC.create()

// Создаем роутер
const router = t.router({
  greeting: t.procedure.query(() => {
    return 'Hello from tRPC server!'
  }),
})

// Создаем HTTP сервер
const server = createHTTPServer({
  router,
})

// Запускаем сервер
server.listen(3001, () => {
  console.log('tRPC server running on http://localhost:3001')
}) 