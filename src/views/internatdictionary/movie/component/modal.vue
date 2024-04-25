<template>
    <div>
        <!-- 选择分组一键 -->
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>影片翻译编辑</span>
            </p>
            <div style="padding: 10px">
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules" :label-width="110">
                    <Row>
                        <Col span="18">
                        <FormItem label="片名" prop="movie_name">
                            <Input v-model="modal.params.movie_name" disabled></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="英语">
                            <Input v-model="modal.params.english"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="简体中文">
                            <Input v-model="modal.params.simple_chinese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="繁体中文">
                            <Input v-model="modal.params.traditional_chinese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="日语">
                            <Input v-model="modal.params.japanese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="韩语">
                            <Input v-model="modal.params.korean"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="印地语">
                            <Input v-model="modal.params.india"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="法语">
                            <Input v-model="modal.params.french"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="西班牙语">
                            <Input v-model="modal.params.spanish"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="德语">
                            <Input v-model="modal.params.german"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="葡萄牙语">
                            <Input v-model="modal.params.portuguese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="巴西语">
                            <Input v-model="modal.params.brazil"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="柬埔寨语">
                            <Input v-model="modal.params.cambodian"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="俄语">
                            <Input v-model="modal.params.russian"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModal()">取消</Button>
                <Button type="primary" @click="submitForm()">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

import { movieUpdate } from "@/api/internation";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "movie_translate",
                params: {
                    movie_id: "",
                    id: "",
                    movie_name: "",
                    english: "",
                    simple_chinese: "",
                    traditional_chinese: "",
                    japanese: "",
                    korean: "",
                    india: ""
                },
                rules: {
                    movie_name: [
                        { required: true, message: "请输入片名", trigger: "blur" },
                    ],

                },
            },
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
            this.$refs["movie_translate"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                    }
                    movieUpdate(data).then(res => {
                        if (res.code == 0) {
                            this.$message.success("修改成功")
                            this.modal.show = false
                            this.$emit("getList")
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        closeModal() {
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