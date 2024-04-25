import request from "./request";

//获取标签
export function PageTag(data) {
    return request({ url: "/i18ntag/page", data });
}
//添加标签
export function AddoneTag(data) {
    return request({ url: "/i18ntag/addone", data });
}
//更新标签
export function updateoneTag(data) {
    return request({ url: "/i18ntag/updateone", data });
}
//删除标签
export function deletemanyTag(data) {
    return request({ url: "/i18ntag/deletemany", data });
}
//新增语言
export function addoneLang(data) {
    return request({ url: "/i18nlanguage/addone", data });
}
//添加语言
export function pageLang(data) {
    return request({ url: "/i18nlanguage/page", data });
}
//更新语言
export function updateoneLang(data) {
    return request({ url: "/i18nlanguage/updateone", data });
}
//删除语言
export function deleteLang(data) {
    return request({ url: "/i18nlanguage/deletemany", data });
}
//新增地区
export function addoneArea(data) {
    return request({ url: "/i18narea/addone", data });
}
//添加地区
export function pageArea(data) {
    return request({ url: "/i18narea/page", data });
}
//更新地区
export function updateoneArea(data) {
    return request({ url: "/i18narea/updateone", data });
}
//删除地区
export function deleteArea(data) {
    return request({ url: "/i18narea/deletemany", data });
}
//删除影片翻译
export function movieDel(data) {
    return request({ url: "/i18nmovie/deletemany", data });
}

// 获取影片翻译
export function moviePage(data) {
    return request({ url: "/i18nmovie/page", data });
}

// 修改影片翻译
export function movieUpdate(data) {
    return request({ url: "/i18nmovie/updateone", data });
}

// 获取所有标签
export function allTag(data) {
    return request({ url: "/tag/all", data });
}
// 获取所有语言
export function allLang(data) {
    return request({ url: "/language/all", data });
}

// 获取所有地区
export function allArea(data) {
    return request({ url: "/area/all", data });
}