<template>
  <div class="layout-page">
    <Layout class="layout-div">
      <Sider
        ref="side1"
        hide-trigger
        collapsible
        :collapsed-width="78"
        :width="235"
        v-model="isCollapsed"
        :class="themeType === 'light' ? 'themeLight' : 'themeDark'"
      >
        <!--:class="isCollapsed?'collapsed_left':''"-->
        <div class="logo" :class="headMaxWidth ? 'headMaxWidth' : ''">
          <img v-if="isCollapsed" src="../../assets/logo/beidou.svg" alt />
          <span
            v-show="!isCollapsed && !headMaxWidth"
            style="display: flex; align-items: center; justify-content: center"
          >
            <!-- <img :src="headMaxWidthLogoImg" alt="" style="width: 40px; height: 40px" /> -->
            <h4 style="font-size: 20px">&nbsp;脚本任务管理</h4>
          </span>
        </div>
        <Menu
          :active-name="activeName"
          :theme="themeType"
          width="auto"
          :class="menuitemClasses"
          :open-names="openNames"
          accordion
          ref="side_menu"
          @on-select="menuNav"
          @on-open-change="open"
        >
          <Submenu
            v-for="(item, index) in routersArr"
            :key="index"
            v-if="!isCollapsed && !item.meta.hide && !item.meta.singlePage"
            :name="item.name"
          >
            <template slot="title" v-if="!isCollapsed">
              <!-- <Icon :type="item.meta.icon" /> -->
              <div class="menu_img_title">
                <img
                  style="width: 18px"
                  :src="require(`../../assets/logo/${item.meta.img}`)"
                  alt
                />
                <span class="titlespan">{{ item.meta.title }}</span>
              </div>
            </template>
            <MenuItem
              v-if="!isCollapsed && !it.meta.hide"
              v-for="it in item.children"
              :key="it.name"
              :name="it.name"
            >
              <span>{{ it.meta.title }}</span>
            </MenuItem>
          </Submenu>
          <!--如果只有一个子路由-->
          <MenuItem
            v-else-if="!isCollapsed && !item.meta.hide && item.meta.singlePage"
            v-for="(it, dex) in item.children"
            :key="dex"
            class="ivu-menu-submenu"
            :class="{ liActive: $route.name === it.name }"
            style="padding: 0 !important"
            :name="it.name"
          >
            <div class="ivu-menu-submenu-title">
              <img
                style="width: 18px"
                :src="require(`../../assets/logo/${item.meta.img}`)"
                alt
              />
              <span style="margin-left: 10px">{{ it.meta.title }}</span>
            </div>
          </MenuItem>
          <Dropdown
            v-for="(item, ind) in routersArr"
            :key="ind"
            v-if="isCollapsed && !item.meta.hide"
            class="menuSmall"
            @on-click="dropdownNav"
          >
            <span :class="item.name === $route.meta.fuName ? 'active' : ''">
              <img
                style="width: 18px"
                :src="require(`../../assets/logo/${item.meta.img}`)"
                alt
              />
            </span>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="it in item.children"
                v-if="!it.meta.hide"
                :key="it.name"
                :name="it.name"
                :selected="it.name === activeName"
                >{{ it.meta.title }}</DropdownItem
              >
            </DropdownMenu>
          </Dropdown>
        </Menu>
      </Sider>
      <Layout>
        <!--头部-->
        <Header class="header flexR">
          <div class="header_left flexR">
            <span>
              <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                type="md-menu"
                size="24"
              ></Icon>
            </span>
            <span @click="refresh()">
              <Icon type="ios-refresh" size="24" />
            </span>
            <span>
              <Breadcrumb>
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>{{ $route.meta.fuTitle }}</BreadcrumbItem>
                <BreadcrumbItem
                  v-if="$route.meta.title !== $route.meta.fuTitle"
                  >{{ $route.meta.title }}</BreadcrumbItem
                >
              </Breadcrumb>
            </span>
          </div>
          <!--头部右边-->
          <div class="header_right flexR">
            <Icon
              :type="isMaxWindow ? 'md-contract' : 'md-expand'"
              @click="maxWindow"
              size="18"
            />
            <span>
              <Dropdown @on-click="personalSettings">
                <a href="javascript:void(0)" style="color: #515a6e">
                  <img
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    alt
                    class="ivu-avatar ivu-avatar-small"
                    style="margin-right: 5px"
                  />
                  {{ userName }}
                </a>
                <DropdownMenu slot="list">
                  <!-- <DropdownItem name="grzx">个人中心</DropdownItem>
                  <DropdownItem name="sz">设置</DropdownItem>-->
                  <DropdownItem name="setPwd">修改密码</DropdownItem>
                  <DropdownItem name="logout">退出登陆</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </span>
          </div>
        </Header>
        <!--多页标签-->
        <div v-if="isTabsShow" class="tabsNav flexR">
          <div class="xiala pointer" v-if="tabSwitch" @click="tabLeft">
            <Icon type="ios-arrow-back" size="16" />
          </div>
          <div class="left flexR" id="tabsNav">
            <div class="flexR" id="tabsDiv" :style="{ transform: transform }">
              <div
                class="pointer flexR navigation-link"
                v-for="(item, index) in $store.getters.routerArr"
                :key="item + index"
              >
                <span
                  :class="activeName === item.name ? 'active' : ''"
                  @click="tabNav(item.name)"
                  >{{ item.meta.title }}</span
                >
                <Icon
                  v-if="item.name !== $indexPage"
                  type="ios-close"
                  size="24"
                  @click="tabNavClose(item, index)"
                />
              </div>
            </div>
          </div>
          <div class="xiala pointer" v-if="tabSwitch" @click="tabRight">
            <Icon type="ios-arrow-forward" size="16" />
          </div>
          <div class="right">
            <Dropdown style="margin-left: 5px" @on-click="tabRightClick">
              <div class="xiala pointer">
                <Icon type="ios-arrow-down" />
              </div>
              <DropdownMenu slot="list">
                <DropdownItem name="qt">关闭其他</DropdownItem>
                <!--                                <DropdownItem name="left">关闭左侧</DropdownItem>-->
                <!--                                <DropdownItem name="right">关闭右侧</DropdownItem>-->
                <DropdownItem name="qb">全部关闭</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <!--内容区-->
        <Content
          id="main_content"
          :style="{
            height: !isTabsShow ? 'calc(100vh - 64px)' : 'calc(100vh - 108px)',
            margin: !isTabsShow ? '24px 0 24px 24px' : '12px 12px 0px',
          }"
          class="main_content flexC"
        >
          <!-- <keep-alive include="account"> -->
          <router-view v-if="isRouterViewShow" :key="key"></router-view>
          <!-- </keep-alive> -->
        </Content>
      </Layout>
    </Layout>
    <!-- 修改密码 -->
    <el-dialog
      :visible.sync="settingPwd.show"
      width="450px"
      destroy-on-close
      center
      title="修改密码"
    >
      <div>
        <el-form
          label-suffix=":"
          ref="settingPwd"
          :model="settingPwd.pwd"
          :rules="settingPwd.rules"
          label-width="90px"
          size="mini"
        >
          <el-form-item label="旧密码" prop="old_pwd">
            <el-input
              type="password"
              v-model="settingPwd.pwd.old_pwd"
              placeholder="请填写"
              style="width: 100%"
              clearable
              autocomplete="new-password"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input
              type="password"
              v-model="settingPwd.pwd.new_pwd"
              placeholder="请填写"
              style="width: 100%"
              clearable
              autocomplete="new-password"
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm">
            <el-input
              type="password"
              v-model="settingPwd.pwd.confirm"
              placeholder="请填写"
              style="width: 100%"
              clearable
              autocomplete="new-password"
              size="mini"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeModal()">取消</el-button>
        <el-button size="mini" type="primary" @click="updatePwd"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lightImg from "@/assets/logo/beidou.svg";
