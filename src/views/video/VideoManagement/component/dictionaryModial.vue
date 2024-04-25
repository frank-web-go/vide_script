<template>
    <div>
        <!-- 选择分组一键 -->
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>修改字典</span>
            </p>
            <div style="padding: 10px">
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules" :label-width="110">
                    <Row>       
                        <Col span="18">
                        <FormItem label="一级分类" prop="onecid">
                            <Select v-model="modal.params.onecid" @on-change="handChangeClass">
                                <Option v-for="(item, index) in FirstDirectory(Classification)" :label="item.name"
                                    :value="item.id" :key="index">
                                </Option>
                            </Select>
                        </FormItem>

                        <FormItem label="二级分类" prop="cid">
                            <Select v-model="modal.params.cid" :disabled="!modal.params.onecid">
                                <Option v-for="(item, index) in SecondaryDirectory" :label="item.name" :value="item.id"
                                    :key="index">
                                </Option>
                            </Select>

                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="标签" prop="">
                            <Select v-model="modal.params.tags" multiple>
                                <Option v-for="(item, index) in selectData.tags" :label="item.value" :value="item.value"
                                    :key="index">
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="语言" prop="language_id">
                            <Select v-model="modal.params.language_id">
                                <Option v-for="(item, index) in selectData.lan" :label="item.name" :value="item.id"
                                    :key="index">
                                </Option>
                            </Select>
                        </FormItem>

                        </Col>
                        <Col span="18">
                        <FormItem label="地区" prop="area_id">
                            <Select v-model="modal.params.area_id">
                                <Option v-for="(item, index) in selectData.area" :label="item.name" :value="item.id"
                                    :key="index">
                                </Option>
                            </Select>
                        </FormItem>
                        </Col>

                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModalGroup()">取消</Button>

                <Button type="primary" @click="submitForm()" :loading="isloading">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { editDicionarys } from "@/api/dictionary";
export default {
    props: ['selectData'],
    data() {
        return {
            Classification: [],
            SecondaryDirectory: [],
            ids:[],
            modal: {
                show: false,
                title: "",
                ref: "uploadFILE",
                params: {
                    onecid: null,
                    cid: "",
                    // tags: [],
                    language_id: "",
                    area_id: "",
                    movie_ids:[]
                },
                rules: {
                    cid: [
                        { required: true, message: "请选择二级分类", trigger: "input" },
                    ],
                    onecid: [
                        { required: true, message: "请选择一级分类", trigger: "blur" },
                    ],
                    language_id: [
                        { required: true, message: "请输入语言", trigger: "blur" },
                    ],
                    area_id: [
                        { required: true, message: "请输入地区", trigger: "blur" },
                    ]
                },
            },
            isloading: false,
        };
    },
    created() {
    },
    mounted() {

    },
    computed: {

    },
    methods: {
        submitForm() {
            this.$refs["uploadFILE"].validate((valid) => {
                if (valid) {
                    console.log('this.modal.params: ', this.modal.params);
                    if (this.modal.params.movie_ids.length>0) {
                        editDicionarys(this.modal.params).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
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
        FirstDirectory(list) {
            return list.map(item => {
                return {
                    name: item.name,
                    id: item.id,
                }
            })
        },
        handChangeClass(e) {
            let list = this.Classification.find(item => item.id == e)
            if (list) {
                this.SecondaryDirectory = list.children
                this.modal.params.cid = ""
            }

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