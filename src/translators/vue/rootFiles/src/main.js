import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import * as components from './components';

const app = createApp(App)

app.use(router)

// TODO: есть плагин unplugin-vue-components
for (const component in components) {
  app.component(component, components[component]);
}

app.mount('#app') 