import { editPwd, sysconfiglist } from "@/api/user";
import { themeData } from "@/config/config";
import { mapState, mapActions } from "vuex";
import config from "@/api/config.js";
import md5 from "js-md5";
import store from "@/store";
export default {
  name: "main-page",
  computed: {
    // 获取vuex 路由数据 用户tag多页签
    getRouterArrVuex() {
      return this.$store.getters.routerArr;
    },
    // 收缩的图标
    rotateIcon() {
      return ["el-icon-s-fold", this.isCollapsed ? "el-icon-s-unfold" : ""];
    },
    // 导航收缩
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    ...mapState("user", {
      Version: (state) => state.Version,
      logvisible: (state) => state.logvisible,
      isLogin: (state) => state.isLogin,
    }),
    key() {
      return this.$route.path;
    },
  },
  data() {
    return {
      Visible: false,
      activeName: "", // 子导航选中的name
      isCollapsed: false, // 是否收缩
      isMaxWindow: false, // 是否最大化窗口
      routersArr: [], // 路由数据
      openNames: [], // 导航打开的父栏目
      transform: 0, // 导航左右方向移动距离
      tabSwitch: false, // 是否显示左右切换图标
      userData: {}, // 登录用户数据
      optionDrawer: false, // 是否显示配置抽屉
      themeType: themeData.themeType ? themeData.themeType : "dark", // 主题风格
      logoImg: lightImg, // 主题logo图片
      isTabsShow: themeData.isTabsShow, // 是否显示多页签
      headMaxWidthLogoImg: lightImg, // 栏目是否通顶logo图片
      headMaxWidth: themeData.headMaxWidth, // 栏目是否通顶（最大宽度）
      isRouterViewShow: true, // 控制router-view的隐藏与展示
      userName: "",
      label_width: 120,
      routes: sessionStorage.getItem("userRoutes")
        ? JSON.parse(sessionStorage.getItem("userRoutes"))
        : [],
      settingPwd: {
        show: false,
        rules: {
          old_pwd: {
            required: true,
            trigger: "change",
            message: "请输入旧密码",
          },
          new_pwd: {
            required: true,
            trigger: "change",
            message: "请输入新密码",
          },
          confirm: {
            required: true,
            trigger: "change",
            message: "请确认新密码",
          },
        },
        pwd: {
          old_pwd: "",
          new_pwd: "",
          confirm: "",
        },
      },
      balance: 0,
      priceVisible: false,
      concatUrl: "",
      discountsInfoList: [],
      exchangeRate: 0,
      inviteVisible: false,
      invitereturnmoneyList: [],
      inviterCode: "",
      config,
    };
  },
  created() {
    this.setRouterArr();
  },
  mounted() {
    // 如果没有权限 回到默认首页 防止错误地址程序崩溃 跳转非法路由
    if (this.$route.meta.hide) {
      this.$router.push({
        name: this.$indexPage,
      });
    }
    // 页面刷新后 保存打开的路由数据到本地存储
    window.addEventListener("unload", this.saveState);
    this.activeName = this.$route.name;
    this.openNames = [];
    this.openNames.push(this.$route.meta.fuName);
    this.$nextTick(() => {
      // 重新渲染导航
      if (this.$refs.side_menu) {
        this.$refs.side_menu.updateOpened();
        // this.$refs.side_menu.updateActiveName()
      }
    });
  },
  methods: {
    openDiscounts() {
      Promise.all([
        new Promise((resolve, reject) => {
          sysconfiglist({
            uid: "",
            page: 1,
            limit: 20,
          })
            .then((res) => {
              console.log("res--plane: ", res);
              res.data.list.forEach((v) => {
                if (v.key === "platform_contacts_service") {
                  this.concatUrl = "https://t.me/" + v.data;
                }
              });
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        }),
      ])
        .then(() => {
          this.priceVisible = true;
        })
        .catch((error) => {
          console.log("error: ", error);
          this.priceVisible = true;
        });
    },
    toPlane() {
      window.open(this.concatUrl, "_blank");
    },
    updatePwd() {
      this.$refs["settingPwd"].validate((valid) => {
        if (valid) {
          if (this.settingPwd.pwd.new_pwd !== this.settingPwd.pwd.confirm) {
            this.$Message.error("两次输入不一致");
          } else {
            let data = {
              old_pwd: md5(this.settingPwd.pwd.old_pwd),
              new_pwd: md5(this.settingPwd.pwd.new_pwd),
            };
            editPwd(data).then((res) => {
              if (res.code == 0) {
                this.settingPwd.show = false;
                this.settingPwd.pwd.old_pwd = "";
                this.settingPwd.pwd.new_pwd = "";
                this.$Message.success("修改成功");
              }
            });
          }
        }
      });
    },
    closeModal() {
      this.settingPwd.show = false;
    },
    // 收缩切换
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
      this.$nextTick(() => {
        // 重新渲染导航
        this.$refs.side_menu.updateOpened();
        this.$refs.side_menu.updateActiveName();
      });
    },
    // 处理路由数据 包含路由角色权限
    setRouterArr() {
      // 获取用户数据
      this.userName = sessionStorage.getItem("userName") || "";
      if (!sessionStorage.getItem("userToken")) {
        this.$Notice.warning({
          duration: 2,
          title: "警告",
          desc: "登录信息已失效,清重新登录",
        });
        this.$store.dispatch("user/logout");
        this.$router.push({
          name: this.$loginPage,
        });
      }
      console.log(this.routes, "我是路由");
      this.routersArr = JSON.parse(JSON.stringify(this.routes));
      console.log("this.routersArr: ", this.routersArr);
    },
    // 导航跳转
    menuNav(name) {
      this.routerPush(name);
      console.log("name: ", name);
      // console.log(this.routerArr)
      console.log("this.routerArr: ", this.routersArr);
      let seleMenu = JSON.parse(sessionStorage.getItem("roleMenuList")).filter(
        (v) => name === v.url
      );
    },
    // 父级栏目展开收缩事件
    open(name) {
      this.openNames = ["" + name + ""];
    },
    // 下拉菜单跳转
    dropdownNav(name) {
      this.routerPush(name);
    },
    // tab切换跳转
    tabNav(name) {
      this.routerPush(name);
    },
    // 路由跳转
    routerPush(name) {
      // this.openNames = ['' + this.openNames + '']
      // this.activeName = name
      console.log(name, this.activeName, "跳转路由名称");
      this.$router.push({
        name: name,
      });
      this.$nextTick(() => {
        let w = document.getElementById("tabsDiv").offsetWidth;
        let zw = document.getElementById("tabsNav").offsetWidth;
        if (w > zw) {
          this.tabSwitch = true;
        }
      });
    },
    // tab关闭
    tabNavClose(item, index) {
      let arr = this.$store.getters.routerArr;
      // 判断是否是首页
      if (item.name !== this.$indexPage) {
        this.$store.dispatch("tagsView/delRouter", index);
        if (index !== 0) {
          this.$router.push({
            name: arr[index - 1].name,
          });
        }
      }
      this.$nextTick(() => {
        let w = document.getElementById("tabsDiv").offsetWidth;
        let zw = document.getElementById("tabsNav").offsetWidth;
        if (w < zw) {
          this.tabSwitch = false;
        }
      });
    },
    // tab最右侧下拉框右键选中
    tabRightClick(type) {
      let arr = this.$store.getters.routerArr;
      this.tabSwitch = false;
      switch (type) {
        case "qt":
          for (let i = arr.length - 1; i > -1; i--) {
            if (arr[i].name !== this.activeName) {
              this.$store.dispatch("tagsView/delRouter", i);
            }
          }
          break;
        case "qb":
          if (arr.length === 1) {
            if (this.$route.name !== this.$indexPage) {
              for (let i = arr.length - 1; i > -1; i--) {
                this.$store.dispatch("tagsView/delRouter", i);
              }
            }
          } else {
            for (let i = arr.length - 1; i > -1; i--) {
              this.$store.dispatch("tagsView/delRouter", i);
            }
          }
          break;
      }
    },
    // 窗口最大化
    maxWindow() {
      if (this.isMaxWindow) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.isMaxWindow = false;
      } else {
        let element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        this.isMaxWindow = true;
      }
    },
    // 向左切换
    tabLeft() {
      this.transform = "translateX(0px)";
    },
    // 向右切换
    tabRight() {
      let w = document.getElementById("tabsDiv").offsetWidth;
      let zw = document.getElementById("tabsNav").offsetWidth;
      if (w > zw) {
        let s = -(w - zw);
        this.transform = "translateX(" + s + "px)";
      }
    },
    // 页面刷新后 将vuex路由数据存储到本地
    saveState() {
      let arr = this.$store.getters.routerArr;
      let arr1 = [];
      for (let v of arr) {
        let item = {
          fullPath: v.fullPath,
          meta: v.meta,
          name: v.name,
          path: v.path,
        };
        arr1.push(item);
      }
      localStorage.setItem("dataRouter", JSON.stringify(arr1));
    },

    // 页面刷新
    refresh() {
      // 先隐藏
      this.isRouterViewShow = false;
      // $nextTick() 将回调延迟到下次 DOM 更新循环之后执行
      this.$nextTick(() => {
        this.isRouterViewShow = true;
      });
    },
    // 个人设置功能
    async personalSettings(name) {
      if (name === "logout") {
        await this.$store.dispatch("user/logout");
        this.$Notice.success({
          title: "登出成功",
          duration: 1.5,
        });
        this.$router.push({
          name: this.$loginPage,
        });
      } else if (name === "setPwd") {
        this.settingPwd.show = true;
      }
    },
  },
  watch: {
    // 监听路由跳转
    $route() {
      this.activeName = this.$route.name;
      this.openNames = [];
      this.openNames.push(this.$route.meta.fuName);
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened();
        this.$refs.side_menu.updateActiveName();
        this.saveState();
      });
      // document.title = this.$route.meta.title + ' - Hui Admin Pro'
    },
    // 监听路由数组改变
    getRouterArrVuex(val) {
      if (val.length < 1) {
        this.$router.push({
          name: this.$indexPage,
        });
      }
      // 动态监听路由变化 自动滚动多页签导航
      this.$nextTick(() => {
        // 修复退出登录 页面报错
        if (document.getElementById("tabsNav")) {
          let zw = document.getElementById("tabsNav").offsetWidth; // 总宽度
          let w = document.getElementById("tabsDiv").offsetWidth; // 导航宽度
          if (w > zw) {
            let s = -(w - zw);
            this.transform = "translateX(" + s + "px)";
          } else {
            this.tabLeft();
          }
        }
      });
    },
  },
  filters: {},
};
</script>

