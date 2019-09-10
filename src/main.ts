// QUASAR
import { Quasar } from 'quasar';
import QuasarOptions from './quasar';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/quasar.styl';

Vue.use(Quasar, QuasarOptions);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
