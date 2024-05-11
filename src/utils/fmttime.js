import moment from "moment"
export default function (h, time,len) {
    let end = len==17?"":"..."
    let texts = '--'; //表格列显示文字
    if (time) {
        texts = moment.unix(time).format('YYYY-MM-DD HH:mm:ss').substring(0, len||7) + end
    } else {
        texts = '--'
    }
    return h('div', [h('Tooltip', {
        props: {
            placement: 'bottom',
            transfer: true //是否将弹层放置于 body 内
        },
        style: {
            cursor: 'pointer',
        }
    },
        [ //这个中括号表示是Tooltip标签的子标签
            texts, //表格列显示文字
            h('div', {
                slot: 'content',
                style: {
                    whiteSpace: 'normal'
                }
            },
            moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
            )])]);

}