import request from "./request";

// 新增广告
export function addAdver(data) {
    return request({ url: "/advertise/add", data });
}
//删除广告
export function delAdver(data) {
    return request({ url: "/advertise/del", data });
}
//更新广告
export function updateAdver(data) {
    return request({ url: "/advertise/update", data });
}
//获取广告
export function getdataAdver(data) {
    return request({ url: "/advertise/getdata", data });
}
//广告三十天点击统计
export function getadvertisestatistics(data) {
    return request({ url: "/advertise/getadvertisestatistics", data });
}
//统计每天和每月
export function getadvertisestatisticstotal(data) {
    return request({ url: "/advertise/getadvertisestatisticstotal", data });
}

