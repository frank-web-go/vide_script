import request from "./request";
//UuID
export function uuid(data) {
  return request({ url: "/login/getcode", data });
}

//登录账户
export function login(data) {
  return request({ url: "/login/login", data });
}
//获取国家列表
export function countryList(data) {
  return request({ url: "/country/all", data });
}

//修改密码
export function editPwd(data) {
  return request({ url: "/user/updatepwd", data });
}

//获取所有菜单
export function AllMenu(data) {
  return request({ url: "/menu/all", data });
}
//获取父ID
export function getroleID(data) {
  return request({ url: "/role/all", data });
}
//新增菜单
export function addmenu(data) {
  return request({ url: "/menu/add", data });
}
//修改菜单信息
export function updatemenu(data) {
  return request({ url: "/menu/update", data });
}
//获取所有菜单
export function deletemenu(data) {
  return request({ url: "menu/deleteone", data });
}
//获取所有后台用户
export function adminuserlist(data) {
  return request({ url: "/user/page", data });
}

//获取所有后台用户
export function updateadminuser(data) {
  return request({ url: "/user/updateuser", data });
}

//获取所有角色列表
export function getRolelist(data) {
  return request({ url: "/role/all", data });
}

//获取所有角色列表
export function updaterole(data) {
  return request({ url: "/user/updaterole", data });
}

//获取所有配置列表
export function sysconfiglist(data) {
  return request({ url: "/paramconfig/page", data });
}

//更新配置列表
export function updatesysconfig(data) {
  return request({ url: "/paramconfig/updatesysconfig", data });
}

//获取操作日志
export function adminloglist(data) {
  return request({ url: "/operationlog/page", data });
}
//获取登录日志
export function loginloglist(data) {
  return request({ url: "/loginlog/page", data });
}
//获取ip分组列表
export function getipgrouplist(data) {
  return request({ url: "/ipgroup/getipgrouplist", data });
}

//获取ip分组列表配置
export function updateipgroup(data) {
  return request({ url: "/ipgroup/updateipgroup", data });
}

//获取IP管理列表
export function getipinfolist(data) {
  return request({ url: "/ipgroup/getipinfolist", data });
}
//添加IP
export function addipinfolist(data) {
  return request({ url: "/ipgroup/addipinfolist", data });
}
//ip处理
export function updateipinfolist(data) {
  return request({ url: "/ipgroup/updateipinfolist", data });
}
//导出ip数据
export function exportipinfolist(data) {
  return request({ url: "/ipgroup/exportipinfolist", data });
}

export function resetAllIpUseNum(data) {
  return request({ url: "/ipgroup/resetallipusenum", data });
}

export function reUpdateAllIp(data) {
  return request({ url: "/ipgroup/reupdateallip", data });
}

//搜索数据来源列表
export function getdatapackagelist(data) {
  return request({ url: "/datapackage/getdatapackagelist", data });
}
//创建群
export function creategroupbysocket(data) {
  return request({ url: "/account/creategroupbysocket", data });
}
//导出数据来源列表
export function exportdatapackagelist(data) {
  return request({ url: "/datapackage/exportdatapackagelist", data });
}

//上传通讯录数据
export function addcontactdata(data) {
  return request({ url: "/datapackage/addcontactdata", data });
}
//请求通讯录数据
export function getcontactdataitemlist(data) {
  return request({ url: "/datapackage/getcontactdataitemlist", data });
}

//方案配置列表
export function getplanlist(data) {
  return request({ url: "/plan/getplanlist", data });
}
//方案增删查改
export function updateplan(data) {
  return request({ url: "/plan/updateplan", data });
}

//步骤相关
export function updatestep(data) {
  return request({ url: "/plan/updatestep", data });
}
//步骤列表
export function getsteplist(data) {
  return request({ url: "/plan/getsteplist", data });
}
//协议列表
export function agreementlists(data) {
  return request({ url: "/protocol/getList", data });
}
//协议增删查改
export function agreementplan(data) {
  return request({ url: "/protocol/updateconfig", data });
}
//编辑群发任务
export function editgroupsendtaskinfo(data) {
  return request({ url: "/groupsendtask/editgroupsendtaskinfo", data });
}
//查询群发记录
export function getgroupsendlist(data) {
  return request({ url: "/groupsendtask/getgroupsendtaskinfolist", data });
}
//获取素材列表
export function getmateriallist(data) {
  return request({ url: "/material/getmateriallist", data });
}
//素材切换组

export function materialChangeGroup(data) {
  return request({ url: "/material/materialchangegroup", data });
}
//组列表
export function getgrouplist(data) {
  return request({ url: "/material/getgrouplist", data });
}
//素材组增改删
export function updategroup(data) {
  return request({ url: "/material/updategroup", data });
}
//素材新增，修改
export function updatematerial(data) {
  return request({ url: "/material/updatematerial", data });
}
//素材删除
export function delmateriallist(data) {
  return request({ url: "/material/delmateriallist", data });
}
//创建任务
export function addSendTask(data) {
  return request({ url: "/groupsendtask/addgroupsendtaskinfo", data });
}
// 快速创建任务
export function addSendTaskFast(data) {
  return request({ url: "/groupsendtask/addgroupsendtaskinfoquick", data });
}
//操作群发记录
export function operatSendTask(data) {
  return request({ url: "/groupsendtask/dogroupsendtasklist", data });
}
//任务详情
export function getTaskDetail(data) {
  return request({ url: "/groupsendtask/getgroupsendtaskdetaillist", data });
}
// 素材上传
export function uploadFile(data) {
  return request({ url: "/material/upload", data });
}

