import request from "./request";

//添加分类
export function addone(data) {
    return request({ url: "/category/addone", data });
}
//获取树形广告分类
export function getallFclass(data) {
    return request({ url: "/category/all", data });
}
//删除广告
export function deletemany(data) {
    return request({ url: "/category/deletemany", data });
}
//修改分类
export function updateone(data) {
    return request({ url: "/category/updateone", data });
}
// ------------------------------ 国家化 -----------------------------
//获取全部分类
export function allnotree(data) {
    return request({ url: "/category/allnotree", data });
}
//新增分类
export function i18naddone(data) {
    return request({ url: "/i18ncategory/addone", data });
}
//修改分类
export function i18nupdateone(data) {
    return request({ url: "/i18ncategory/updateone", data });
}
//删除分类
export function i18ndeletemany(data) {
    return request({ url: "/i18ncategory/deletemany", data });
}
//查询分类
export function i18npage(data) {
    return request({ url: "/i18ncategory/page", data });
}