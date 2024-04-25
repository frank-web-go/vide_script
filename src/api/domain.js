import request from "./request";

// 添加域名
export function add(data) {
    return request({ url: "/domain/addone", data });
}

// 修改域名
export function update(data) {
    return request({ url: "/domain/updateone", data });
}

// 删除域名
export function del(data) {
    return request({ url: "/domain/deletemany", data });
}

// 获取域名
export function getDomains(data) {
    return request({ url: "/domain/page", data });
}

// 修改状态
export function updateStatus(data) {
    return request({ url: "/domain/updateactive", data });
}