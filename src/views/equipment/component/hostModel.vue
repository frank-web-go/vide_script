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
                        <FormItem label="主机名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="设备类型" prop="host_type">
                            <Select placeholder="请选择设备列表" v-model="modal.params.host_type" clearable
                                style="width: 280px" @on-change="hostTypeChange">
                                <Option value="1" label="发送广告"></Option>
                                <Option value="2" label="收集粉丝"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="设备列表">
                            <Select placeholder="请选择设备列表" multiple v-model="modal.params.device_names" clearable>
                                <Option v-for="(item, index) in deviceList" :value="item.name" :key="index"
                                    :label="item">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="客户端IP" prop="host_ip">
                            <Input v-model="modal.params.host_ip"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="说明">
                            <Input v-model="modal.params.desc"></Input>
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
import { deviceHostAdd, deviceHostUpdate, getAllDevice } from "@/api/equipment";
export default {
    data() {
        return {
            deviceList: [],
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    name: "",
                    host_type: "",
                    device_names: [111, 222],
                    host_ip: "",
                    desc: ""
                },
                rules: {
                    name: [
                        { required: true, message: "请输入主机名称", trigger: "blur" }
                    ],
                    host_type: [
                        { required: true, message: "请输入设备类型", trigger: "blur" }
                    ],
                    host_ip: [
                        { required: true, message: "请输入客户端IP", trigger: "blur" }
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
            // console.log(this.modal.params)
            console.log('this.modal.params: ', this.modal.params);
            this.$refs["equipment"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        host_type: Number(this.modal.params.host_type)
                    }

                    if (this.modal.params.id) {
                        deviceHostUpdate(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {

                        deviceHostAdd(data).then(res => {
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
        handleData(val) {
            this.modal.params = val
        },
        hostTypeChange(val) {
            console.log('val: ', val);
            if (this.modal.title === "新增主机信息") {
                getAllDevice({ device_type: Number(val) }).then(res => {
                    if (res.code == 0) {
                        this.deviceList = res.data || []
                    }
                })
            }
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