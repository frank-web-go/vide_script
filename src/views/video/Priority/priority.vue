<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 查询条件 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="展示类型">
                        <el-select size="small" v-model="table.params.type" clearable>
                            <el-option v-for="(item, index) in PriorityList" :label="item.label" :value="item.value"
                                :key="index"></el-option>
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
                <el-button size="small" type="primary" @click="addTags()">添加影片</el-button>
                <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="table.columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">

                    <Button style="margin-left: 10px;" type="info" @click="updateMV(row)">编辑</Button>
                    <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button>
                </template>
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
            <!-- 新增模板 -->
            <TagsModal @getList="getList" ref="addvideos"></TagsModal>

        </div>
    </el-card>
</template>

<script>
import { Mixin } from "../videoMixin.js"
import TagsModal from "./component/modal.vue";
import { getdataPriority, delPriority } from "@/api/fileopt";
export default {
    components: {
        TagsModal,
    },
    mixins:[Mixin],
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
                    type: ""
                },
                data: [],
                columns: [
                    { type: 'selection', width: 60, align: 'center' },
                    { title: "片名", key: 'movie_name', align: 'center', tooltip: true},
                    { title: "描述", key: 'desc', align: 'center' },
                    {
                        title: "展示类型", key: 'type', align: 'center',
                        render: (h, params) => h('span', this.fmtType(params.row.type))
                    },
                    { title: "排序", key: 'priority', align: 'center' },
                    {
                        title: "操作", key: "operate", align: "center", width: 300, slot: "action"
                    },
                ],
            },
            PriorityList: [
                {
                    value: 0,
                    label: '排行展示',
                },
                {
                    value: 1,
                    label: '最新上映',
                },
                {
                    value: 2,
                    label: '最新更新',
                },
                {
                    value: 3,
                    label: '首页展示',
                },
            ],
        };
    },

    created() {
        this.getList()
        // localStorage.setItem("chunkIndex",JSON.stringify({index:"",fileName:""}))
    },
    mounted() {

    },
    destroyed() {

    },
    methods: {

        getList() {
            let data = {
                ...this.table.params,
                type: this.table.params.type === "" ? -1 : this.table.params.type
            }
            getdataPriority(data).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        //上传视频
        addTags() {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "添加影片"
            this.$refs.addvideos.getTagDetail({})
        },

        updateMV(row) {
            this.$refs.addvideos.modal.show = true
            this.$refs.addvideos.modal.title = "修改影片"
            this.$refs.addvideos.getTagDetail(row)
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if(ids.length==0) return this.$message.error("请选择要删除的模板")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此模板</p>",
                onOk: () => {
                    delPriority({ ids }).then(res => {
                        if (res.code == 0) {
                            this.$message.success("删除成功")
                            this.getList();
                        }
                    })
                },
            });
        },
        settime(time) {
            console.log(time);
            return time == 0 ? time : this.$moment.unix(time / 100).format('YYYY-MM-DD HH:mm:ss')
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
        fmtType(type) {

            switch (type) {

                case 0:
                    return '排行展示'
                    break;
                case 1:
                    return '最新上映' 
                    break;
                case 2:
                    return '最近更新'
                    break;
                case 3:
                    return '首页展示'
                    break;
                default:
                    return "未知"

            }
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
