import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import Stocks from './views/Stocks.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          alias: '/stocks',
          name: 'stocks',
          component: Stocks
        }
      ]
    }
  ]
});
