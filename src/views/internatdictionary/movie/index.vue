<template>
    <el-card style="height: 820px">
        <div class="body">
            <!-- 查询条件 -->
            <div class="seach-form">
                <el-form :inline="true">
                    <el-form-item label="片名">
                        <el-input size="small" v-model="table.params.movie_name" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="getList">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <!-- <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <Table border @on-selection-change="handSelectChange" :columns="columns" :data="table.data"
                style="margin-top: 12px;" height="600">
                <template #action="{ row }">
                    <Button type="info" @click="update(row)">编辑</Button>
                    <!-- <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button> -->
                </template>
            </Table>
            <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;"
                :total="table.total" :current="table.params.page" :page-size-opts="table.pageSizes"
                :page-size="table.params.limit" @on-page-size-change="limitchange" @on-change="pagechange"></Page>
            <!-- 新增模板 -->
            <MovieModal @getList="getList" ref="movieModal"></MovieModal>
        </div>
    </el-card>
</template>

<script>
import { Mixin } from "../selectMixin.js"
import MovieModal from "./component/modal.vue";
import { movieDel, moviePage } from "@/api/internation";
export default {
    components: {
        MovieModal,
    },
    mixins: [Mixin],
    data() {
        return {
            columns: [
                { type: 'selection', width: 60, align: 'center' },
                { title: "片名", key: 'movie_name', align: 'center', tooltip: true,width:200 },
                { title: "英语", key: 'english', align: 'center', tooltip: true,width:160 },
                { title: "简体中文", key: 'simple_chinese', align: 'center', tooltip: true,width:160 },
                { title: "繁体中文", key: 'traditional_chinese', align: 'center', tooltip: true,width:160 },
                { title: "日语", key: 'japanese', align: 'center', tooltip: true,width:160 },
                { title: "韩语", key: 'korean', align: 'center', tooltip: true,width:160 },
                { title: "印地语", key: 'india', align: 'center', tooltip: true,width:160 },
                { title: "法语", key: 'french', align: 'center', tooltip: true,width:160 },
                { title: "西班牙语", key: 'spanish', align: 'center',tooltip: true,width:160 },
                { title: "德语", key: 'german', align: 'center',tooltip: true,width:160 },
                { title: "葡萄牙语", key: 'portuguese', align: 'center',tooltip: true,width:160 },
                { title: "柬埔寨语", key: 'cambodian', align: 'center',tooltip: true,width:160 },
                { title: "俄语", key: 'russian', align: 'center' ,tooltip: true,width:160},
                {
                    title: "操作", key: "operate", align: "center", width: 100, slot: "action",fixed:"right"
                },
            ],
            table: {
                params: {
                    movie_name: ""
                }
            }
        };
    },

    created() {
        this.getList()
    },
    methods: {
        getList() {
            moviePage(this.table.params).then(res => {
                console.log(res);
                this.table.data = res.data.list || []
                this.table.total = res.data.total
            })
        },
        update(row) {
            this.$refs.movieModal.modal.params = row
            this.$refs.movieModal.modal.show = true
        },
        deletesing(id) {
            let ids = Array.isArray(id) ? id : [id]
            if (ids.length == 0) return this.$message.warning("请选择要删除的影片翻译")
            this.$Modal.confirm({
                title: "确认删除",
                content: "<p>是否确认删除选中影片翻译</p>",
                onOk: () => {
                    movieDel({ ids }).then(res => {
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