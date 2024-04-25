<template>
    <el-card class="box-card">
        <!-- 操作按钮区域 -->
        <div class="table-operator">
            <el-button type="primary" size="small" @click="getList()">刷新</el-button>
            <el-button type="success" size="small" @click="openModal">添加配置</el-button>
        </div>

        <!-- 表格 -->
        <div class="table-box" ref="tableBox">
            <el-table v-loading="loading" ref="multipleTable" :data="table.data" border v-if="tableHeight"
                :height="tableHeight" fit highlight-current-row
                :header-cell-style="{ background: 'rgb(15,193,175,.7)', color: '#191a23' }" style="width: 100%;height:50px">
                <el-table-column prop='id' align="center" label="ID" min-width="209"></el-table-column>
                <el-table-column prop="title" min-width="180" label="标题名称" align="center"></el-table-column>
                <el-table-column prop="key" min-width="180" label="唯一标识" align="center"></el-table-column>
                <el-table-column prop="data" min-width="180" label="数据" align="center"></el-table-column>
                <el-table-column prop="desc" min-width="180" label="描述" align="center"></el-table-column>
                <el-table-column fixed="right" width="150" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Page class="page" v-show="table.data.length" show-sizer show-total :total="table.total"
                :current="table.params.page" :page-size-opts="table.pageSizes" :page-size="table.params.limit"
                @on-page-size-change="limitchange" @on-change="pagechange"></Page>

            <!--添加修改-->
            <Modal v-model="modal.show" width="800" @on-cancel="closeModal()">
                <p slot="header" style="color:#1c2438;text-align:center">
                    <span>{{ modal.form.type ? '新增' : '修改' }}配置</span>
                </p>
                <div style="padding:10px">
                    <Form :ref="modal.form.ref" :model="modal.form.params" :rules="modal.form.rules" :label-width="140">
                        <Row>
                            <Col span="18">
                            <FormItem label="标题名称" prop="title">
                                <Input v-model="modal.form.params.title" placeholder="请输入标题名称"></Input>
                            </FormItem>
                            </Col>
                            <Col span="18">
                            <FormItem label="唯一标识" prop="key">
                                <Input v-model="modal.form.params.key" placeholder="请输入唯一标识" :disabled="modal.form.params.type == 1"></Input>
                            </FormItem>
                            </Col>
                            <Col span="18">
                            <FormItem label="配置数据" prop="data">
                                <Input v-model="modal.form.params.data" placeholder="请输入配置数据"></Input>
                            </FormItem>
                            </Col>
                            <Col span="18">
                            <FormItem label="配置描述" prop="desc">
                                <Input type="textarea" v-model="modal.form.params.desc" placeholder="请输入置描述"></Input>
                            </FormItem>
                            </Col>
                        </Row>

                    </Form>
                </div>
                <div slot="footer">
                    <Button type="warning" @click="closeModal()">取消</Button>
                    <Button type="success" @click="updata()">提交</Button>
                </div>
            </Modal>
        </div>
    </el-card>
</template>
<script >
import { sysconfiglist, updatesysconfig } from "@/api/user";
export default {
    name: "sysSet",
    data() {
        return {
            loading: false,
            select: {
                rolelist: []
            },
            table: {
                params: {
                    uid: '',
                    page: 1,
                    limit: 10,
                },
                data: [],
                total: 0,
                pageSizes: [10, 20, 40, 60],
            },
            modal: {
                show: false,
                form: {
                    ref: "modal_form",
                    params: {
                        type: 0,
                        id: "",
                        title: "",
                        key: "",
                        data: "",
                        desc: ""
                    },
                    rules: {

                        title: [
                            { required: true, trigger: "blur", message: "请输入标题名称", },
                        ],
                        key: [
                            { required: true, trigger: "blur", message: "请输入唯一标识", },
                        ],
                        data: [
                            { required: true, trigger: "blur", message: "请输入数据", },
                        ],
                        desc: [
                            { required: true, trigger: "blur", message: "请输入描述", },
                        ],


                    }
                }
            },
            data: [],
        }
    },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        this.getList();
    },
    computed: {
        tableHeight() {
            if (this.showAll) {
                return window.innerHeight - 230
            } else {
                return window.innerHeight - 230
            }
        }
    },
    methods: {
        closeModal() {
            this.modal.show = false;
            this.$refs[this.modal.form.ref].resetFields();
        },

        getList(page) {
            this.loading = true;
            if (page) {
                this.table.params.page = 1;
            }
            sysconfiglist(this.table.params)
                .then((res) => {
                    this.table.data = res.data.list || [];
                    this.table.total = res.data.total
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                });
        },
        //查询分条
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
        openModal() {
            this.modal.form.params = {
                type: 0,
                id: "",
                title: "",
                key: "",
                data: "",
                desc: ""
            };
            this.$refs[this.modal.form.ref].resetFields();
            this.modal.show = true;
        },
        //更新表单提交
        updata() {
            this.$refs[this.modal.form.ref].validate((valid) => {
                if (valid) {
                    this.saveManager();
                }
            });
        },
        //更新信息
        saveManager() {
            let params = { ...this.modal.form.params };
            updatesysconfig(params).then((res) => {
                this.$Message.success("配置成功");
                this.getList();
                this.closeModal();
            });
        },
        handleUpdate(index, row) {
            this.$refs[this.modal.form.ref].resetFields();
            this.modal.form.params = { ...row };
            delete this.modal.form.params["_index"];
            delete this.modal.form.params["_rowKey"];
            this.modal.form.params.type = 1;
            this.modal.show = true;
        },
        handleDelete(index, row) {
            let _this = this;
            this.$confirm('是否确认删除此项目配置?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.modal.form.params = { ...row };
                _this.modal.form.params.type = 2;
                _this.saveManager();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
}

</script>
<style lang='less' scoped>
@import "../../css/public_table.less";
</style>