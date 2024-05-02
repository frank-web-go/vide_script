<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 功能区 -->
            <!-- <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="主机名称">
                        <el-input size="small" v-model="table.params.host_name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="resetDevice">重置</el-button>
                    </el-form-item>
                </el-form>
            </div> -->
            <Table border :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
        </div>
    </el-card>
</template>

<script>
import { hostDetailPage } from "@/api/equipment";
import { Mixin } from "../selectMixin.js"
export default {
    mixins: [Mixin],
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "设备名称", key: 'name', align: 'center' },
                { title: "客户端IP", key: 'client_ip', align: 'center' },
                // { title: "博主列表", key: 'blogger_ids', align: 'center',tooltip: true},
                // { title: "今日余量", key: 'today_rem_num', align: 'center' },
                // { title: "发送总数量", key: 'send_total_num', align: 'center' },
                { title: "是否在线", key: 'send_total_num', align: 'center', render: (h, params) => { return this.ispublic(h, params,"online") } },
                { title: "设备类型", key: 'device_type', align: 'center', render: (h, params) => { return this.handleDeviceType(h, params) } },
                { title: "是否启用", key: 'enable', align: 'center', render: (h, params) => { return this.ispublic(h, params,"enable") } },
                { title: "状态", key: 'status', align: 'center', render: (h, params) => { return this.fmtstatus(h, params, "online") } },
                // { title: "说明", key: 'desc', align: 'center', Tooltip: true },
                { title: "创建时间", key: 'create_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.create_time)) },
                { title: "最后交互时间", key: 'latest_mutual_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.latest_mutual_time)) },
            ],
            table: {
                params: {
                    host_name:""
                }
            }
        };
    },

    created() {
        this.getList()
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
        fmtstatus(h, params) {
            let text = ""
            let color = ""
            switch (params.row.status) {
                case 1:
                    text = '审核中'
                    color = 'yellow'
                    break;
                case 2:
                    text = '进行中'
                    color = 'orange'
                    break;
                case 3:
                    text = '暂停'
                    color = 'red'
                    break;
                case 4:
                    text = '完成'
                    color = 'green'
                    break;

                default:
                    text = '未知'
                    color = '#ccc'
                    break;
            }
            return h('Tag', {
                props: {
                    color: color,
                    size: "large"
                }
            }, text);
        },
        ispublic(h, params,type) {
            console.log('params: ', params);
            let text = ""
            let color = ""
            if (type==="enable") {
                text = params.row.enable ? '启用' : '禁用'
                color = params.row.enable === true ? 'green' : 'red';
            } 
            if (type==="online") {
                text = params.row.online ? '是' : '否'
                color = params.row.online === true ? 'green' : 'red';
            }
            
            return h('Tag', {
                props: {
                    color: color,
                    size: "large"
                }
            }, text);
        },
        handleDeviceType(h,params) {
            console.log('params: ', params);
            return h("span",params.row.device_type == 1 ? "发送广告": "收集粉丝" )     
        },
        handleBlogger(h,params){
          return h("span",params.row.blogger_ids.join(", "))
        }, 
        getList() {
            let data = {...this.table.params}
            data.host_name = sessionStorage.getItem("host_name")
            hostDetailPage(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        limitchange(limit) {
            this.table.params.page = 1;
            this.table.params.limit = limit;
            this.getList();
        },
        //查询分页
        pagechange(page) {
            this.table.params.page = page;
            this.getList();
        },
        resetDevice(){
            this.table.params.host_name =""
            this.getList();
        }
    },
};
</script>

<style lang="less">
.monitor-container {
    width: 100%;
    height: 400px;
    color: #303133;

    .system,
    .host {
        background: #fff;
        height: 400px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;

        div {
            span:nth-child(2) {
                color: #969799;
            }
        }
    }

    .host {
        div {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid #e6ebf5;
        }

        div:first-child {
            font-size: 17px;
            width: 100%;
        }

        div:nth-child(n + 2) {
            width: 96%;
            margin: auto;
        }
    }

    .system {
        .system-first {
            position: relative;
            font-size: 17px;
            padding: 15px 20px;
            width: 100%;
            padding: 13px 0;
            border-bottom: 1px solid #e6ebf5;

            .title {
                position: absolute;
                left: 50%;
                color: initial;
            }
        }

        .system-item {
            width: 45%;
            float: left;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e6ebf5;
            padding: 13px 0;
        }

        .system-item:nth-child(even) {
            margin-left: 15px;
        }

        .system-item:nth-child(odd) {
            margin-left: 12px;
        }

        .progress-container {
            border: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            padding: 0 20px;
            margin-top: 15px;
            clear: left;
        }
    }
}
</style>