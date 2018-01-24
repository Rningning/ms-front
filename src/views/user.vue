<template>
  <div>
    <div class="toolbar">
      <el-input v-model="username" placeholder="用户名" class="handle-input"></el-input>
      <el-button type="primary" size="small" round icon="el-icon-search" @click="getUserPage">搜索</el-button>
      <el-button type="primary" size="small" round icon="el-icon-edit" @click="reset">重置</el-button>
      <el-button type="primary" size="small" class="right" round icon="el-icon-circle-plus-outline"
                 @click="addDialogVisible = true">新增
      </el-button>
    </div>
    <v-table
      is-horizontal-resize
      style="width:100%"
      row-hover-color="#edf7ff"
      odd-bg-color="#eee"
      :height="470"
      :columns="columns"
      :table-data="tableData"
      :show-vertical-border="false"
      @on-custom-comp="customCompFunc"
    ></v-table>
    <div class="pagination">
      <v-pagination
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
        :total="total"
        :layout="['total', 'prev', 'pager', 'next', 'sizer', 'jumper']"
      ></v-pagination>
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
  export default {
    name: 'User',
    data() {
      return {
        isLoading: false,
        tableData: [],
        // pageNum: 1,
        // pageSize: 10,
        total: 0,
        username: null,
        columns: [
          {
            field: 'custom',
            title: '序号',
            width: 50,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            formatter: function (rowData, rowIndex, pagingIndex, field) {
              return rowIndex + 1;
            }
          },
          {
            field: 'username',
            title: '用户名',
            width: 100,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true /*宽度自适应*/
          },
          {
            field: 'password',
            title: '密码',
            width: 260,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'age',
            title: '年龄',
            width: 330,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'createTime',
            title: '创建时间',
            width: 500,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true
          },
          {
            field: 'custom-adv',
            title: '操作',
            width: 200,
            titleAlign: 'center',
            columnAlign: 'center',
            isResize: true,
            // isFrozen: true,
            componentName: 'table-operation'
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
      getUserPage() {
        this.isLoading = true;
        let params = {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        };
        if(this.username !== null){
          params.username = this.username;
        }
        this.$http
          .get("/ms/user/getPage", {params: params})
          .then((response) => {
            let data = response.data;
            if (data.code === 0) {
              this.isLoading = false;
              this.total = data.data.total;
              this.tableData = data.data.records;
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
      getUserById(params) {
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
      deleteUser(params) {
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
      },
      customCompFunc(params) {
        if (params.type === 'delete') {
          this.deleteUser({id: params.rowData['id']});
        } else if (params.type === 'edit') {
          this.getUserById({id: params.rowData['id']});
        }
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
