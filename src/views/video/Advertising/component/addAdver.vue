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
                        <FormItem label="广告图片" prop="">
                            <Upload action="http://54.251.94.70:8118/fileopt/uploadfiles" :before-upload="handleUpload"
                                :data="{ folder_name: folder_name }" :on-success="getFileurl" :auto-upload="false">
                                <Button icon="ios-cloud-upload-outline">Upload files</Button>
                            </Upload>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="广告名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="广告类型" prop="type">
                            <Select placeholder="请选择上级菜单" v-model="modal.params.type" clearable>
                                <Option v-for="(item, index) in adverType" :value="item.value" :key="index"
                                    :label="item.label">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="跳转链接" prop="jump_url">
                            <Input v-model="modal.params.jump_url"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="跳转类型" prop="jumpType">
                            <Select placeholder="请选择上级菜单" v-model="modal.params.jump_type" clearable>
                                <Option v-for="(item, index) in jump_type" :value="item.value" :key="index"
                                    :label="item.label">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="广告排序" prop="sortIndex">
                            <InputNumber style="width: 100%" type="text" v-model="modal.params.sort_index" />

                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="是否显示" prop="show">
                            <el-radio v-model="modal.params.show" :label="true">是</el-radio>
                            <el-radio v-model="modal.params.show" :label="false">否</el-radio>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="描述" prop="desc">
                            <Input v-model="modal.params.desc"></Input>
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
import { addAdver, updateAdver } from "@/api/advertise";
import { uploadfiles } from "@/api/fileopt";
export default {
    data() {
        return {
            file: "",
            folder_name: "ad_image", //图片文件夹名 写死不能更改!
            oldData: {},
            res_url_prefix:"",
            modal: {
                show: false,
                title: "",
                ref: "advertise",
                params: {
                    image: "",
                    name: "",
                    type: "",
                    jump_url: "",
                    jump_type: "",
                    sort_index: 0,
                    desc: "",
                    show:""
                },
                rules: {
                    // name: [
                    //     { required: true, message: "请输入广告名称", trigger: "blur" },
                    // ],
                    // type: [
                    //     { required: true, message: "请输入广告类型", trigger: "blur" },
                    // ],
                    // jump_url: [
                    //     { required: true, message: "请输入广告链接", trigger: "blur" },
                    // ],
                    // jumpType: [
                    //     { required: true, message: "请输入跳转类型", trigger: "blur" },
                    // ],
                    // sortIndex: [
                    //     { required: true, message: "请输入广告排序", trigger: "blur" },
                    // ],
                    // desc: [
                    //     { required: true, message: "请输入广告描述", trigger: "blur" },
                    // ],

                },
            },
            adverType: [
                {
                    label: '首页广告',
                    value: 1
                },
                {
                    label: '弹窗广告',
                    value: 2
                },
                {
                    label: '底部广告',
                    value: 3
                },
            ],
            jump_type: [
                {
                    label: '站内跳转',
                    value: 1
                },
                {
                    label: '外链跳转',
                    value: 2
                },

            ],
        };
    },
    created() {


    },
    mounted() {

    },
    computed: {

    },
    methods: {
        getoldData(data) {
         
            this.res_url_prefix = data.res_url_prefix
            this.modal.params = {
                ...data
            }
            console.log(this.res_url_prefix,'查看111');
        },
        handleUpload(file) {
            this.file = file;
            // this.folder_name = file.name.split('.')[0];
            const formData = new FormData();
            formData.append("files[]", file);
            formData.append("folder_name", this.folder_name);
            uploadfiles(formData).then(res => {
                let baseurl = process.env.VUE_APP_API_BASE_URL
                // this.modal.params.image = baseurl.split(':')[0] + ':' + baseurl.split(':')[1] + '/' + this.folder_name + '/' + res.data.completeNameList[0]
                // this.modal.params.image =this.res_url_prefix + res.data.completeNameList[0]
                this.modal.params.image =res.data.completeNameList[0]
            })
            return false;
        },
        getFileurl(response, file, fileList) {
            console.log(response, '成功了吗');
        },
        submitForm() {
            if (this.modal.params.id) {
                updateAdver(this.modal.params).then(res => {
                    if (res.code == 0) {
                        this.$message.success('修改成功')
                        this.modal.show = false
                        this.$emit('getList')
                    }
                })
            } else {
                addAdver(this.modal.params).then(res => {
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