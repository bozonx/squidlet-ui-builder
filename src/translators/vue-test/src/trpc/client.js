import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

// Создаем tRPC клиент
export const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc', // URL нашего tRPC сервера
    }),
  ],
}) 