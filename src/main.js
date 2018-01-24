import Vue from 'vue';
import Layout from './views/layout.vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import {VTable, VPagination} from 'vue-easytable';

import '@/assets/css/reset.css';
import '@/assets/css/simple-line-icons.css';
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-easytable/libs/themes-base/index.css';

Vue.use(ElementUI);
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);
// 自定义列组件
Vue.component('table-operation', {
  template: `<span>
        <el-button type="primary" size="small" round icon="el-icon-edit" @click="update(rowData,index)">编辑</el-button>&nbsp;
        <el-button type="primary" size="small" round icon="el-icon-delete" @click="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {
      // 参数根据业务场景随意构造
      let params = {type: 'edit', rowData: this.rowData};
      this.$emit('on-custom-comp', params);
    },

    deleteRow() {
      // 参数根据业务场景随意构造
      let params = {type: 'delete', rowData: this.rowData};
      this.$emit('on-custom-comp', params);
    }
  }
})

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  template: '<Layout/>',
  components: {Layout}
})
