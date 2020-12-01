import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { localize } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json';
import VueClipboard from 'vue-clipboard2';
import VueSocialSharing from 'vue-social-sharing';

Vue.use(VueSocialSharing);

Vue.config.productionTip = false;

localize('ja', ja);

Vue.use(VueClipboard);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
