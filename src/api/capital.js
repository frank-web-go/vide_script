import request from "./request";

// 获取充值记录
export function getRechargeRecord(data) {
  return request({ url: "/paymanager/getpayinfolist", data });
}

// 添加充值信息
export function addRechargeInfo(data) {
  return request({ url: "/paymanager/addpayinfo", data });
}

// 启用/禁用订单
export function deletePayOrder(data) {
  return request({ url: "/paymanager/deletepayinfo?&pay_id=" + data });
}

// 消费记录列表
export function getPersonalExRecord(data) {
  return request({ url: "/deductrecord/getdeductrecordlist", data });
}

// 获取图片数据流
export function gerImgBlob(data) {
  return request({ url: "picture/geticons?icon=" + data });
}

// 查询消费记录管理
export function getExpenseRecords(data) {
  return request({ url: "/deductrecord/getadmindeductrecordlist", data });
}

// 营收统计
export function revenueStatistics(data) {
  return request({ url: "incomestatistics/getincomestatisticslist", data });
}
