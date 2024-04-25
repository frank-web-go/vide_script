import { login, uuid } from "@/api/user";
import md5 from "js-md5";
const state = {
  // 用户信息数据
  userData: sessionStorage.getItem("userData") ? sessionStorage.getItem("userData") : "",
  // 是否登陆
  isLogin: sessionStorage.getItem("userData") ? true : false,
  //客户端版本号
  Version: '1.0.0',
  logvisible: true
};

const mutations = {
  // 设置用户数据
  setUserData(state, data) {
    state.userData = data;
  },
  // 修改登陆状态
  setIsLogin(state, data) {
    state.isLogin = data;
  },
  setVersion(state, data) {
    state.Version = data
  }
};

const actions = {
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      let data = {...userInfo}
      data.pwd = md5(data.pwd)
        login(data).then((response) => {
          const { data } = response;
          sessionStorage.setItem("userData", data.uid);
          if (data.menu) {
            sessionStorage.setItem("userMenu", data.menu);
            sessionStorage.setItem("userToken", data.token);
            sessionStorage.setItem("userName", data.name);
            sessionStorage.setItem("userAccount", userInfo.account);
          }

          // commit('setUserData', data)
          // 设置登录状态为false
          commit("setIsLogin", true);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!sessionStorage.getItem("userData")) {
        reject("验证失败，请重新登录");
      }
      // const userInfo = JSON.parse(sessionStorage.getItem('userData'))
      // if(!userInfo.roles) {
      //     console.error('权限不能为空数组，否则路由死循环')
      //     return
      // }
    });
  },

  // 退出登录
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // commit('setToken', '')
      // 清除用户数据
      commit("setUserData", "");
      // 设置登录状态为false
      commit("setIsLogin", false);
      // 清除缓存的用户数据
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("userName");
      // 清除缓存的多页签数据
      dispatch("tagsView/setRouterArr", [], { root: true });
      localStorage.removeItem("dataRouter");

      resolve();
    });
  },

  // 设置用户数据
  setUserData(context, data) {
    context.commit("setUserData", data);
  },
  // 修改登陆状态
  setIsLogin(context, data) {
    context.commit("setIsLogin", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
