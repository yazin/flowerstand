import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { localize } from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja.json';

Vue.config.productionTip = false;

localize('ja', ja);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
