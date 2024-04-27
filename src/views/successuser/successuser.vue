<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 功能区 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="用户id">
                        <el-input size="small" v-model="table.params.user_id" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="隐私性">
                        <el-select size="small" v-model="table.params.privacy_type" clearable>
                            <el-option label="开放" :value="1"></el-option>
                            <el-option label="关闭" :value="0"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="送达">
                        <el-select size="small" v-model="table.params.deliver_type" clearable>
                            <el-option label="是" :value="1"></el-option>
                            <el-option label="否" :value="0"></el-option>

                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间">
                        <DatePicker @on-change="handchangetime" v-model="datetime" type="datetimerange"
                            placeholder="请输选择时间段" style="width: 300px" />
                    </el-form-item>

                    <el-form-item>
                        <el-button size="small" type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button size="small" type="primary" @click="resetDevice">重置</el-button>
                    </el-form-item> -->
                </el-form>
                <div>
                    <!-- <el-button size="small" type="primary" @click="add()">新增</el-button> -->
                    <!-- <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button> -->
                </div>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">

                    <Button style="margin-left: 10px;" type="info" @click="update(row)">编辑</Button>
                    <!-- <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button> -->
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
import DetailModal from "./component/detailModel.vue";
import { PageKwai, DeleteKwai } from "@/api/equipment";
export default {
    components: {
        DetailModal,
    },

    data() {
        return {
            datetime: [],
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "用户id", key: 'user_id', align: 'center' },
                { title: "隐私性", key: 'privacy', align: 'center', render: (h, params) => { return this.ispublic(h, params, "online") } },
                { title: "送达", key: 'privacy', align: 'center', render: (h, params) => { return this.issongda(h, params, "online") } },
                { title: "送达时间", key: 'deliver_time', align: 'center', render: (h, params) => h('span', this.settime(params.row.deliver_time)) },
                { title: "操作", key: "operate", align: "center", width: 200, slot: "action" },
            ],
            table: {
                params: {
                    user_id: "",
                    privacy_type: "",
                    deliver_type: "",
                    begin_time: "",
                    end_time: "",
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
        handchangetime(time) {
            this.table.params.begin_time = Math.floor(new Date(time[0]).getTime() / 1000)
            this.table.params.end_time = Math.floor(new Date(time[1]).getTime() / 1000)
        },
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
        },
        ispublic(h, params, type) {
            let text = ""
            let color = ""
            text = params.row.privacy ? '开放' : '关闭'
            color = params.row.privacy === true ? 'green' : 'red';
            return h('Tag', {
                props: {
                    color: color,
                    size: "large"
                }
            }, text);
        },
        issongda(h, params) {
            console.log('params: ', params);
            let text = ""
            let color = ""
            text = params.row.deliver ? '是' : '否'
            color = params.row.deliver === true ? 'green' : 'red';
            return h('Tag', {
                props: {
                    color: color,
                    size: "large"
                }
            }, text);
        },
        getList() {
            let data = {
                ...this.table.params,
                privacy_type: this.table.params.privacy_type === "" ? 0 : this.table.params.privacy_type,
                deliver_type: this.table.params.deliver_type === "" ? 0 : this.table.params.deliver_type,
                begin_time: this.table.params.begin_time === "" ? 0 : this.table.params.begin_time,
                end_time: this.table.params.end_time === "" ? 0 : this.table.params.end_time
            }

            PageKwai(data).then(res => {
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
            let data = { ...row }
            this.$refs.detailModal.modal.params = data
            this.$refs.detailModal.modal.show = true
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.warning("请选择要删除的设备信息")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此设备信息</p>",
                onOk: () => {
                    DeleteKwai({ ids }).then(res => {
                        if (res.code == 0) {
                            this.$message.success("删除成功")
                            this.getList();
                        }
                    })
                },
            });
        },
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
        },
        addTags() {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "添加标签"
            this.$refs.addvideos.getTagDetail({})
        },
        updateMV(row) {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "修改标签"
            this.$refs.addvideos.getTagDetail(row)
        },
        settime(time) {
            return time == 0 ? time : this.$moment.unix(time).format('YYYY-MM-DD')
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
            this.table.params.name = ""
            this.table.params.platform_account = ""
            this.table.params.online_type = ""
            this.table.params.enable_type = ""
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