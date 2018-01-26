<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="toolbar">
      <el-input v-model="username" placeholder="用户名" class="handle-input"></el-input>
      <el-button type="primary" size="small" round icon="el-icon-search" @click="getUserPage">搜索</el-button>
      <el-button type="primary" size="small" round icon="el-icon-edit" @click="reset">重置</el-button>
      <el-button type="primary" size="small" class="right" round icon="el-icon-circle-plus-outline"
                 @click="addDialogVisible = true">新增
      </el-button>
    </div>
    <i-table stripe :columns="columns" :data="tableData" @on-expand="expand"></i-table>
    <div class="pagination">
      <Page :total="total" show-elevator show-sizer show-total @on-change="pageChange"
            @on-page-size-change="pageSizeChange"></Page>
    </div>
    <el-dialog title="新增用户" :visible="addDialogVisible" width="30%" center>
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" :label-width="formLabelWidth">
              <el-input v-model="form.age" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" size="medium" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="medium" round @click="addUser">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible="updateDialogVisible" width="30%" center>
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" :label-width="formLabelWidth">
              <el-input v-model="form.username" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" :label-width="formLabelWidth">
              <el-input v-model="form.age" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" size="medium" round @click="cancel">取 消</el-button>
        <el-button type="primary" size="medium" round @click="updateUser">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import expandRow from './user-expand.vue';

  export default {
    name: 'User',
    data() {
      return {
        isLoading: false,
        tableData: [],
        expandData: [],
        // pageNum: 1,
        pageSize: 20,
        total: 0,
        username: null,
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: this.expandData
                }
              })
            }
          },
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
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            // fixed: 'right',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'edit'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.getUserById(params.row.id)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.deleteUser(params.row.id)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        addDialogVisible: false,
        form: {
          id: null,
          username: null,
          password: null,
          age: null
        },
        formLabelWidth: '70px',
        updateDialogVisible: false,
      }
    },
    created() {
      this.getUserPage();
    },
    methods: {
      expand(row, status) {
        if (status) {
          let params = {
            pageNum: this.pageIndex,
            pageSize: this.pageSize
          };
          if (this.username !== null) {
            params.username = this.username;
          }
          this.$http
            .get("/ms/user/getPage", {params: params})
            .then((response) => {
              let data = response.data;
              if (data.code === 0) {
                this.isLoading = false;
                this.total = data.data.total;
                this.expandData = data.data.records;
              }
            });
        }
      },
      getUserPage() {
        this.isLoading = true;
        let params = {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        };
        if (this.username !== null) {
          params.username = this.username;
        }
        this.$http
          .get("/ms/user/getPage", {params: params})
          .then((response) => {
            let data = response.data;
            if (data.code === 0) {
              this.isLoading = false;
              this.total = data.data.total;
              let records = data.data.records;
              for (let i = 0; i < records.length; i++) {
                if (i % 2 === 0) {
                  records[i]._disableExpand = true;
                }
              }
              this.tableData = records;
            }
          });
      },
      reset() {
        this.username = null;
        this.pageIndex = 1;
        this.pageSize = 10;
        this.getUserPage();
      },
      pageChange(pageIndex) {
        this.pageIndex = pageIndex;
        this.getUserPage();
      },
      pageSizeChange(pageSize) {
        this.pageIndex = 1;
        this.pageSize = pageSize;
        this.getUserPage();
      },
      cancel() {
        this.addDialogVisible = false;
        this.updateDialogVisible = false;
        this.form.id = null;
        this.form.username = null;
        this.form.password = null;
        this.form.age = null;
      },
      addUser() {
        this.$http.post("/ms/user/add", this.form).then((response) => {
          let data = response.data;
          if (data.code === 0) {
            this.addDialogVisible = false;
            this.$message({
              message: '保存用户成功!',
              type: 'success'
            });
            this.form.username = null;
            this.form.password = null;
            this.form.age = null;
            this.getUserPage();
          }
        })
      },
      getUserById(id) {
        let params = {
          id: id
        }
        this.$http
          .get("/ms/user/getById", {params: params})
          .then((response) => {
            let data = response.data;
            if (data.code === 0) {
              this.form.id = data.data.id;
              this.form.username = data.data.username;
              this.form.password = data.data.password;
              this.form.age = data.data.age;
              this.updateDialogVisible = true;
            }
          });
      },
      updateUser() {
        let params = this.form;
        this.$http.put("/ms/user/update", params).then((response) => {
          let data = response.data;
          if (data.code === 0) {
            this.addDialogVisible = false;
            this.$message({
              message: '修改用户成功!',
              type: 'success'
            });
            this.id = null;
            this.form.username = null;
            this.form.password = null;
            this.form.age = null;
            this.updateDialogVisible = false;
            this.getUserPage();
          }
        })
      },
      deleteUser(id) {
        let params = {
          id: id
        }
        this.$http
          .delete("/ms/user/delete", {params: params})
          .then((response) => {
            let data = response.data;
            if (data.code === 0) {
              this.$message({
                message: '删除用户成功!',
                type: 'success'
              });
            }
            this.getUserPage();
          });
      }
    }
  }
</script>
<style scoped>
  /*整个表格设置*/
  .v-table-class {
    font-size: 14px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    margin: 0 auto;
  }

  /*表格表头设置*/
  .v-table-title-class {
    font-weight: normal;
    color: #333333;
    text-shadow: 0 0 0 #333333;
  }

  .pagination {
    text-align: right;
  }

  .toolbar {
    margin-bottom: 10px;
    background-color: #f2f2f2;
    padding: 10px;
  }

  .handle-input {
    width: 200px;
    display: inline-block;
  }

  .right {
    float: right;
  }
</style>
