// 扩大元素块点击范围
export const expandClick = (el, binding) => {
    const s = document.styleSheets[document.styleSheets.length - 1]
    const DEFAULT = -10 // 默认向外扩展10px
    const [top, right, bottom, left] = binding.expression && binding.expression.split(',') || []
    const ruleStr = `content:"";position:absolute;top:-${top || DEFAULT}px;bottom:-${bottom || DEFAULT}px;right:-${right || DEFAULT}px;left:-${left || DEFAULT}px;`
    const classNameList = el.className.split(' ')
    el.className = classNameList.includes('expand_click_range') ? classNameList.join(' ') : [...classNameList, 'expand_click_range'].join(' ')
    el.style.position = el.style.position || "relative"
    if (s.insertRule) {
        s.insertRule('.expand_click_range::before' + '{' + ruleStr + '}', s.cssRules.length)
    } else { /* IE */
        s.addRule('.expand_click_range::before', ruleStr, -1)
    }
};

// 下拉触底刷新
export const selectWrap = (el, binding) => {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
        let sign = 0
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
            binding.value()
        }
    })

};
// 聊天滚动条置顶
export const scrollbottom = (el, binding) => {
    const selectWrap = el.querySelector('.el-table__body-wrapper')

    element.scrollTop

    selectWrap.addEventListener('scroll', function () {
        let sign = 0
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
            binding.value()
        }
    })

};
//防抖
export const debounce = (el, binding) => {
    let timer
    el.addEventListener('click', () => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            binding.value()
        }, 5000);
    })
}

//按钮权限
export const permission = (el, binding) => {
    let arr = [1, 2, 3, 4, 5]
    function checkArray(key) {
        let index = arr.indexOf(key)
        if (index > -1) { return true } else { return false }
    }
    let isquanxuan = binding.value
    let hasPermission = checkArray(isquanxuan)
    if (!hasPermission) {
        //没有权限 则删除元素
        el.parentNode && el.parentNode.removeChild(el)
    }
}
