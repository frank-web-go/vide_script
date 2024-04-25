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
                        <FormItem label="语言" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="排序" prop="sort_index">
                            <InputNumber style="width: 100%" v-model.number="modal.params.sort_index" />
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="描述" prop="desc">
                            <Input type="textarea" :rows="4" v-model="modal.params.desc" clearable></Input>
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

import { addoneLan, updateoneLan } from "@/api/dictionary";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "uploadFILE",
                params: {
                    name: "",
                    id: "",
                    desc:"",
                    sort_index:null
                },
                rules: {
                    name: [
                        { required: true, message: "请输入标签名称", trigger: "blur" },
                    ],

                },
            },
            isloading: false,
            uploadStatus: "上传",
        };
    },
    created() {


    },
    mounted() {

    },
    computed: {

    },
    methods: {
        submitForm() {
            this.$refs["uploadFILE"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        order: Number(this.modal.params.order)
                    }
                    if (this.modal.params.id) {
                        updateoneLan(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {

                        addoneLan(data).then(res => {
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
        getTagDetail(row) {
            let data = {
                ...row
            }
            this.modal.params = data
        },
        closeModalGroup() {
            this.modal.show = false;
        },


    },
};
</script>
<style scoped lang="less">
::v-deep {
    .ivu-form-label-right {
        width: 520px;
    }
}
</style>