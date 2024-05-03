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
                            <Input v-model="modal.params.name" :disabled="modal.title == '编辑设备信息'"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="运行名称" prop="run_name">
                            <Input v-model="modal.params.run_name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="客户端IP" prop="client_ip">
                            <Input v-model="modal.params.client_ip" :disabled="modal.title == '编辑设备信息'"></Input>
                        </FormItem>
                        </Col>
                        <FormItem label="设备类型" prop="device_type">
                            <Select placeholder="请选择设备列表" v-model="modal.params.device_type" clearable
                                style="width: 280px">
                                <Option value="1" label="发送广告"></Option>
                                <Option value="2" label="收集粉丝"></Option>
                            </Select>
                        </FormItem>
                        <Col span="18" v-if="modal.params.device_type == 2">
                        <FormItem label="博主列表" prop="blogger_ids">
                            <Input v-model="modal.params.blogger_ids"></Input>
                        </FormItem>
                        </Col>
                        <!-- <Col span="18">
                        <FormItem label="今日余量" prop="today_rem_num">
                            <Input v-model="modal.params.today_rem_num" type="number"></Input>
                        </FormItem>
                        </Col> -->
                        <!-- <Col span="18">
                        <FormItem label="博主列表">
                            <Input v-model="modal.params.blogger_ids"></Input>
                        </FormItem>
                        </Col> -->
                        <!-- <Col span="18"> -->
                        <!-- <FormItem label="博主列表">
                            <Input v-model="modal.params.blogger_ids"></Input>
                        </FormItem> -->
                        <!-- </Col> -->
                        <!-- <Col span="18">
                        <FormItem label="主机" prop="host_name">
                            <Select placeholder="请绑定主机" v-model="modal.params.host_name" clearable style="width: 280px">
                                <Option v-for="(item, index) in hostList" :value="item.name" :key="index"
                                    :label="item.name">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col> -->
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
import { addDevice, updateDevice, getAllDeviceHost } from "@/api/equipment";
export default {
    data() {
        return {
            hostList:[],
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    name: "",
                    // blogger_ids: "",
                    client_ip: "",
                    device_type: "",
                    run_name:"",
                    blogger_ids: ""
                    // today_rem_num:"",
                    // desc:""
                },
                rules: {
                    name: [
                        { required: true, message: "请输入设备名称", trigger: "blur" }
                    ],
                    run_name: [
                        { required: true, message: "请输入运行名称", trigger: "blur" }
                    ],
                    client_ip: [
                        { required: true, message: "请输入客户端IP", trigger: "blur" }
                    ],
                    device_type: [
                        { required: true, message: "请选择设备类型", trigger: "blur" }
                    ],
                    blogger_ids: [
                        { required: true, message: "请输入博主列表", trigger: "blur" }
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
        deviceTypeChange(val) {
            console.log('val: ', val);
            getAllDeviceHost({host_type:Number(val)}).then(res => {
                if (res.code == 0) {
                    this.hostList = res.data || []
                }
            })
        },
        submitForm() {
            this.$refs["equipment"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        today_rem_num: this.modal.params.today_rem_num == "" ? 0 : Number(this.modal.params.today_rem_num),
                        device_type: Number(this.modal.params.device_type),
                        blogger_ids: [this.modal.params.blogger_ids],
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