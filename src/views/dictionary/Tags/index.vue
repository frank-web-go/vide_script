<template>
    <el-card style="height: 820px">
        <div class="body">

            <!-- 功能区 -->
            <div>
                <el-button size="small" type="primary" @click="getList">查询</el-button>
                <el-button size="small" type="primary" @click="addTags()">添加标签</el-button>
                <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #desc="{ row }">
                    <Tooltip v-if="row.desc && row.desc.length > 25" :content="row.desc" placement="top">
                        <span>{{ row.desc.slice(0, 25) + "..." }}</span>
                    </Tooltip>
                    <span v-else>{{ row.desc }}</span>
                </template>
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
import { Mixin } from "../selectMixin.js"
import TagsModal from "./component/modal.vue";
import { pageTags, deletemanyTags } from "@/api/dictionary";
export default {
    components: {
        TagsModal,
    },
    mixins: [Mixin],
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "名称", key: 'value', align: 'center' },
                { title: "排序", key: 'order', align: 'center' },
                { title: "描述", key: 'desc', align: 'center', slot:"desc"},
                {
                    title: "操作", key: "operate", align: "center", width: 300, slot: "action"
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
            pageTags(this.table.params).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },

        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.warning("请选择要删除的项目")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除此标签</p>",
                onOk: () => {
                    deletemanyTags({ ids }).then(res => {
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
