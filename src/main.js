import Vue from "vue";
import App from "./App.vue";
import router from "./router"; // 路由
import "./router/permission"; // 加载路由权限控制
import store from "./store";
import "babel-polyfill"; // 解决ie兼容问题
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import "./css/public.less"; // 公共css样式
import global from "./utils/global"; //公共方法
import moment from "moment"; //时间转换
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
import "./css/theme/index.css"
import Chat from "vue-beautiful-chat";
import copy from './utils/v-copy'
import VueScrollTo from 'vue-scrollto'
import {expandClick,selectWrap,debounce,permission} from './utils/Instruction Set' //自定义指令
import Contextmenu from "vue-contextmenujs";
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer) 
// 引入 vue-gtag
import VueGtag from 'vue-gtag'
Vue.use(VueGtag, {
  config: { id: process.env.VUE_APP_API_GTAG_ID }
}, router);
Vue.use(Contextmenu)
Vue.use(VueScrollTo)
Vue.use(Chat);
Vue.use(ElementUI);
Vue.use(ViewUI);
// 工具
import { backPage, isNotNull, isBlank, simpleVerify, cloneObj } from "./utils/util";
console.log(window.location.origin)
// 配置文件
import { indexPage, loginPage } from "./config/config";

// 防止用户修改或删除缓存
window.addEventListener('storage', (e) => {
  sessionStorage.setItem(e.key, e.oldValue); //重新赋值修改前的值
});

Vue.prototype.$cloneObj = cloneObj;
Vue.prototype.$backPage = backPage;
Vue.prototype.$isNotNull = isNotNull;
Vue.prototype.$isBlank = isBlank;
Vue.prototype.simpleVerify = simpleVerify;
Vue.prototype.$loginPage = loginPage;
Vue.prototype.$indexPage = indexPage;
Vue.prototype.$global = global;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
// 在main.js文件中准备一个滚动加载指令

Vue.directive('enterNextInput', {
  inserted: function (el, callback) {
      el.addEventListener("keypress",function(e){
          e = e || window.event;
          let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
          if(charcode == 13){
              var dom = document.getElementsByClassName('input')
              let list = []
              for (let i = 0; i < dom.length; i++) {
                  let node = dom[i].childNodes;
                  if(node.length > 0){
                      node.forEach(v=>{
                          if(v.nodeName == 'TEXTAREA' || v.nodeName == 'INPUT'){
                              list.push(v)
                          }
                      })
                  }
              }
              for(let j = 0; j <= list.length ;j++){
                  if (list[j] == document.activeElement) {
                      if (j ==list.length-1) {
                          return
                      }
                      list[j+1].focus()
                      return
                  }
              }
          }
      });
  }
});



Vue.directive('loadmore', {
  bind(el, binding) {
    selectWrap(el, binding)
  },
})
Vue.directive('permission', {
  inserted(el, binding,arr){
    permission(el, binding)
  }
}),
Vue.directive('expandClick', {
  bind(el, binding){
    expandClick(el, binding)
  }
})
// 自定义一键复制指令
Vue.directive('copy', copy)
//封装防抖函数
Vue.directive('debounce', {
  bind(el, binding) {
    debounce(el, binding)
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
