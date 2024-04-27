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
<<<<<<< HEAD


=======
export function getAllDevice(data) {
    return request({ url: "/device/all", data });
}

export function getTask(data) {
    return request({ url: "/task/page", data });
}
export function AllTask(data) {
    return request({ url: "/task/all", data });
}
export function DeleteManyTask(data) {
    return request({ url: "/task/deletemany", data });
}
export function UpdateOneTask(data) {
    return request({ url: "/task/updateone", data });
}
export function AddOneTask(data) {
    return request({ url: "/task/addone", data });
}

export function AddKwai(data) {
    return request({ url: "/kwaiuser/addone", data });
}
export function UpdateeKwai(data) {
    return request({ url: "/kwaiuser/updateone", data });
}
export function DeleteKwai(data) {
    return request({ url: "/kwaiuser/deletemany", data });
}
export function PageKwai(data) {
    return request({ url: "/kwaiuser/page", data });
}
>>>>>>> 4f519a3600dc9978eaf967d9b32ae29646e90413
