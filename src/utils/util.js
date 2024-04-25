import router from "@/router";

// 判断是否为空 不为空返回数据 为空返回--
export const isNotNull = (data, str) => {
  if (isBlank(str)) {
    str = "--";
  }
  if (data == null || data === "null" || data === "" || data === undefined || data === "undefined" || data === "unknown") {
    return str;
  } else {
    return data;
  }
};

// 判断是否为空 返回true/false
export const isBlank = (data) => {
  if (data == null || data === "null" || data === "" || data === undefined || data === "undefined" || data === "unknown") {
    return true;
  } else {
    return false;
  }
};

// 返回上一页
export const backPage = () => {
  router.go(-1);
};
//验证信息
export const simpleVerify = (message) => {
  return (rule, value, callback) => {
    if (!value) {
      callback(message);
    } else {
      callback();
    }
  };
};
export function initParams(params = {}) {
  return Object.assign(
    {
      page: 1,
      limit: 100,
    },
    params
  );
}

export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function cloneObj(obj) {
  var str,
    newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  } else if (window.JSON) {
    (str = JSON.stringify(obj)), //系列化对象
      (newobj = JSON.parse(str)); //还原
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === "object" ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
}
