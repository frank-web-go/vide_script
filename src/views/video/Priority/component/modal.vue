<template>
    <div>
        <!-- 选择分组一键 -->
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>{{ modal.title }}</span>
            </p>
            <div style="padding: 10px">
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules" :label-width="110">
                    <Row>
                        <Col span="18">
                        <FormItem label="展示电影" prop="jumpType">
                            <Select placeholder="请选择展示类型" filterable :loading="isloading" :remote-method="remoteMethod"
                                v-model="modal.params.movie_id" clearable>
                                <Option v-for="(item, index) in movieList" :value="item.id" :key="index"
                                    :label="item.name"></Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="展示类型" prop="jumpType">
                            <Select placeholder="请选择展示类型" v-model="modal.params.type" clearable>
                                <Option v-for="(item, index) in PriorityList" :value="item.value" :key="index"
                                    :label="item.label"></Option>
                            </Select>
                        </FormItem>
                        </Col>

                        <Col span="18">
                        <FormItem label="展示排序" prop="priority">
                            <InputNumber style="width: 100%" type="text" v-model="modal.params.priority" />

                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="描述" prop="desc">
                            <Input v-model="modal.params.desc"></Input>
                        </FormItem>
                        </Col>

                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModalGroup()">取消</Button>
                <Button type="primary" @click="submitForm()" :loading="isloading">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

import { pageMovie, addPriority, updatePriority } from "@/api/fileopt";
export default {
    data() {
        return {
            isqueru: false,
            modal: {
                show: false,
                title: "",
                ref: "uploadFILE",
                params: {
                    priority: null,
                    movie_id: "",
                    desc: "",
                    type: "",
                    id: ""
                },
                rules: {
                    name: [
                        { required: true, message: "请输入标签名称", trigger: "blur" },
                    ],

                },
            },
            movieParmas: {
                page: 1,
                limit: 10,
                name: "",
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
            movieList: [],
            isloading: false,
            uploadStatus: "上传",
            debouncedGetMovieList: () => { },
        };
    },
    created() {
        this.debouncedGetMovieList = this.debounce(this.getMovieList, 500);
    },
    mounted() {

    },
    computed: {

    },
    watch: {
        'modal.show'(newVal, oldVal) {
            if (!newVal) {
                this.isqueru = false //关闭输入搜索
            }
        }
    },
    methods: {
        //防抖
        debounce(fn, wait) {
            let timer = null
            return function () {
                if (timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    fn()
                    timer = null
                }, wait);

            }
        },
        remoteMethod(query) {
            if (this.isqueru) {
                this.movieParmas.name = query
                this.debouncedGetMovieList();
            }

        },

        submitForm() {
            this.$refs["uploadFILE"].validate((valid) => {
                console.log(valid);
                if (valid) {
                    let data = {
                        ...this.modal.params,

                    }
                    if (this.modal.params.id) {
                        console.log('不走添加');
                        updatePriority(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {
                        console.log('走添加');
                        addPriority(data).then(res => {
                            console.log(res);
                            if (res.code == 0) {
                                this.$message.success("新增成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    }

                } else {
                    return false;
                }
            });
        },
        getTagDetail(data) {
            this.modal.params = {...data}
            this.movieParmas.name = data.movie_name
            pageMovie(this.movieParmas).then(res => {
                this.isqueru = true //开启输入搜索
                this.isloading = false
                this.movieList = res.data.list
                this.modal.params.movie_id = res.data.list[0].id
            })
        },
        closeModalGroup() {
            this.modal.show = false;
        },
        getMovieList() {
            this.isloading = true
            pageMovie(this.movieParmas).then(res => {
                console.log(res.data.list);
                this.isloading = false
                this.movieList = res.data.list
            })
        }

    },
};
</script>
<style scoped lang="less">
::v-deep {
    .ivu-form-label-right {
        width: 520px;
    }

    .ivu-select-dropdown .ivu-select-item {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .ivu-select-dropdown {
        width: auto !important;
        /* 让下拉菜单宽度自适应内容，但不超过最大宽度 */
        max-width: 200px;
        /* 设置一个合适的最大宽度 */
    }
}
</style>