import { constantRoutes } from "@/router";

/**
 * 使用确定当前用户是否具有权限
 *
 * @param route
 */

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 *
 */
let roleMenu = JSON.parse(sessionStorage.getItem("roleMenuList")) || [];
// console.log(roleMenu)
let roleMenuList = [];
if (roleMenu.length) {
  roleMenuList = roleMenu
    .map((item) => item.url)
    .concat(["Dashboard", "login", "404"]);
}
export function filterAsyncRoutes(routes) {
  // console.log(routes,'我的数据');
  const res = [];
  // 如果不等 那就跳出此次循环
  routes.forEach((route) => {
    // route.path != '/' ||
    // if (roleMenuList.length && !roleMenuList.includes(route.name)) {
    //   route.meta.hide = true;
    // } else {
      const tmp = { ...route };
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children);
      }
      res.push(tmp);
    // }
  });

  return res;
}

const state = {
  // 所有有权限的路由
  routes: [],
  // 异步路由
  addRoutes: [],
};
// 处理路由数据 添加父级name
const routersArr = (routers) => {
  for (let v of routers) {
    if (v.children) {
      setFuName(v.children, v);
    }
    function setFuName(chid, v) {
      // 开始处理子级
      for (let k of chid) {
        k.meta.fuName = v.name;
        k.meta.fuTitle = v.meta.title;
      }
    }
  }
  return routers;
};

const mutations = {
  setRoutes: (state, routes) => {
    state.addRoutes = routes;
    state.routes = routersArr(routes);
  },
};

const actions = {

  generateRoutes({ commit }) {
    return new Promise(async (resolve) => {
      const accessedRoutes = filterAsyncRoutes(constantRoutes);

      commit("setRoutes", accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
