<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <i-table stripe :columns="columns" :data="row" class="expand-row"></i-table>
  </div>
</template>
<script>
  export default {
    props: {
      row: Array
    },
    data() {
      return {
        columns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
          },
          {
            title: '用户名',
            key: 'username',
            width: 100,
            align: 'center'
          },
          {
            title: '密码',
            key: 'password',
            width: 100,
            align: 'center'
          },
          {
            title: '年龄',
            key: 'age',
            width: 100,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          }
        ]
      }
    }
  };
</script>
