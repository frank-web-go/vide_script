import request from "./request";

//文件上传
export function uploadfiles(data) {
    return request({ url: "/fileopt/uploadfiles", data });
}
// 上传视频
export function uploadblob(data) {
    return request({ url: "/publicmethod/uploadblob", data });
}
//合并视频
export function mergechunks(data) {
    return request({ url: "/publicmethod/mergechunks", data });
}
//添加影片
export function addone(data) {
    return request({ url: "/movie/addone", data });
}
//获取影片
export function pageMovie(data) {
    return request({ url: "/movie/page", data });
}
//获取回收站影片
export function pageMovieDel(data) {
    return request({ url: "/movie/pagedel", data });
}
// 回收站影片删除
export function recycleDel(data) {
    return request({ url: "/movie/deletemanyreal", data });
}
// 回收站影片恢复
export function recycleReset(data) {
    return request({ url: "/movie/recovery" , data});
}
//删除影片
export function deletemany(data) {
    return request({ url: "/movie/deletemany", data });
}
//更新影片信息
export function updateone(data) {
    return request({ url: "/movie/updateone", data });
}
//批量上下架
export function Batchpublic(data) {
    return request({ url: "/movie/public", data });
}
//添加展示
export function addPriority(data) {
    return request({ url: "/prioritydisplay/add", data });
}
//删除展示
export function delPriority(data) {
    return request({ url: "/prioritydisplay/del", data });
}
//更新展示
export function updatePriority(data) {
    return request({ url: "/prioritydisplay/update", data });
}
//获取展示
export function getdataPriority(data) {
    return request({ url: "/prioritydisplay/getdata", data });
}
//查看文件信息
export function getfileinfo(data) {
    return request({ url: "/fileopt/getfileinfo", data });
}