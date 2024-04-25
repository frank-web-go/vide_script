import request from "./request";


//添加标签
export function addoneTags(data) {
    return request({ url: "/tag/addone", data });
}
//获取标签
export function pageTags(data) {
    return request({ url: "/tag/page", data });
}
//删除标签
export function deletemanyTags(data) {
    return request({ url: "/tag/deletemany", data });
}
//更新标签
export function updateoneTags(data) {
    return request({ url: "/tag/updateone", data });
}
//添加语言
export function addoneLan(data) {
    return request({ url: "/language/addone", data });
}
//获取语言
export function pageLan(data) {
    return request({ url: "/language/page", data });
}
//删除语言
export function deletemanyLan(data) {
    return request({ url: "/language/deletemany", data });
}
//更新语言
export function updateoneLan(data) {
    return request({ url: "/language/updateone", data });
}
//添加地区
export function addoneArea(data) {
    return request({ url: "/area/addone", data });
}
//获取地区
export function pageArea(data) {
    return request({ url: "/area/page", data });
}
//删除地区
export function deletemanyArea(data) {
    return request({ url: "/area/deletemany", data });
}
//更新地区
export function updateoneArea(data) {
    return request({ url: "/area/updateone", data });
}
//获取所有地区
export function GetAreaall(data) {
    return request({ url: "/area/all", data });
}
//获取所有标签
export function GetTagall(data) {
    return request({ url: "/tag/all", data });
}
//获取所有语言
export function GetLanall(data) {
    return request({ url: "/language/all", data });
}

//批量修改字典
export function editDicionarys(data) {
    return request({ url: "/movie/updatemany", data });
}