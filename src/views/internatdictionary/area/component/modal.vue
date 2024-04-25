<template>
    <div>
        <!-- 选择分组一键 -->
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>{{ modal.title }}</span>
            </p>
            <div style="padding: 10px">
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules"  :label-width="110">
                    <Row>


                        <!-- <Col span="18">
                        <FormItem label="地区名称" prop="area_name">
                            <Input v-model="modal.params.area_name"></Input>
                        </FormItem>
                        </Col> -->
                        <Col span="18">
                        <FormItem label="地区" prop="name">
                            <Select placeholder="请选择上级菜单" @on-change="handchange" :disabled="modal.title==='修改标签'" v-model="modal.params.area_id"
                                clearable>
                                <Option v-for="(item, index) in areaList" :value="item.id" :key="index"
                                    :label="item.desc"></Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="英语" prop="">
                            <Input v-model="modal.params.english"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="印地语" prop="">
                            <Input v-model="modal.params.india"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="简体中文" prop="">
                            <Input v-model="modal.params.simple_chinese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="繁体中文" prop="">
                            <Input v-model="modal.params.traditional_chinese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="日语" prop="">
                            <Input v-model="modal.params.japanese"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="韩语" prop="">
                            <Input v-model="modal.params.korean"></Input>
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
                <Button type="primary" @click="submitForm()" :loading="isloading">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

import { addoneArea, updateoneArea, allArea } from "@/api/internation";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "uploadFILE",
                params: {
                    area_id: "",
                    area_name: "",
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
                    area_name: [
                        { required: true, message: "请输入标签名称", trigger: "blur" },
                    ],

                },
            },
            isloading: false,
            uploadStatus: "上传",
            areaList: []
        };
    },
    created() {

        this.getAllArea()
    },
    mounted() {

    },
    computed: {

    },
    methods: {
        handchange(e) {
    
            this.modal.params.area_id = e
   
            
        },
        getAllArea() {
            allArea().then(res => {
                this.areaList = res.data
            })

        },
        submitForm() {
            this.$refs["uploadFILE"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        order: Number(this.modal.params.order)
                    }
                    if (this.modal.params.id) {
                        updateoneArea(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {

                        addoneArea(data).then(res => {
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