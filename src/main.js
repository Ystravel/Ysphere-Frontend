/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import vue3GoogleLogin from 'vue3-google-login'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
app.use(vue3GoogleLogin, {
  clientId: '890205288379-2bm447qt1rj7jkooc7luqej83if9inp4.apps.googleusercontent.com'
})

registerPlugins(app)

app.mount('#app')
