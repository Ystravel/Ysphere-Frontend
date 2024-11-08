/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import VuetifyUseDialog from 'vuetify-use-dialog'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(VuetifyUseDialog, {
      snackbar: {
        showCloseButton: true,
        closeButtonText: 'X',
        snackbarProps: {
          timeout: 3000,
          location: 'top',
          rounded: 'lg'
        }
      }
    })
    .use(router)
    .use(pinia)
}
