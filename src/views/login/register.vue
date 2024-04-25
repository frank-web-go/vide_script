<template>
  <div class="login-container">
    <!-- <div class="svg-login-bg"><img src="" alt=""></div> -->
    <div class="main">
      <!-- 整个注册盒子 -->
      <div class="login-box">
        <!-- 左侧的注册盒子 -->
        <div class="loginbox-left">
          <div class="logo">
            <img
              src="../../assets/logo/beidou.svg"
              alt=""
              style="width: 220px"
            />
          </div>
          <div class="title">{{ siteTitle }}</div>
        </div>
        <!-- 右侧的注册盒子 -->
        <div class="loginbox-right">
          <div class="user-operation">用户注册</div>
          <el-form
            ref="formValidate1"
            class="login-from"
            :model="registerJson"
            :rules="registerCheck"
            @keydown.native.enter.prevent="register('formValidate1')"
          >
            <el-form-item prop="account">
              <el-input
                prefix="ios-person-outline"
                type="text"
                v-model="registerJson.account"
                autofocus
                auto-complete="off"
                clearable
                placeholder="请输入用户名"
              >
                <i class="el-icon-user-solid el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pwd_">
              <el-input
                prefix="ios-lock-outline"
                type="password"
                auto-complete="new-password"
                v-model="registerJson.pwd_"
                clearable
                placeholder="请输入密码"
              >
                <i class="el-icon-lock el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pwd2_">
              <el-input
                prefix="ios-lock-outline"
                type="password"
                auto-complete="new-password"
                v-model="registerJson.pwd2_"
                clearable
                placeholder="请确认密码"
              >
                <i class="el-icon-lock el-input__icon" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item class="code" prop="code">
              <Row>
                <Col span="13">
                  <el-input
                    prefix="ios-lock-outline"
                    @input="toStrings"
                    v-model="registerJson.code"
                    clearable
                    placeholder="请输入验证码"
                  >
                  </el-input>
                </Col>
                <Col span="11">
                  <el-button
                    disabled
                    v-if="codeStatus === 0"
                    style="margin-left: 10px"
                    type="primary"
                    :loading="true"
                    >加载中</el-button
                  >
                  <el-button
                    v-if="codeStatus === 2"
                    @click="updatacd"
                    style="margin-left: 10px"
                    type="warning"
                    >点击重试<i class="el-icon-refresh-right"></i
                  ></el-button>
                  <div v-if="codeStatus === 1" @click="updatacd">
                    <img :src="registerCode.oneNum" alt="" />
                    <img :src="registerCode.twoNum" alt="" />
                    <img :src="registerCode.sreeNum" alt="" />
                    <img :src="registerCode.fourNum" alt="" />
                  </div>
                  <!-- <img src="../../assets/login/wen.jpg" alt="" /> -->
                </Col>
              </Row>
            </el-form-item>
            <el-form-item>
              <div
                class="register-btn"
                :loading="loading"
                @click="register('formValidate1')"
              >
                <span v-if="!loading">注册</span>
                <span v-else>请稍后...</span>
              </div>
            </el-form-item>
          </el-form>
          <div class="update-account">
            <span @click="hadAccount">已有账号？</span>
          </div>
          <div class="Version">Version {{ Version }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { siteTitle } from "@/config/config";
import { mapState } from "vuex";
import md5 from "js-md5";
import { regesiter, getRegisterCode, getNowVersion } from "@/api/user";

export default {
  name: "login",
  data() {
    return {
      UUID: "",
      siteTitle: siteTitle,
      loading: false,
      registerJson: {
        account: "",
        pwd: "",
        pwd_: "",
        pwd2: "",
        pwd2_: "",
        code: "",
      },
      registerCheck: {
        account: [{ required: true, trigger: "blur", message: "请输入用户名" }],
        pwd_: [
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
            },
          },
        ],
        pwd2_: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入确认密码");
              } else if (this.registerJson["pwd_"] != value) {
                callback("请输入相同密码");
              } else {
                callback();
              }
            },
          },
        ],
        code: [
          {
            required: true,
            type: "string",
            pattern: /^[+-]?\d+(\.\d+)?$/,
            message: "请输入正确验证码",
            trigger: "blur",
          },
        ],
      },
      registerCode: {
        oneNum: "",
        twoNum: "",
        sreeNum: "",
        fourNum: "",
      },
      codeStatus: 0,
    };
  },
  computed: {
    ...mapState("user", {
      Version: (state) => state.Version,
    }),
  },
  created() {
    this.UUID = Math.random();
    localStorage.setItem("uuid", this.UUID);
    console.log(this.UUID);
    this.getVersion();
  },
  mounted() {
    this.getCode();
  },
  methods: {
    hadAccount() {
      this.$router.push("/login");
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
    toStrings(e) {
      this.registerCode.code = e + "";
      console.log(this.registerCode.code);
    },
    updatacd() {
      this.getCode();
    },
    getCode() {
      this.codeStatus = 0;
      getRegisterCode({ uuid: String(this.UUID) })
        .then((res) => {
          if (res.code == 0) {
            let codelist = res.data.code.split("");
            this.registerCode = {
              oneNum: require(`../../assets/login/${codelist[0]}.jpg`),
              twoNum: require(`../../assets/login/${codelist[1]}.jpg`),
              sreeNum: require(`../../assets/login/${codelist[2]}.jpg`),
              fourNum: require(`../../assets/login/${codelist[3]}.jpg`),
            };
            this.codeStatus = 1;
          }
        })
        .catch((error) => {
          console.log(error);
          this.codeStatus = 2;
        });
    },
    // 注册
    register(name) {
      // this.registerJson
      console.log("this.registerJson: ", this.registerJson);
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.registerJson.pwd = md5(this.registerJson.pwd_);
          this.registerJson.pwd2 = this.registerJson.pwd_;
          this.registerJson.uuid = localStorage.getItem("uuid");
          this.registerJson.code = this.registerJson.code;
          regesiter(this.registerJson)
            .then((res) => {
              if (res.code == 0) {
                this.loading = false;
                this.registerSuccess();
              }
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    registerSuccess() {
      this.$Notice.success({
        title: "注册成功",
        duration: 1.5,
      });
      setTimeout(() => {
        this.$router.push({
          name: "login",
          params: {
            account: this.registerJson.account,
          },
        });
      }, 1000);
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
  background-image: url("../../assets/logo/background.jpg");
  background-size: 100% 100%;
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
  left: 15%;
}

.user-operation {
  font-size: 23px;
  color: rgb(32, 38, 47);
  text-align: center;
  margin-bottom: 30px;
  font-weight: 600;
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

.register-btn {
  width: 100%;
  background: #0fc1af;
  color: #fff;
  text-align: center;
  border-radius: 3px;
}

.loginbox-left {
  margin-left: -150px;
}

.loginbox-left > .logo {
  font-size: 32px;
  color: #ffff;
  font-weight: bold;
}

.loginbox-left > .title {
  font-size: 70px;
  color: #0fc1af;
  padding: 10px 0px 0px 65px;
  margin-left: -90px;
}

.loginbox-right {
  position: fixed;
  right: 11%;
  top: 20%;
  background: #fff;
  width: 400px;
  padding: 30px;
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