<style lang="less">
@import "main";

.el-icon-bell {
  font-size: 20px;
  position: relative;

  .newmessage {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
    margin-top: 0px;
    position: absolute;
    left: 12px;
  }
}

.balance-btn {
  display: flex;
  align-items: center;
  padding: 0px 9px;
  height: 30px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin-right: 10px;
  background: gold;
  cursor: pointer;
}

.balance-btn:hover {
  background-color: rgb(15, 193, 175);
  color: #fff;
}

.inviteBack-btn {
  display: flex;
  align-items: center;
  padding: 0px 9px;
  height: 30px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin-right: 10px;
  background: #e0efff;
  cursor: pointer;
}

.inviteBack-btn:hover {
  background-color: rgb(15, 193, 175);
  color: #fff;
}

.concat {
  color: #409eff;
  text-decoration: #409eff;
}

.concat-area {
  div {
    width: 120px;
    margin: auto;
    margin-top: 15px;
    background: #5764ff;
    color: #fff;
    padding: 5px 9px;
    border-radius: 5px;
    cursor: pointer;
  }
}

.poptip {
  pointer-events: none;
}

.menu-title:hover {
  margin-left: -45px;
}

.menu_img_title {
  display: flex;
  align-items: center;
}

.icon-red {
  color: red;
}

.rotate {
  font-size: 18px;
}

.rotate:active {
  transform: rotate(180deg);
}

.exchange {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid #5764ff;
  border-radius: 20px;
  text-align: center;
  font-size: 18px;
  margin-top: 15px;
}

.invite {
  margin: 15px 0 5px 0;
  text-align: center;
  font-weight: 600;
}
</style>
