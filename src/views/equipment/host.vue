<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 功能区 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="设备名称">
                        <el-input size="small" v-model="table.params.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="设备类型">
                        <el-select size="small" v-model="table.params.host_type" clearable>
                            <el-option  label="采集账号" value="1" ></el-option>
                            <el-option  label="发送信息" value="2" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="客户端IP">
                        <el-input size="small" v-model="table.params.client_ip" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="是否在线">
                        <el-select size="small" v-model="table.params.online_type" clearable>
                            <el-option  label="在线" value="1" ></el-option>
                            <el-option  label="离线" value="2" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select size="small" v-model="table.params.enable_type" clearable>
                            <el-option  label="启用" value="1" ></el-option>
                            <el-option  label="禁用" value="2" ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="resetDevice">重置</el-button>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
                    <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
                </div>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">
                    <Button type="info" @click="detail(row.name)">详情</Button>
                    <Button style="margin-left: 10px;" type="info" @click="update(row)">编辑</Button>
                    <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button>
                </template>
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
            <!-- 新增模板 -->
            <HostModal @getList="getList" ref="hostModal"></HostModal>
        </div>
    </el-card>
</template>

<script>
import { Mixin } from "./selectMixin.js"
import HostModal from "./component/hostModel.vue";
import { deviceHostDeleteMany, deviceHostPage } from "@/api/equipment";
export default {
    components: {
        HostModal,
    },
    mixins: [Mixin],
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "主机名称", key: 'name', align: 'center' },
                { title: "设备类型", key: 'host_type', align: 'center',render: (h, params) => { return this.handleHostType(h, params) } },
                { title: "是否在线", key: 'send_total_num', align: 'center', render: (h, params) => { return this.ispublic(h, params,"online") } },
                { title: "设备列表", key: 'device_names', align: 'center', render: (h, params) => { return this.handleDeviceNames(h, params) } },
                { title: "客户端IP", key: 'host_ip', align: 'center' },
                { title: "是否启用", key: 'enable', align: 'center', render: (h, params) => { return this.ispublic(h, params,"enable") } },
                { title: "状态", key: 'status', align: 'center', render: (h, params) => { return this.fmtstatus(h, params, "online") } },
                { title: "描述", key: 'desc', align: 'center', Tooltip: true },
                { title: "创建时间", key: 'create_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.create_time)) },
                { title: "最后交互时间", key: 'latest_mutual_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.latest_mutual_time)) },
                { title: "操作", key: "operate", align: "center", width: 250, slot: "action" },
            ],
            table: {
                params: {
                    name: "",
                    host_type: "",
                    host_ip:"",
                    online_type: "",
                    enable_type: "",
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
        detail(name) {
            sessionStorage.setItem("host_name",name)
            this.$router.push("/host/detail")
        },
        handleHostType(h,params) {
            console.log('params: ', params);
            return h("span",params.row.host_type == 1 ? "发送广告": "收集粉丝" )   
        },
        handleDeviceNames(h,params){
          return h("span",params.row.device_names.join(", "))
        }, 
        getList() {
            let data = {...this.table.params}
            data.online_type = Number(data.online_type)
            data.enable_type = Number(data.enable_type)
            data.host_type = Number(data.host_type)
            deviceHostPage(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        add() {
            this.$refs.hostModal.modal.title = "新增主机信息"
            this.$refs.hostModal.modal.params = {}
            this.$refs.hostModal.modal.show = true
        },
        update(row) {
            this.$refs.hostModal.modal.title = "编辑主机信息"
            let data = JSON.parse(JSON.stringify(row))
            data.host_type = String(data.host_type)
            this.$refs.hostModal.handleData(data)
            this.$refs.hostModal.modal.show = true
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.warning("请选择要删除的主机信息")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此主机信息</p>",
                onOk: () => {
                    deviceHostDeleteMany({ ids }).then(res => {
                        if (res.code == 0) {
                            this.$message.success("删除成功")
                            this.getList();
                        }
                    })
                },
            });
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
            this.table.params.name =""
            this.table.params.host_type =""
            this.table.params.host_ip = ""
            this.table.params.online_type =""
            this.table.params.enable_type =""
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