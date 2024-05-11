<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 功能区 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="设备名称">
                        <el-input size="small" v-model="table.params.device_name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select size="small" v-model="table.params.status" clearable>
                            <el-option label="审核中" :value="1"></el-option>
                            <el-option label="进行中" :value="2"></el-option>
                            <el-option label="暂停" :value="3"></el-option>
                            <el-option label="完成" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="resetDevice">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
import { taskDetail } from "@/api/equipment";
export default {
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                // { title: "任务ID", key: 'task_id', align: 'center' },
                { title: "设备名称", key: 'device_name', align: 'center' },
                { title: "消息内容", key: 'content', align: 'center' },
                { title: "任务数量", key: 'task_num', align: 'center' },
                { title: "完成数量", key: 'comp_num', align: 'center' },
                // { title: "状态", key: 'status', align: 'center', render: (h, params) => { return this.fmtstatus(params) } },
                { title: "状态", key: 'status', align: 'center', render: (h, params) => { return this.fmtstatus(h, params, "online") }},
                { title: "创建时间", key: 'create_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.create_time)) },
                { title: "更新时间", key: 'update_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.update_time)) },
            ],
            table: {
                total: 0,
                loading:false,
                params: {
                    device_name: "",
                    status: "",
                    page: 1,
                    limit: 10
                },
                data: []
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
        ispublic(h, params, type) {
            console.log('params: ', params);
            let text = ""
            let color = ""
            if (type === "enable") {
                text = params.row.enable ? '启用' : '禁用'
                color = params.row.enable === true ? 'green' : 'red';
            }
            if (type === "online") {
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
        fmtstatus(h,params) {
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
            },text);
        },
        getList() {
            let data = {
                ...this.table.params,
                task_id:sessionStorage.getItem("send_id"),
                status: this.table.params.status === "" ? 0 : this.table.params.status
            }
            taskDetail(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        settime(time) {
            return time == 0 ? time : this.$moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
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
        resetDevice() {
            this.table.params.device_name = ""
            this.table.params.status = ""
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