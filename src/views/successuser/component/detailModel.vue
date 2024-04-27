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
                        <FormItem label="任务名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                      
                        <Col span="18">
                        <FormItem label="消息内容" prop="">
                            <Input v-model="modal.params.content"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="任务数量" prop="">
                            <Input v-model="modal.params.task_num"></Input>
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
import { AddKwai, UpdateeKwai } from "@/api/equipment";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    name: "",
                    device_names: [],
                    content: "",
                    task_num: null,
                },
                rules: {
                    name: [
                        { required: true, message: "请输入设备名称", trigger: "blur" }
                    ],
                    device_names: [
                        { required: true, message: "请输入设备列表", trigger: "blur" }
                    ],
                    content: [
                        { required: true, message: "请输入消息内容", trigger: "blur" }
                    ],
                    task_num: [
                        { required: true, message: "请输入任务数量", trigger: "blur" }
                    ]
                },

            },

        };
    },
    mounted() {

    },
    computed: {

    },
    methods: {
        submitForm() {
            this.$refs["equipment"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        task_num:Number(this.modal.params.task_num)
                    }
                    if (this.modal.params.id) {
                        UpdateeKwai(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {
                        AddKwai(data).then(res => {
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