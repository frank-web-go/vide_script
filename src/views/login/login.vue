<template>
  <div class="login-container">
    <!-- <div class="svg-login-bg"><img src="" alt=""></div> -->
    <div class="main">
      <!-- 整个注册盒子 -->
      <div class="login-box">
        <!-- 左侧的注册盒子 -->
        <div class="loginbox-left">
          <div class="logo">
            <img src="../../assets/logo/beidou.svg" alt="" style="width: 220px" />
          </div>
          <div class="title">{{ siteTitle }}</div>
        </div>
        <!-- 右侧的注册盒子 -->
        <div class="loginbox-right">
          <div class="user-operation">用户登录</div>
          <el-form ref="formValidate1" class="login-from" :model="loginJson" :rules="loginCheck"
            @keydown.native.enter.prevent="login('formValidate1')">
            <el-form-item prop="account">
              <el-input prefix="ios-person-outline" type="text" v-model="loginJson.account" autofocus clearable
                placeholder="请输入用户名">
                <i class="el-icon-user-solid el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input prefix="ios-lock-outline" type="password" v-model="loginJson.pwd" clearable placeholder="请输入密码">
                <i class="el-icon-lock el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="code" prop="code">
              <Row>
                <Col span="13">
                <el-input prefix="ios-lock-outline" @input="toStrings" v-model="loginJson.answer" clearable
                  placeholder="请输入验证码">
                </el-input>
                </Col>
                <Col span="11">
                <el-button disabled v-if="codeStatus === 0" style="margin-left: 10px" type="primary"
                  :loading="true">加载中</el-button>
                <el-button v-if="codeStatus === 2" @click="updatacd" style="margin-left: 10px" type="warning">点击重试<i
                    class="el-icon-refresh-right"></i></el-button>
                <div v-if="codeStatus === 1" @click="updatacd">
                  <img :style="{ width: '150px' }" :src="loginCode" alt="" />

                </div>
                <!-- <img src="../../assets/login/wen.jpg" alt="" /> -->
                </Col>
              </Row>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 100%" type="primary" long class="login-btn" :loading="loading"
                @click="login('formValidate1')">
                <span v-if="!loading">登录</span>
                <span v-else>请稍后...</span>
              </el-button>
            </el-form-item>
          </el-form>
          <div class="update-account">
            <span @click="register">创建新账号</span>
            <!-- 忘记密码? -->
            <span @click="forgetPassword"></span>
          </div>
          <div class="Version">Version {{ Version }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { logoName, siteTitle } from "@/config/config";
import { uuid, AllMenu, getNowVersion } from "@/api/user";
import { constantRoutes } from "@/router";
import { mapState } from "vuex";
export default {
  name: "login",
  data() {
    return {
      Visible: true,
      siteTitle: siteTitle,
      logoName: logoName,
      loading: false,
      loginJson: {
        account: "",
        pwd: "",
        id: "",
        answer: ""
      },

      
      loginCheck: {
        account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      loginCode: {
        oneNum: "",
        twoNum: "",
        sreeNum: "",
        fourNum: "",
      },
      roleMenuList: [],
      roleMenu: [],
      codeStatus: 0,
    };
  },
  computed: {
    ...mapState("user", {
      Version: (state) => state.Version,
    }),
  },
  created() {
    this.getVersion();
    if (this.$route.params && this.$route.params.account) {
      this.loginJson.account = this.$route.params.account;
    }


    //请求基础算法验证信息
  },
  mounted() {
    this.getCode();

    // this.bgInit();
    // console.log(process.env.VUE_APP_BASE_API);
  },
  methods: {
    toStrings(e) {
      // this.loginCode.code = e + "";
      // console.log(this.loginCode.code);
    },
    updatacd() {
      this.getCode();
    },
    getCode() {
      this.codeStatus = 0;
      uuid().then((res) => {
        if (res.code == 0) {
          console.log(res, '拿到的登录信息');
          this.loginJson.id = res.data.id;
          this.loginJson.answer = res.data.answer;
          this.loginCode = res.data.b64s
          // let codelist = res.data.code.split("");
          // this.loginCode = {
          //   oneNum: require(`../../assets/login/${codelist[0]}.jpg`),
          //   twoNum: require(`../../assets/login/${codelist[1]}.jpg`),
          //   sreeNum: require(`../../assets/login/${codelist[2]}.jpg`),
          //   fourNum: require(`../../assets/login/${codelist[3]}.jpg`),
          // };
          this.codeStatus = 1;
        }
      })
        .catch((error) => {
          console.log(error);
          this.codeStatus = 2;
        });
    },
    generateRoutes() {
      let normal = ["login", "404"];
      if (this.roleMenu.length) {
        this.roleMenuList = this.roleMenu
          .map((item) => item.url)
          .concat(["Dashboard", ...normal]);
      }
      const accessedRoutes = this.filterAsyncRoutes(constantRoutes, normal);
      const routesName = this.routesItemsNameChange(accessedRoutes); //调整菜单名称
      const routesSort = this.routesItemsSortChange(routesName); // 调整菜单排序
      sessionStorage.setItem("userRoutes", JSON.stringify(routesSort));
      this.loginSuccess();
    },
    /**
     * 通过递归过滤异步路由表·
     * @param routes asyncRoutes
     *
     */
    handle(e) {
      handles;
      console.log(e);
    },
    filterAsyncRoutes(routes, normal) {
      const res = [];
      // 如果不等 那就跳出此次循环
      routes.forEach((route) => {
        if (
          this.roleMenuList.length &&
          !this.roleMenuList.includes(route.name)
        ) {
          route.meta.hide = true;
        } else {
          if (normal.includes(route.name)) {
            route.meta.hide = true;
          } else {
            route.meta.hide = false;
            const tmp = { ...route };
            if (tmp.children) {
              tmp.children = this.filterAsyncRoutes(tmp.children, normal);
            }
            res.push(tmp);
          }
        }
      });

      return res;
    },
    // 调整静态路由菜单名称
    routesItemsNameChange(routes) {
      this.roleMenu.forEach((v1) => {
        routes.forEach((v2) => {
          if (v2.name === v1.url) {
            v2.meta.title = v1.name;
            v2.meta.sort = v1.sort;
            if (v2.children) {
              this.routesItemsNameChange(v2.children);
            }
          }
        });
      });
      return routes;
    },
    // 调整静态路由排序
    routesItemsSortChange(routes) {
      routes.sort((a, b) => {
        if (a.children || b.children) {
          this.routesItemsSortChange(a.children);
        }
        return a.meta.sort - b.meta.sort;
      });
      return routes;
    },
    // 登陆
    login(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginJson)
            .then(() => {
              this.$gtag.event("login", { method: "Google" });
              this.loading = false;
              // console.log(sessionStorage.getItem("userMenu"));
              if (sessionStorage.getItem("userMenu")) {
                this.getAllMenu(sessionStorage.getItem("userMenu"));
                this.getCountryList();
                sessionStorage.setItem("Version", this.Version);
              } else {
                this.loginSuccess();
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    getVersion() {
      getNowVersion().then((res) => {
        if (res.code == 0) {
          let newVersion = res.data.version;
          let nowVersion = sessionStorage.getItem("Version", newVersion);
          this.$store.commit("user/setVersion", newVersion);
          if (newVersion !== nowVersion) {
            sessionStorage.clear();
            location.reload();
            sessionStorage.setItem("Version", newVersion);
          }
        }
      });
    },
    getAllMenu(menu) {
      AllMenu({}).then((res) => {
        let roleMenu = this.getMenuList(res.data, menu.split(","));
        let newArr = [];
        roleMenu.forEach((item) => {
          if (res.data.filter((i) => i.menu_id == item.pid).length) {
            newArr.push(res.data.filter((i) => i.menu_id == item.pid)[0]);
          }
        });
        console.log("roleMenu: ", roleMenu);
        this.roleMenu = [...newArr, ...roleMenu];
        console.log("this.roleMenu: ", this.roleMenu);
        sessionStorage.setItem(
          "roleMenuList",
          JSON.stringify([...newArr, ...roleMenu])
        );
        this.generateRoutes();
        // return;
      });
    },
    /**
     *实现思路就是通过递归函数判断当前节点是否等于要找的
     *节点id，如果不是再判断是否有children节点，再通过
     *递归的方式将children节点传值到函数里面去调用
     *这样就可以通过递归的方式遍历所有树形结构数据
     *找到对应的节点
     ***/
    getMenuList(data, ids) {
      let list = [];
      getTreeItem(data, ids);
      function getTreeItem(data, ids) {
        data.map((item) => {
          if (ids.indexOf(String(item.menu_id)) != -1) {
            // console.log(item);
            list.push(item);
          }
          if (item.children) {
            getTreeItem(item.children, ids);
          }
        });
      }
      return list;
    },
    loginSuccess() {
      this.$Notice.success({
        title: "正常登录成功",
        duration: 1.5,
      });
      this.$router.push({
        name: this.$indexPage,
      });
    },
    // 背景canvas动画
    bgInit() {
      var width,
        height,
        largeHeader,
        canvas,
        ctx,
        circles,
        target,
        animateHeader = true;
      // sta
      var lastTime = 0;
      var vendors = ["ms", "moz", "webkit", "o"];
      for (
        var x = 0;
        x < vendors.length && !window.requestAnimationFrame;
        ++x
      ) {
        window.requestAnimationFrame =
          window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame =
          window[vendors[x] + "CancelAnimationFrame"] ||
          window[vendors[x] + "CancelRequestAnimationFrame"];
      }

      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }
      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
      // end

      // Main
      initHeader();
      addListeners();

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: 0, y: height };

        largeHeader = document.getElementById("large-header");
        largeHeader.style.height = height + "px";

        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        // create particles
        circles = [];
        for (var x = 0; x < width * 0.5; x++) {
          var c = new Circle();
          circles.push(c);
        }
        animate();
      }

      // Event handling
      function addListeners() {
        window.addEventListener("scroll", scrollCheck);
        window.addEventListener("resize", resize);
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in circles) {
            circles[i].draw();
          }
        }
        requestAnimationFrame(animate);
      }

      // Canvas manipulation
      function Circle() {
        var _this = this;

        // constructor
        (function () {
          _this.pos = {};
          init();
        })();

        function init() {
          _this.pos.x = Math.random() * width;
          _this.pos.y = height + Math.random() * 100;
          _this.alpha = 0.1 + Math.random() * 0.3;
          _this.scale = 0.1 + Math.random() * 0.3;
          _this.velocity = Math.random();
        }

        this.draw = function () {
          if (_this.alpha <= 0) {
            init();
          }
          _this.pos.y -= _this.velocity;
          _this.alpha -= 0.0005;
          ctx.beginPath();
          ctx.arc(
            _this.pos.x,
            _this.pos.y,
            _this.scale * 10,
            0,
            2 * Math.PI,
            false
          );
          ctx.fillStyle = "rgba(255,255,255," + _this.alpha + ")";
          ctx.fill();
        };
      }
    },
    // 切换选项卡
    handleTabClick(tab, event) {
      this.tab = tab.index;
      this.loginJson = {};
    },
    register() {
      this.$router.push("register");
    },
    forgetPassword() {
      this.$router.push("forget-password");
    },
  },
  watch: {},
  filters: {},
};
</script>

