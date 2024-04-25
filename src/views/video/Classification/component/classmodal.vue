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
                        <FormItem label="分类名称" prop="name">
                            <Input v-model="modal.params.name" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18" v-if="!modal.params.children" >
                        <FormItem label="路由名称" prop="router">
                            <Input v-model="modal.params.router" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="上级分类" prop="name">
                            <Select placeholder="请选择上级菜单" :disabled="modal.params.pid == '000000000000000000000000'"
                                v-model="modal.params.pid" clearable>
                                <Option v-for="(item, index) in adverType" :value="item.value" :key="index"
                                    :label="item.label">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>

                        <!-- <Col span="18">
                        <FormItem label="跳转链接" prop="url">
                            <Input v-model="modal.params.url" clearable></Input>
                        </FormItem>
                        </Col> -->
                        <Col span="18">
                        <FormItem label="是否显示" prop="show">
                            <el-radio v-model="modal.params.show" :label="true">是</el-radio>
                            <el-radio v-model="modal.params.show" :label="false">否</el-radio>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="排序" prop="sort_index">
                            <InputNumber style="width: 100%" v-model.number="modal.params.sort_index" />
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="描述" prop="desc">
                            <Input type="textarea" :rows="4" v-model="modal.params.desc" clearable></Input>
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
import { updateNavigate, updateone, addone } from "@/api/navigate";
import { uploadfiles } from "@/api/fileopt";
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
                    pid: "",
                    show: '',
                    name: "",
                    router:"",
                    url: "",
                    sort_index:null,
                    desc:""
                },
                rules: {
                 
                },
            },
            adverType: [
               
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
        getoldData(data, adverType) {
            console.log(data);
            this.adverType = adverType
            this.modal.params = {
                ...data,

            }
        },


        getFileurl(response, file, fileList) {
            console.log(response, '成功了吗');
        },
        submitForm() {
            let data = {
                    ...this.modal.params,
                }
            if (this.modal.params.id) {
                               updateone(data).then(res => {
                    if (res.code == 0) {
                        this.$message.success('修改成功')
                        this.modal.show = false
                        this.$emit('getList')
                    }
                })
            } else {
                addone(data).then(res => {
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