<template>
    <div>
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>{{ modal.title }}</span>
            </p>
            <div style="padding: 10px">
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules" :label-width="110">
                    <Row>
                        <Col span="18">
                        <FormItem label="域名" prop="name">
                            <Input v-model="modal.params.name" clearable></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="备注">
                            <Input v-model="modal.params.remark" clearable></Input>
                        </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModal()">取消</Button>
                <Button type="primary" @click="submitForm()" >确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import { add, update } from "@/api/domain"
export default {
    data() {
        return {
            modal: {
                show: false,
                title: "",
                ref: "domain",
                params: {
                    name: "",
                    remark: "",
                    id:""
                },
                rules: {
                    name: [
                        { required: true, message: "请输入域名", trigger: "blur" },
                    ],

                },
            }
        }
    },
    methods: {
        closeModal() {
            this.modal.show = false;
        },
        submitForm() {
            this.$refs[this.modal.ref].validate((valid) => {
                console.log(valid);
                if (valid) {
                    let data = {
                        ...this.modal.params,
                    }
                    if (this.modal.params.id) {
                        console.log('不走添加');
                        update(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {
                        console.log('走添加');
                        add(data).then(res => {
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
    }

}
</script>

<style></style>