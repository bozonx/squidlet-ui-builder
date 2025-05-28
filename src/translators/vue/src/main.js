import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Создаем экземпляр приложения
const app = createApp(App)

// Подключаем роутер
app.use(router)

// Монтируем приложение
app.mount('#app') 