<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 功能区 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="设备名称">
                        <el-input size="small" v-model="table.params.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="平台账号">
                        <el-input size="small" v-model="table.params.platform_account" clearable></el-input>
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
                    <el-button size="small" type="primary" @click="getList">查询</el-button>
                    <el-button size="small" type="primary" @click="add()">新增</el-button>
                    <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
                </div>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">

                    <Button style="margin-left: 10px;" type="info" @click="update(row)">编辑</Button>
                    <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button>
                </template>
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
            <!-- 新增模板 -->
            <DetailModal @getList="getList" ref="detailModal"></DetailModal>
        </div>
    </el-card>
</template>

<script>
import { Mixin } from "./selectMixin.js"
import DetailModal from "./component/detailModel.vue";
import { getDevice, delDevice } from "@/api/equipment";
export default {
    components: {
        DetailModal,
    },
    mixins: [Mixin],
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "设备名称", key: 'name', align: 'center' },
                { title: "客户端IP", key: 'client_ip', align: 'center' },
                { title: "今日余量", key: 'today_rem_num', align: 'center' },
                { title: "发送总数量", key: 'send_total_num', align: 'center' },
                { title: "是否在线", key: 'send_total_num', align: 'center', render: (h, params) => { return this.ispublic(h, params,"online") } },
                { title: "状态", key: 'enable', align: 'center', render: (h, params) => { return this.ispublic(h, params,"enable") } },
                { title: "描述", key: 'desc', align: 'center', Tooltip: true },
                { title: "创建时间", key: 'create_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.create_time)) },
                { title: "最后交互时间", key: 'latest_mutual_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.latest_mutual_time)) },
                { title: "操作", key: "operate", align: "center", width: 200, slot: "action" },
            ],
            table: {
                params: {
                    name: "",
                    platform_account: "",
                    online_type: "",
                    enable_type: ""
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
        getList() {
            let data = {...this.table.params}
            data.online_type = Number(data.online_type)
            data.enable_type = Number(data.enable_type)
            getDevice(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        add() {
            this.$refs.detailModal.modal.title = "新增设备信息"
            this.$refs.detailModal.modal.params = {}
            this.$refs.detailModal.modal.show = true
        },
        update(row) {
            this.$refs.detailModal.modal.title = "编辑设备信息"
            this.$refs.detailModal.modal.params = row
            this.$refs.detailModal.modal.show = true
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.warning("请选择要删除的设备信息")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此设备信息</p>",
                onOk: () => {
                    delDevice({ ids }).then(res => {
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
            this.table.params.platform_account =""
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