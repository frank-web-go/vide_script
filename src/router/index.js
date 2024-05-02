import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import Main from "@/components/main/main";

/**
 meta: {
    hide: false, 是否在左侧菜单显示 不显示请设为 true
    title: "列表页面", 菜单标题
    icon: "md-grid", 图标
    roleId: 1 菜单权限id 不填写等同于不需要权限校验
    singlePage: true 单页 非嵌套栏目显示
}
 */

// 不需静态路由
export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    meta: {
      hide: true,
      title: "登录",
    },
    component: () => import("@/views/login/login"),
  },
  {
    path: "/register",
    name: "register",
    meta: {
      hide: true,
      title: "注册",
    },
    component: () => import("@/views/login/register"),
  },
  {
    path: "/forget-password",
    name: "forget-password",
    meta: {
      hide: true,
      title: "忘记密码",
    },
    component: () => import("@/views/login/fogetPassword"),
  },
  {
    path: "*",
    meta: {
      title: "404",
      hide: true,
    },
    component: () => import("@/views/error/404"),
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    meta: {
      title: "401",
      hide: true,
    },
  },
  {
    path: "/Dashboard",
    name: "home",
    component: Main,
    meta: {
      hide: false,
      title: "首页",
      img: "Home.png",
      singlePage: true,
      sort: 0,
    },
    children: [
      {
        path: "home",
        name: "home",
        meta: {
          title: "首页",
          hide: false,
          sort: 0,
        },
        component: () => import("@/views/home/home"),
      },
    ],
  },

  {
    path: "/equipement",
    name: "equipement",
    component: Main,
    meta: {
      hide: false,
      img: "shaihao.png",
      title: "设备管理",
      sort: 0,
    },
    children: [
      {
        path: "/equipement/detail",
        name: "equipement-detail",
        meta: {
          hide: false,
          title: "设备详情",
          sort: 0,
        },
        component: () => import("@/views/equipment/detail.vue"),
      },
      {
        path: "/equipement/host",
        name: "equipement-host",
        meta: {
          hide: false,
          title: "主机管理",
          sort: 0,
        },
        component: () => import("@/views/equipment/host.vue"),
      },
      {
        path: "/host/detail",
        name: "host-detail",
        meta: {
          hide: false,
          title: "主机详情",
          sort: 0,
        },
        component: () => import("@/views/equipment/component/hostDetail.vue"),
      },
    ],
  },
  {
    path: "/task",
    name: "task",
    component: Main,
    meta: {
      hide: false,
      img: "shaihao.png",
      title: "任务管理",
      sort: 0,
    },
    children: [
      {
        path: "/task/taskmanagement",
        name: "taskmanagement",
        meta: {
          hide: false,
          title: "发送任务",
          sort: 0,
        },
        component: () => import("@/views/task/task.vue"),
      },
      {
        path: "/equipement/taskcollection",
        name: "equipement-taskcollection",
        meta: {
          hide: false,
          title: "采集任务",
          sort: 0,
        },
        component: () => import("@/views/equipment/task.vue"),
      },
      {
        path: "/task/detail",
        name: "taskdetail",
        meta: {
          hide: false,
          title: "任务详情",
          sort: 0,
        },
        component: () => import("@/views/task/component/detail"),
      },
      {
        path: "/task/successuser",
        name: "successuser",
        meta: {
          hide: false,
          title: "快手用户",
          sort: 0,
        },
        component: () => import("@/views/successuser/successuser.vue"),
      },
    ],
  },
  {
    path: "/dictionary",
    name: "dictionary",
    component: Main,
    meta: {
      hide: false,
      img: "shaihao.png",
      title: "字典管理",
      sort: 0,
    },
    children: [
      {
        path: "/dictionary/classification",
        name: "classification",
        meta: {
          hide: false,
          title: "分类管理",
          sort: 0,
        },
        component: () =>
          import("@/views/video/Classification/classification.vue"),
      },
      {
        path: "/dictionary/tags",
        name: "tags",
        meta: {
          hide: false,
          title: "标签管理",
          sort: 0,
        },
        component: () => import("@/views/dictionary/Tags/index.vue"),
      },
      {
        path: "/dictionary/language",
        name: "language",
        meta: {
          hide: false,
          title: "语言管理",
          sort: 0,
        },
        component: () => import("@/views/dictionary/language/index.vue"),
      },
      {
        path: "/dictionary/area",
        name: "area",
        meta: {
          hide: false,
          title: "地区管理",
          sort: 0,
        },
        component: () => import("@/views/dictionary/area/index.vue"),
      },
      {
        path: "/dictionary/domain",
        name: "domain",
        meta: {
          hide: false,
          title: "域名管理",
          sort: 0,
        },
        component: () => import("@/views/dictionary/domain/index.vue"),
      },
    ],
  },
  {
    path: "/internatdictionary",
    name: "internatdictionary",
    component: Main,
    meta: {
      hide: false,
      img: "shaihao.png",
      title: "国际化管理",
      sort: 0,
    },
    children: [
      {
        path: "/internatdictionary/classification",
        name: "internatdictionary-classification",
        meta: {
          hide: false,
          title: "分类国际化管理",
          sort: 0,
        },
        component: () =>
          import(
            "@/views/internatdictionary/Classification/classification.vue"
          ),
      },
      {
        path: "/internatdictionary/tags",
        name: "internatdictionary-tags",
        meta: {
          hide: false,
          title: "标签国际化管理",
          sort: 0,
        },
        component: () => import("@/views/internatdictionary/Tags/index.vue"),
      },
      {
        path: "/internatdictionary/language",
        name: "internatdictionary-language",
        meta: {
          hide: false,
          title: "语言国际化管理",
          sort: 0,
        },
        component: () =>
          import("@/views/internatdictionary/language/index.vue"),
      },
      {
        path: "/internatdictionary/area",
        name: "internatdictionary-area",
        meta: {
          hide: false,
          title: "地区国际化管理",
          sort: 0,
        },
        component: () => import("@/views/internatdictionary/area/index.vue"),
      },
      {
        path: "/internatdictionary/movie",
        name: "internatdictionary-movie",
        meta: {
          hide: false,
          title: "影片国际化管理",
          sort: 0,
        },
        component: () => import("@/views/internatdictionary/movie/index.vue"),
      },
    ],
  },
  {
    path: "/permissions",
    name: "permissions",
    component: Main,
    meta: {
      hide: false,
      title: "权限管理",
      img: "permission.png",
      sort: 0,
    },
    children: [
      {
        path: "/permissions/menuSet",
        name: "menuSet",
        meta: {
          hide: false,
          title: "菜单管理",
          sort: 0,
        },
        component: () => import("@/views/permissions/menuSet"),
      },
      {
        path: "/permissions/account",
        name: "account",
        meta: {
          hide: false,
          title: "用户管理中心",
          sort: 0,
        },
        component: () => import("@/views/permissions/account"),
      },
      {
        path: "/permissions/roleSet",
        name: "roleSet",
        meta: {
          hide: false,
          title: "角色管理",
          sort: 0,
        },
        component: () => import("@/views/permissions/roleSet"),
      },
      {
        path: "/permissions/sysSet",
        name: "sysSet",
        meta: {
          hide: false,
          title: "系统配置",
          sort: 0,
        },
        component: () => import("@/views/permissions/sysSet"),
      },
      {
        path: "/permissions/sysLog",
        name: "sysLog",
        meta: {
          hide: false,
          title: "操作日志",
          sort: 0,
        },
        component: () => import("@/views/permissions/sysLog"),
      },
    ],
  },
  // 系统工具
  {
    path: "/systemTool",
    name: "systemTool",
    component: Main,
    meta: {
      hide: false,
      img: "shaihao.png",
      title: "系统工具",
      sort: 0,
    },
    children: [
      // 服务监控
      {
        path: "/systemTool/serviceMonitor",
        name: "serviceMonitor",
        meta: {
          hide: false,
          title: "服务监控",
          sort: 0,
        },
        component: () => import("@/views/systemTool/serviceMonitor"),
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}
// 解决跳转同一个路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