export function getList(data) {
  return request({ url: "/moneydata/getList", data });
}

export function fileoptdownload(data) {
  return request({ url: "fileoptdownload/get?file=", data });
}

//聊天剧本设置

export function UpdateChatContentInfo(data) {
  return request({ url: "/chattask/updatechatcontentinfo", data });
}

//聊天剧本列表
export function GetChatContentInfoList(data) {
  return request({ url: "/chattask/getchatcontentinfolist", data });
}

// 下载任务日志
export function GetDownloadTaskLog(data) {
  return request({ url: "/groupsendtask/getgroupsendtaskfile", data });
}

// 智能养号任务

export function doFarmAcc(data) {
  return request({ url: "robottask/updaterobottaskinfo", data });
}

export function getFarmAcc(data) {
  return request({ url: "robottask/getrobottaskinfolist", data });
}

export function getFarmAccLog(data) {
  return request({ url: "robottask/getrobottalkitemlist", data });
}

// 更新好友发送任务
export function updateFriendSendTask(data) {
  return request({ url: "robottask/updaterobotsendtaskinfo", data });
}

// 好友发送任务列表
export function getFriendSendTaskList(data) {
  return request({ url: "robottask/getrobotsendtaskinfolist", data });
}

// 任务日志
export function getFriendSendTaskLog(data) {
  return request({ url: "robottask/getrobotrobotsenditemlist", data });
}

// ip记录日志
export function getAccountIPLog(data) {
  return request({ url: "account/getaccountiplog", data });
}

// 配置界面
export function getDataTaskInfo(data) {
  return request({ url: "hitdatatask/gethitdatataskinfo", data });
}

export function doDataTaskInfo(data) {
  return request({ url: "hitdatatask/updatehitdatataskinfo", data });
}

export function testaddfriend(data) {
  return request({ url: "account/testaddfriend", data });
}

export function SendImageMessage2023(data) {
  return request({ url: "account/testsendimage", data });
}

export function testsendtext(data) {
  return request({ url: "account/testsendtext", data });
}

export function testsendcontactcall(data) {
  return request({ url: "account/testsendcontactcall", data });
}

export function testsendaudio(data) {
  return request({ url: "account/testsendaudio", data });
}

export function TestSendTemplateText(data) {
  return request({ url: "account/testsendtemplatetext", data });
}

export function JoinGroupByCode(data) {
  return request({ url: "account/joingroupbycode", data });
}
export function sendGroupMessage(data) {
  return request({ url: "account/testsendgroupmessage2023", data });
}

export function LeaveGroup(data) {
  return request({ url: "account/testlevewsgroup", data });
}

export function GetGroupInfoByCode(data) {
  return request({ url: "account/getgroupinfobycode", data });
}

export function testgetkeys(data) {
  return request({ url: "account/testgetkeys", data });
}

export function GetGroupList(data) {
  return request({ url: "account/getaccwsgroupinfo", data });
}

export function SendVCardMessage(data) {
  return request({ url: "card/sendvcardmessage", data });
}

export function SendVoiceMessage(data) {
  return request({ url: "card/sendvoicemessage", data });
}

export function TestAIVoice(data) {
  return request({ url: "account/testaivoice", data });
}

// 查询APP下拉数据
export function getAppSelectInfo(data) {
  return request({ url: "app/getapptypelist", data });
}

// 查询App数据
export function getAppData(data) {
  return request({ url: "app/getappdatalist", data });
}

// 用户注册
export function regesiter(data) {
  return request({ url: "adminregister/register", data });
}

// 下载任务列表
export function downloadTaskList(data) {
  return request({ url: "/downtask/getdowntasklist", data });
}

// 获取首页任务列表
export function getTaskList(data) {
  return request({ url: "/task/getapptaskinfolist", data });
}

// 留言
export function leaveMessage(data) {
  return request({ url: "messageboard/addmessageboardinfo", data });
}

// 获取注册验证码
export function getRegisterCode(data) {
  return request({ url: "register/getregistercode", data });
}

export function getNowVersion(data) {
  return request({ url: "login/getversion", data });
}

// 禁用用户
export function disableUser(data) {
  return request({ url: "user/updateuserstatus", data });
}

// 删除用户
export function deleteUser(data) {
  return request({ url: "user/deleteuser", data });
}

// 获取IP黑名单列表
export function getIpBlackList(data) {
  return request({ url: "ipblack/getipblackinfolist", data });
}

// 修改IP黑名单状态
export function updateIpBlackListStatus(data) {
  return request({ url: "ipblack/updateipblackinfostatus", data });
}

// 修改IP黑名单
export function updateIpBlackList(data) {
  return request({ url: "ipblack/updateipblackinfo", data });
}

// 删除IP黑名单
export function delIpBlackList(data) {
  return request({ url: "ipblack/deleteipblackinfo", data });
}

// 添加IP黑名单
export function addIpBlackList(data) {
  return request({ url: "ipblack/addipblackinfo", data });
}

// 获取系统信息
export function getSystemInfo() {
  return request({ url: "system/getmonitorinfo" });
}
