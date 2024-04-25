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
                        <FormItem label="电影名称" prop="name">
                            <Input v-model="modal.params.name"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18" v-if="isUpload">
                        <FormItem label="影片封面" prop="">
                            <Upload action="http://54.251.94.70:8118/fileopt/uploadfiles" :before-upload="handleUpload"
                                :data="{ folder_name: folder_name }" :auto-upload="false">
                                <Button icon="ios-cloud-upload-outline">Upload files</Button>
                            </Upload>
                        </FormItem>
                        </Col>
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
                        <FormItem label="ID" prop="" v-if="isUpload">
                            <Input v-model="modal.params.id" disabled></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="播放外链" prop="">
                            <Input v-model="modal.params.ext_link"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="播放类型" prop="play_type">
                            <Select v-model="modal.params.play_type">
                                <Option label="外链" :value="0">
                                </Option>
                                <Option label="内链加密" :value="1">
                                </Option>
                                <Option label="内链非加密" :value="2">
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
                        <FormItem label="主演" prop="">
                            <Input v-model="modal.params.actor"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="简介" prop="">
                            <Input v-model="modal.params.blurb"></Input>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="上映时间" prop="release_time">
                            <DatePicker v-model="modal.params.release_time" type="date" placeholder="Select date"
                                style="width: 200px" />
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

                <Button type="primary" @click="submitForm(index)" :loading="isloading">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import { GetAreaall, GetTagall, GetLanall } from "@/api/dictionary";
import { getallFclass } from "@/api/navigate"
import { addone, updateone } from "@/api/fileopt";
import { uploadfiles } from "@/api/fileopt";
export default {
    props: ['selectData'],
    data() {
        return {
            tags: [],
            lan: [],
            area: [],
            Classification: [],
            countryList: [],
            SecondaryDirectory: [],
            folder_name: "",
            isUpload: false,
            lastChecked: null, // 用于记录上一次勾选的节点id
            ClassList: [],
            modal: {
                show: false,
                title: "",
                ref: "uploadFILE",

                params: {
                    onecid: null,
                    cid: "",
                    name: "",
                    tags: [],
                    actor: "",
                    blurb: "",
                    release_time: "",
                    language_id: "",
                    area_id: "",
                    picture: "", //视频封面图
                    ext_link: "", //播放外链
                    play_type: ""
                },
                rules: {
                    name: [
                        { required: true, message: "请输入电影名称", trigger: "blur" },
                    ],
                    cid: [
                        { required: true, message: "请选择二级分类", trigger: "input" },
                    ],
                    onecid: [
                        { required: true, message: "请选择一级分类", trigger: "blur" },
                    ],
                    play_type: [
                        {
                            required: true, trigger: "blur", validator: (rule, value, callback) => {
                                if (value === "") {
                                    callback("请选择播放类型")
                                } else {
                                    callback();
                                }
                            }
                        },
                    ],

                    release_time: [
                        {
                            required: true, trigger: "blur",
                            validator: (rule, value, callback) => {
                                console.log('value:---- ', value);
                                if (!value) {
                                    callback("请选择上映时间")
                                } else {
                                    callback();
                                }
                            }
                        },
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
            uploadStatus: "上传",
            chunks: [],
            folderName: '', //文件夹名
            fileName: '',
            schedule: 0,
            index: 0,
            size: 0,
            FileSize: 0,
            chunkIndex: JSON.parse(localStorage.getItem("chunkIndex")), //大于0表示上次传输被终止
        };
    },
    created() {
        // this.getselectData()
    },
    mounted() {

    },
    computed: {

    },
    methods: {
        submitForm(index) {

            this.$refs["uploadFILE"].validate((valid) => {
                if (valid) {
                    let data = {
                        ...this.modal.params,
                        release_time: this.modal.params.release_time.getTime()
                    }
                    console.log(this.modal.params);
                    if (this.modal.params.id) {
                        updateone(data).then(res => {
                            if (res.code == 0) {
                                this.$message.success("修改成功")
                                this.modal.show = false
                                this.$emit("getList")
                            }
                        })
                    } else {

                        addone(data).then(res => {
                            console.log(res);
                            if (res.code == 0) {
                                this.$message.success("新增成功")
                                this.modal.show = false
                                this.$emit("getList")
                            } else if (res.code === 1000002) {
                                this.$message.error("电影名称不能重复")
                            }
                        })
                    }

                } else {
                    return false;
                }
            });


        },
        findParentId(data, targetId) {
            for (const parent of data) {
                if (parent.children && parent.children.some(child => child.id === targetId)) {
                    return parent.id; // 找到了包含目标id的父级，返回父级的id
                }
            }
            return null; // 如果没有找到，返回null
        },
        getData(data) {
            if (Object.keys(data).length > 0) {
                this.isUpload = true
                this.modal.params.id = data.id
                let id = this.findParentId(this.Classification, data.cid) //获取一级分类回显
                if (id) {
                    this.SecondaryDirectory = this.Classification.find(item => item.id === id).children //获取二级分类回显
                    let fmtdata = {
                        ...data,
                        onecid: id,
                        release_time: new Date((data.release_time + '').length > 11 ? data.release_time : data.release_time * 1000)
                    }
                    this.modal.params = fmtdata
                } else {
                    let fmtdata = {
                        ...data,
                        release_time: new Date((data.release_time + '').length > 11 ? data.release_time : data.release_time * 1000)
                    }
                    this.modal.params = fmtdata
                }

            } else {
                this.isUpload = false
                this.modal.params.id = ""
                this.modal.params.isimage = false;
            }
            this.modal.show = true
        },
        FirstDirectory(list) {
            return list.map(item => {
                return {
                    name: item.name,
                    id: item.id,
                }
            })
        },
        handleUpload(file) {
            this.isloading = true;
            this.file = file;
            const formData = new FormData();
            formData.append("files[]", file);
            formData.append("folder_name", `film/${this.modal.params.id}/img`);
            uploadfiles(formData).then(res => {
                let baseurl = process.env.VUE_APP_API_BASE_URL
                this.modal.params.picture = this.modal.params.id + '/img/' + res.data.completeNameList[0]
                this.isloading = false;
            })
            return false;
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
        handlePreview(e) {
            console.log(e);
        },
        handleRemove(e) {
            console.log(e);
        },

        async getselectData() {
            this.Classification = (await getallFclass()).data
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