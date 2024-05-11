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
                        <FormItem label="任务名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col> -->
                        <Col span="18">
                        <!-- <FormItem label="设备列表" prop="device_names"> -->
                        <FormItem label="主机列表" prop="host_name">
                            <Select placeholder="请选择主机列表" v-model="modal.params.host_name" @on-open-change="hostNameChange" @on-change="isHaveHostName" clearable>
                                <Option v-for="(item, index) in hostList" :value="item.name" :key="index"
                                    :label="item.name">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18" v-if="deviceList.length>0">
                        <!-- <FormItem label="设备列表" prop="device_names"> -->
                        <FormItem label="设备列表">
                            <Select placeholder="请选择设备" v-model="modal.params.device_names" multiple clearable>
                                <Option v-for="(item, index) in deviceList" :value="item" :key="index"
                                    :label="item">{{ item }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <!-- <Col span="18">
                        <FormItem label="消息内容" prop="">
                            <Input v-model="modal.params.content"></Input>
                        </FormItem>
                        </Col> -->
                      
                        <!-- <Col span="18">
                        <FormItem label="单台任务数量">
                            <Input v-model="modal.params.single_num" type="number"></Input>
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
import { collectionAdd, getAllDeviceHost, deviceListInfo } from "@/api/equipment";
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "equipment",
                params: {
                    // name: "",
                    // status: "",
                    host_name: "",
                    device_names:[]
                    // single_num: null,
                },
                rules: {
                    // name: [
                    //     { required: true, message: "请输入任务名称", trigger: "blur" }
                    // ],
                    host_name: [
                        { required: true, message: "请输入主机列表", trigger: "blur" }
                    ]
                },
                
            },
            deviceList:[],
            hostList: []
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
                        // single_num: Number(this.modal.params.single_num),
                    }
                    collectionAdd(data).then(res => {

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
        hostNameChange(){
           this.getAllDevice()
        },
        isHaveHostName(val) {
            console.log('val: ', val);
            deviceListInfo({host_name:val}).then(res=>{
                console.log('res: ', res);
                if (res.code == 0) {
                  this.deviceList = res.data.list.map(v=>v.name)
                }
            })
        },
        getAllDevice() {
            getAllDeviceHost({ host_type: 2 }).then(res => {
                console.log('res: ', res);
                if (res.code == 0) {
                    this.hostList = res.data || []
                    console.log('this.hostList : ', this.hostList );
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