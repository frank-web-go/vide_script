import request from "./request";

export function addDevice(data) {
    return request({ url: "/device/addone", data });
}

export function updateDevice(data) {
    return request({ url: "/device/updateone", data });
}

export function delDevice(data) {
    return request({ url: "/device/deletemany", data });
}

export function getDevice(data) {
    return request({ url: "/device/page", data });
}


