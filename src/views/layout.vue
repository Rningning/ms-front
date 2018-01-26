<template>
  <div>
    <div class="header">
      <div id="logo">
        舜乡汽修账务系统
      </div>
      <div class="user-info">
          <span style="color:#f6ff00;font-size:16px;">
              {{currentTime}}&nbsp;&nbsp;{{username}}&nbsp;&nbsp;欢迎您登陆！&nbsp;&nbsp;
          </span>
        <el-dropdown trigger="click" @command="clickSetting">
              <span class="el-dropdown-link">
                  设置<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
          <el-dropdown-menu slot="dropdown">
            <template v-for="item in config.setting">
              <el-dropdown-item :command="item">{{item.text}}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="navigation">
      <el-menu class="el-menu-vertical-demo" router unique-opened>
        <template v-for="(item,index) in menus">
          <template v-if="item.subs">
            <el-submenu :index="index.toString()">
              <template slot="title">
                <i :class="item.icon"></i>&nbsp;&nbsp;
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                <span>{{subItem.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item :index="item.index">
              <i :class="item.icon"></i>&nbsp;&nbsp;
              <span>{{item.title}}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Layout',
    data() {
      return {
        config: {setting: []},
        currentTime: null,
        username: "admin",
        addDialogVisible: false,
        menus: [
          {
            title: "系统管理",
            icon: "el-icon-setting",
            index: "system",
            subs: [
              {
                title: "用户管理",
                icon: null,
                index: "user",
                subs: null
              },
              {
                title: "表格管理",
                icon: null,
                index: "table",
                subs: null
              }
            ]
          }
        ]
      }
    },
    created() {
      this.config.setting = [
        {
          text: "修改密码",
          type: "update-password"
        },
        {
          text: "退出登录",
          type: "loginout"
        }
      ];
    },
    methods: {
      clickSetting(item) {
        if (item.type === "loginout") {
          this.$confirm("您确定要退出登录?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.isLogin = false;
            this.isShow = false;
            window.frames[0].postMessage("exit", "*");
            setTimeout(() => {
              this.clickNavigationItem({url: "http://passport"});
            }, 200);
          });
        } else if (item.type == "update-password") {
          this.addDialogVisible = true;
        }
      }
    },
    beforeMount() {
      setInterval(updateTime, 1000);
      let self = this;

      function updateTime() {
        let cd = new Date();
        self.currentTime = zeroPadding(cd.getFullYear(), 4) + '-'
          + zeroPadding(cd.getMonth() + 1, 2) + '-'
          + zeroPadding(cd.getDate(), 2) + " "
          + zeroPadding(cd.getHours(), 2) + ':'
          + zeroPadding(cd.getMinutes(), 2) + ':'
          + zeroPadding(cd.getSeconds(), 2);
      }

      function zeroPadding(num, digit) {
        let zero = '';
        for (var i = 0; i < digit; i++) {
          zero += '0';
        }
        return (zero + num).slice(-digit);
      }

      updateTime();
    },
  }
</script>

<style scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    line-height: 70px;
    color: #fff;
    background-color: #20a0ff;
  }

  #logo {
    float: left;
    margin-left: 10px;
    width: 200px;
    text-align: center;
    font-size: 20px;
  }

  .user-info {
    float: right;
    margin-right: 40px;
  }

  .user-info .el-dropdown {
    line-height: 70px;
    color: white;
    font-size: 16px;
  }

  .user-info .el-dropdown:hover {
    cursor: pointer;
  }

  .navigation {
    left: 0;
    top: 70px;
    bottom: 0;
    height: 100%;
    background-color: white;
    border-right: 1px solid rgb(217, 217, 217);
    width: 250px;
    transition: 0.3s;
    z-index: 998;
    display: block;
    position: absolute;
  }

  .content {
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 250px;
    top: 70px;
    right: 0;
    bottom: 0;
    width: auto;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
