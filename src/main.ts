import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'





import App from './App.vue';
import './registerServiceWorker';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
})



createApp(App).use(vuetify).mount('#app');
