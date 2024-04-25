<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 查询条件 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="域名">
                        <el-input size="small" v-model="table.params.name" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select size="small" v-model="table.params.active_type" clearable>
                            <el-option  label="启用" value="1"></el-option>
                            <el-option  label="禁用" value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button size="small" type="primary" icon="el-icon-search" @click="getList"
                            :loading="isloading">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 功能区 -->
            <div>
                <el-button size="small" type="primary" @click="add()">添加域名</el-button>
                <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="table.columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">

                    <Button style="margin-left: 10px;" type="info" @click="edit(row)">编辑</Button>
                    <Button style="margin-left: 10px;" :type="row.active ? 'error' : 'success'"
                        @click="editStatus(row)">{{ row.active ? "禁用" : "启用" }}</Button>
                </template>
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
            <!-- 新增模板 -->
            <DomainModel @getList="getList" ref="domain"></DomainModel>

        </div>
    </el-card>
</template>

<script>
import { del, getDomains, updateStatus } from "@/api/domain";
import DomainModel from "./component/modal.vue"
export default {
    components: {
        DomainModel,
    },
    data() {
        return {
            isloading: false,
            datetime: "",
            ids: [],
            table: {
                show: false,
                total: 0,
                pageSizes: [10, 50, 100],
                params: {
                    page: 1,
                    limit: 10,
                    name: "",
                    active_type: ""
                },
                data: [],
                columns: [
                    { type: 'selection', width: 60, align: 'center' },
                    { title: "域名", key: 'name', align: 'center' },
                    { title: "状态", key: 'active', align: 'center', render: (h, params) => { return this.ispublic(h, params) } },
                    { title: "备注", key: 'remark', align: 'center' },
                    { title: "操作", key: "operate", align: "center", width: 300, slot: "action" },
                ],
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

        getList() {
            let data = {
                ...this.table.params,
            }
            data.active_type = Number(this.table.params.active_type)
            getDomains(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        add() {
            this.$refs.domain.modal.params = {}
            this.$refs.domain.modal.title = "添加域名"
            this.$refs.domain.modal.show = true
        },
        edit(row) {
            this.$refs.domain.modal.title = "修改域名"
            this.$refs.domain.modal.params = row
            this.$refs.domain.modal.show = true
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.error("请选择要删除的域名")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此模板</p>",
                onOk: () => {
                    del({ ids }).then(res => {
                        if (res.code == 0) {
                            this.$message.success("删除成功")
                            this.getList();
                        }
                    })
                },
            });
        },
        editStatus(row) {
            this.$Modal.confirm({
                title: `确认${row.active == 1 ? '禁用' : '启用'}`,
                content: `<p>是否确认确认${row.active == 1 ? '禁用' : '启用'}</p>该域名`,
                onOk: () => {
                    updateStatus({ id: row.id, active: row.active }).then(res => {
                        if (res.code == 0) {
                            this.$message.success("操作成功")
                            this.getList();
                        }
                    })
                },
            });
        },
        ispublic(h, params) {
            let text = params.row.active ? '启用' : '禁用'
            let color = params.row.active === true ? 'green' : 'red';
            return h('Tag', {
                props: {
                    color: color,
                    size: "large"
                }
            }, text);
        },
        handSelectChange(row) {
            this.ids = row.map(item => item.id)
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
