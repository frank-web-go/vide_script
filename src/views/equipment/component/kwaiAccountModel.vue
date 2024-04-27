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
                        <FormItem label="设备名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="客户端IP" prop="client_ip">
                            <Input v-model="modal.params.client_ip"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="描述">
                            <Input v-model="modal.params.desc"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="今日余量">
                            <Input v-model.number="modal.params.today_rem_num" type="number" min="0"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="发送总数量">
                            <Input v-model.number="modal.params.send_total_num" type="number" min="0"></Input>
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
import { addDevice, updateDevice } from "@/api/equipment";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    name: "",
                    desc: "",
                    client_ip: "",
                    today_rem_num: 0,
                    send_total_num:0
                },
                rules: {
                    name: [
                        { required: true, message: "请输入设备名称", trigger: "blur" }
                    ],
                    client_ip: [
                        { required: true, message: "请输入客户端IP", trigger: "blur" }
                    ],
                    platform_account: [
                        { required: true, message: "请输入平台账号", trigger: "blur" }
                    ]
                },

            }
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
                        ...this.modal.params
                    }
                    if (this.modal.params.id) {
                        updateDevice(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {
                        addDevice(data).then(res => {
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