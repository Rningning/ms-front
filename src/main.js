import Vue from 'vue';
import Layout from './views/layout.vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import {VTable, VPagination} from 'vue-easytable';
import iView from 'iview';

import '@/assets/css/reset.css';
import '@/assets/css/simple-line-icons.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-easytable/libs/themes-base/index.css';
import 'iview/dist/styles/iview.css';    // 使用 CSS

Vue.use(iView);
Vue.use(ElementUI);
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  template: '<Layout/>',
  components: {Layout}
})
