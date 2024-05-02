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
                        <!-- <FormItem label="设备列表" prop="device_names"> -->
                        <FormItem label="主机" prop="host_name">
                            <Select placeholder="请选择主机列表" v-model="modal.params.host_name" clearable>
                                <Option v-for="(item, index) in DeviceList" :value="item.name" :key="index"
                                    :label="item.name">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="消息内容" prop="content">
                            <Input v-model="modal.params.content"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="单台任务数量" >
                            <Input v-model="modal.params.single_num" type="number"></Input>
                        </FormItem>
                        </Col>
                        <!-- <Col span="18">
                        <FormItem label="完成数量" prop="">
                            <Input v-model="modal.params.comp_num"></Input>
                        </FormItem>
                        </Col> -->
                        <!-- <Col span="18">
                       
                        <FormItem label="状态" prop="">
                            <Select placeholder="请选择状态"  v-model="modal.params.status" clearable>
                                
                                <Option  label="审核中" :value="1"></Option>
                                <Option  label="进行中" :value="2"></Option>
                                <Option  label="暂停" :value="3"></Option>
                                <Option  label="完成" :value="4"></Option>

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
import { AddOneTask, getAllDeviceHost } from "@/api/equipment";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    name: "",
                    host_name: "",
                    content: "",
                    single_num: null,
                },
                rules: {
                    name: [
                        { required: true, message: "请输入设备名称", trigger: "blur" }
                    ],
                    host_name: [
                        { required: true, message: "请选择主机", trigger: "blur" }
                    ],
                    content: [
                        { required: true, message: "请输入消息内容", trigger: "blur" }
                    ],
                    single_num: [
                        { required: true, message: "请输入任务数量", trigger: "blur"}
                    ]
                },

            },
            DeviceList: []
        };
    },
    mounted() {
        this.getAllDevice()
    },
    computed: {

    },
    methods: {
        submitForm() {
            this.$refs["equipment"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        // status: this.modal.params.status === "" ? 0 : this.modal.params.status,
                        task_num: Number(this.modal.params.task_num)
                    }
                    AddOneTask(data).then(res => {
                        console.log(res);
                        if (res.code == 0) {
                            this.$message.success("新增成功")
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
        getAllDevice() {
            getAllDeviceHost({host_type:1}).then(res => {
                if (res.code == 0) {
                    this.DeviceList = res.data || []
                }
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
}
</style>