// Quasar
import { Quasar } from 'quasar';
import QuasarOptions from './quasar';
import './styles/quasar.styl';

// Money
import Money from 'v-money';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(Quasar, QuasarOptions);
Vue.use(Money, { precision: 4 });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