<style lang="less">
.login-container {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/logo//background.jpg");
  background-size: 100% 100%;
}

.handle {
  padding-top: 25px;
}

.main {
  position: absolute;
  width: 1000px;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // background: url("../../assets/login/login-box-bg.png");
  background-position: 10% 40%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // box-shadow: 0 12px 16px 0  rgba(0,0,0,0.24), 0 17px 50px 0 #4E655D;
}

.login-box {
  /* display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center; */
  position: absolute;
  top: 27%;
  left: 10%;
}

.user-operation {
  font-size: 23px;
  color: rgb(32, 38, 47);
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
}

.login-btn {
  width: 100%;
  background: #0fc1af;
  color: #fff;
  text-align: center;
  border-radius: 3px;
}

.update-account {
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  margin-top: 10px;
}

.loginbox-left {
  margin-left: -100px;
}

.loginbox-left>.logo {
  font-size: 32px;
  color: #ffff;
  font-weight: bold;
}

.loginbox-left>.title {
  font-size: 70px;
  color: #0fc1af;
  padding: 10px 0px 0px 5px;
  margin-left: -90px;
}

.loginbox-right {
  position: fixed;
  right: 11%;
  top: 20%;
  background: #fff;
  padding: 30px;
}

.code {
  width: 330px;
  height: 50px;
}

.Version {
  font-size: 16px;
  text-align: center;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.loginbox-left {
  position: relative;
}

.update_log {
  color: white;
  position: absolute;
  left: -35px;
  bottom: -140px;
  cursor: pointer;
}
</style>
