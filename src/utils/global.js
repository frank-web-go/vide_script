



export default {
  dateOptions(val) {
    let date = new Date(val).getTime();
    return date > this.today + 1000 * 60 * 60 * 24;
  },

  parseTime(time, cFormat = "") {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      }
      if ((typeof time === 'number') && (time.toString().length === 10)) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {

      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },
  // //  转换时间戳
  Timestamp(str) {
    return Date.parse(new Date(this.parseTime(str).replace(/-/g, '/')))
  },
  handleDown(filePath) {
    let a = document.createElement('a')
    let path = filePath.lastIndexOf('/')
    // console.log(row.filePath.substr(path+1),"row.filePath.substr(path+1)")
    a.download = filePath.substr(path + 1)//设置下载的文件名

    if (filePath.indexOf('http') != -1) {
      a.href = filePath
    } else {
      a.href = process.env.VUE_APP_BASE_API + "/" + filePath; // 设置图片的下载地址
    }
    a.target = '_blank'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click();//触发下载事件
    document.body.removeChild(a)
    // link = null;
  },
  getAppName(name) {
    let roleMenuList = JSON.parse(sessionStorage.getItem('roleMenuList'))
    let menu_id = "-1"
    if (roleMenuList && roleMenuList.length > 0 ) {
      roleMenuList.forEach(v=>{
        if(v.name === name) {
          menu_id = v.menu_id
        }
      })
    }
    return String(menu_id)  
  }
}