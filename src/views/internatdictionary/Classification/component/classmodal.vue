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
                        <!-- <Col span="18">
                        <FormItem label="分类名称" prop="name">
                            <Input v-model="modal.params.category_name" :disabled="modal.title=='编辑分类'"  clearable></Input>
                        </FormItem>
                        </Col> -->
                        <Col span="18">
                        <FormItem label="分类名称" prop="name">
                            <Select placeholder="请选择上级菜单"  :disabled="modal.title=='编辑分类'"
                                v-model="modal.params.category_id" clearable>
                                <Option v-for="(item, index) in classlist" :value="item.id" :key="index"
                                    :label="item.name"></Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="英语" prop="name">
                            <Input v-model="modal.params.english" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="简体中文" prop="name">
                            <Input v-model="modal.params.simple_chinese" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="繁体中文" prop="name">
                            <Input v-model="modal.params.traditional_chinese" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="日语" prop="name">
                            <Input v-model="modal.params.japanese" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="韩语" prop="name">
                            <Input v-model="modal.params.korean" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="印地语" prop="name">
                            <Input v-model="modal.params.india" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="法语" prop="">
                            <Input v-model="modal.params.french"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="西班牙语" prop="">
                            <Input v-model="modal.params.spanish"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="德语" prop="">
                            <Input v-model="modal.params.german"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="葡萄牙语" prop="">
                            <Input v-model="modal.params.portuguese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="俄语" prop="">
                            <Input v-model="modal.params.russian"></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModalGroup()">取消</Button>
                <Button type="primary" @click="submitForm">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {  i18naddone, i18nupdateone, allnotree } from "@/api/navigate";
export default {
    data() {
        return {
            file: "",
            folder_name: "",
            oldData: {},
            modal: {
                show: false,
                title: "",
                ref: "advertise",
                params: {
                    category_name: "",
                    category_id: "",
                    english: "",
                    simple_chinese: "",
                    traditional_chinese: "",
                    japanese: "",
                    korean: "",
                    india: "",
                    french:"",
                    spanish:"",
                    german:"",
                    portuguese:"",
                    russian:""
                },
                rules: {

                },
            },
            adverType: [],
            classlist: []
        };
    },
    created() {
        this.getallclass()
    },
    mounted() {

    },
    computed: {

    },
    methods: {
        getoldData(data, adverType) {
            this.adverType = adverType
            this.modal.params = {
                ...data,

            }
        },

        getallclass() {
            allnotree().then(res => {
                console.log(res, '获取到的全部分类');
                this.classlist = res.data
            })
        },
        getFileurl(response, file, fileList) {
            console.log(response, '成功了吗');
        },
        submitForm() {
            let data = {
                ...this.modal.params,
            }
            if (this.modal.params.id) {
                i18nupdateone(data).then(res => {
                    if (res.code == 0) {
                        this.$message.success('修改成功')
                        this.modal.show = false
                        this.$emit('getList')
                    }
                })
            } else {
                i18naddone(data).then(res => {
                    if (res.code == 0) {
                        this.$message.success('新增成功')
                        this.modal.show = false
                        this.$emit('getList')
                    }
                })

            }


            // this.$refs["advertise"].validate((valid) => {
            //     if (valid) {
            //         console.log(123);
            //     } else {
            //         return false;
            //     }
            // });

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