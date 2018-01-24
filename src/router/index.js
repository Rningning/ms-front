import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* 路由懒加载 */
const User = resolve => require(['@/views/user.vue'], resolve);

export default new Router({
  routes: [
    {
      path: '/user',
      name: 'User',
      component: User
    }
  ]
})
