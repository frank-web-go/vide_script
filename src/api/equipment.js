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
export function getAllDevice(data) {
    return request({ url: "/device/allavailable", data });
}
export function getAllDeviceHost(data) {
    return request({ url: "/devicehost/allavailable", data });
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
export function taskDetail(data) {
    return request({ url: "/taskdetail/page", data });
}

export function updateStatus(data) {
    return request({ url: "/task/changestatus", data });
}

export function collectionAdd(data) {
    return request({ url: "/taskcollection/addone", data });
}

export function collectionPage(data) {
    return request({ url: "/taskcollection/page", data });
}

export function collectionStatusChange(data) {
    return request({ url: "/taskcollection/changestatus", data });
}

export function collectionDeleteMany(data) {
    return request({ url: "/taskcollection/deletemany", data });
}

export function deviceHostAdd(data) {
    return request({ url: "/devicehost/addone", data });
}

export function deviceHostUpdate(data) {
    return request({ url: "/devicehost/updateone", data });
}

export function deviceHostDeleteMany(data) {
    return request({ url: "/devicehost/deletemany", data });
}

export function deviceHostPage(data) {
    return request({ url: "/devicehost/page", data });
}

export function hostDetailPage(data) {
    return request({ url: "/devicehost/alldevice", data });
}



