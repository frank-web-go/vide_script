<template>
  <div class="login-container">
    <!-- <div class="svg-login-bg"><img src="" alt=""></div> -->
    <div class="main">
      <!-- 整个注册盒子 -->
      <div class="login-box">
        <!-- 左侧的注册盒子 -->
        <div class="loginbox-left">
          <!-- <div class="logo">
            <img
              src="../../assets/logo/logo-white.png"
              alt=""
              style="width: 300px"
            />
          </div> -->
          <div class="title">{{ siteTitle }}</div>
        </div>
        <!-- 右侧的注册盒子 -->
        <div class="loginbox-right">
          <div class="user-operation">重置密码</div>
          <el-form
            ref="formValidate1"
            class="login-from"
            :model="resetJson"
            :rules="resetCheck"
          >
            <el-form-item prop="account">
              <el-input
                prefix="ios-person-outline"
                type="text"
                v-model="resetJson.account"
                autofocus
                auto-complete="off"
                clearable
                placeholder="请输入用户名"
              >
                <i class="el-icon-user-solid el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                prefix="ios-lock-outline"
                type="password"
                auto-complete="new-password"
                v-model="resetJson.password"
                clearable
                placeholder="请输入新密码"
              >
                <i class="el-icon-lock el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="passWord2">
              <el-input
                prefix="ios-lock-outline"
                type="password"
                auto-complete="new-password"
                v-model="resetJson.passWord2"
                clearable
                placeholder="请确认新密码"
              >
                <i class="el-icon-lock el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                style="width: 100%"
                type="primary"
                long
                :loading="loading"
                @click="reset('formValidate1')"
              >
                <span v-if="!loading">重置</span>
                <span v-else>请稍后...</span>
              </el-button>
            </el-form-item>
          </el-form>
          <div class="Version">Version {{ Version }}</div>
          <div class="update-account">
            <span @click="hadAccount">已有账号？</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { siteTitle } from "@/config/config";
import { mapState } from "vuex";

export default {
  name: "login",
  data() {
    return {
      siteTitle: siteTitle,
      loading: false,
      resetJson: {
        account: "",
        password: "",
        passWord2: "",
      },
      resetCheck: {
        account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        password: [
          {
            required: true,
            trigger: "blur",
            min: 6,
            max: 18,
            validator: (rule, value, callback) => {
              let reg = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9_]{5,17}$/);
                  if (!reg.test(value) || !value) {
                    callback("请输入6~18位英文字母，数字，或数字字母组合");
                  } else {
                    callback();
                  }
                }
            }
        ],
        passWord2: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入确认密码");
              } else if (this.registerJson["passWord"] != value) {
                callback("请输入相同密码");
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapState("user", {
      Version: (state) => state.Version,
    }),
  },
  created() {},
  mounted() {},
  methods: {
    hadAccount() {
      this.$router.back();
    },
    // 重置
    reset(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true;
     
            // .catch(() => {
            //   this.loading = false;
            // });
        }
      });
    },
    resetSuccess() {
      this.$Notice.success({
        title: "重置成功",
        duration: 1.5,
      });
      this.$router.push({
        name: login,
        params:{
          account:''
        }
      });
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
  background-image: url("../../assets/login/login-bg.png");
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
  top: 35%;
  left: 15%;
}

.user-operation {
  font-size: 23px;
  color: #409eff;
  text-align: center;
  margin-bottom: 30px;
}

.update-account {
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  color: #409eff;
  font-weight: 600;
  margin-top: 10px;
}

.loginbox-left > .logo {
  font-size: 32px;
  color: #ffff;
  font-weight: bold;
}

.loginbox-left > .title {
  font-size: 25px;
  color: #ffff;
  padding: 10px 0px 0px 65px;
}

.loginbox-right {
  position: fixed;
  right: 11%;
  top: 20%;
  width: 300px;
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
