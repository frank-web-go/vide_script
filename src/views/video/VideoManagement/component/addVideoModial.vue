<template>
    <div>
        <!-- 选择分组一键 -->
        <Modal v-model="modal.show">
            <p slot="header" style="color: #1c2438; text-align: center">
                <span>{{ modal.title }}</span>
            </p>
            <div style="padding: 10px;">
                <!-- <RadioGroup v-model="modal.type" style="margin:0 0 20px 30%;">
                    <Radio label="视频上传"></Radio>
                    <Radio label="压缩包上传"></Radio>
                </RadioGroup> -->
                <Form :ref="modal.ref" :model="modal.params" :rules="modal.rules" :label-width="110">
                    <Row>
                        <Col>
                        <FormItem label="视频文件" prop="">
                            <el-upload :file-list="fileList" class="upload-demo" ref="upload" action="#"
                                :on-change="handChangeFile"  
                                :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            </el-upload>
                        </FormItem>
                        </Col>

                        <Col span="18">
                        <FormItem label="影片封面" prop="">
                            <!--     <Upload action="http://54.251.94.70:8118/fileopt/uploadfiles" :before-upload="handleUpload"
                                :data="{ folder_name: folder_name }" :auto-upload="false">
                                <Button icon="ios-cloud-upload-outline">Upload files</Button>
                            </Upload> -->


                            <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList"
                                :format="['jpg', 'jpeg', 'png']" :max-size="2048" :on-exceeded-size="handleMaxSize"
                                :before-upload="handleUpload" multiple type="drag"
                                action="http://54.251.94.70:8118/fileopt/uploadfiles"
                                :data="{ folder_name: folder_name }" style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="ios-camera" size="20"></Icon>
                                </div>
                            </Upload>
                        </FormItem>
                        </Col>

                        <Col span="18">
                        <FormItem label="上传进度" prop="">
                            <!-- <el-progress v-if="schedule != 100" :text-inside="true" :stroke-width="26"
                                :percentage="Number(schedule)"></el-progress>
                            <el-progress v-else :text-inside="true" :stroke-width="26" :percentage="Number(schedule)"
                                status="success"></el-progress> -->
                            <el-progress type="circle" :width="80" :percentage="Number(schedule)"></el-progress>
                        </FormItem>
                        </Col>
                        <Col span="18">
                        <FormItem label="文件名称" prop="file_name">
                            <Input v-model.number="modal.params.file_name"></Input>
                        </FormItem>
                        </Col>


                    </Row>
                </Form>
            </div>
            <div slot="footer">
                <Button type="warning" @click="closeModalGroup()">取消</Button>
                <!-- <Button type="primary" @click="submitUpload(index)" :loading="isloading">上传</Button> -->
                <Button type="primary" v-if="schedule == 100" @click="clearFiles">完成</Button>
                <Button type="primary" v-else @click="submitForm(index)" :loading="isloading">上传</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import {
    uploadblob,
    mergechunks,
    updateone,
    uploadfiles
} from "@/api/fileopt";
export default {
    data() {
        return {
            countryList: [],
            fileList: [],
            picture: "",
            folder_name: "",
            modal: {
                type: "视频上传",
                show: false,
                title: "",
                ref: "uploadFILE",
                params: {
                    folder_name: "",
                    file_name: "",

                },
                Udata: {},
                rules: {
                    folder_name: [
                        { required: true, message: "请输入文件夹名称", trigger: "blur" },
                    ],
                    file_name: [
                        { required: true, message: "请输入文件名称", trigger: "blur" },
                    ]

                },
            },
            res_url_prefix: "",
            movie_id: "",
            isloading: false,
            uploadStatus: "上传",
            defaultList: [
                {
                    'name': 'image-demo-1.jpg',
                    'url': 'https://file.iviewui.com/images/image-demo-1.jpg'
                },
            ],
            chunks: [],
            folderName: '', //文件夹名
            fileName: '',
            schedule: 0,
            index: 0,
            size: 0,
            FileSize: 0,
            chunkIndex: JSON.parse(localStorage.getItem("chunkIndex")), //大于0表示上次传输被终止
            // resetTimer: "",
            timer: ""
        };
    },
    created() {


    },
    mounted() {
        // 添加事件监听器 5分钟页面未操作清楚上传缓存
        ['click', 'mousemove', 'keypress'].forEach(event =>
            window.addEventListener(event, this.resetTimer)
        );
        // 初始化计时器
        this.resetTimer();
    },
    beforeDestroy() {
        // 组件销毁前，清除计时器并移除事件监听
        clearTimeout(this.timer);
        ['click', 'mousemove', 'keypress'].forEach(event =>
            window.removeEventListener(event, this.resetTimer)
        );
    },
    computed: {

    },
    methods: {
        // 定义活动处理函数 5分钟未活动则清理切片缓存
        resetTimer() {
            // 如果已经有计时器，先清除
            if (this.timer) {
                clearTimeout(this.timer);
            }
            // 设置新的计时器
            this.timer = setTimeout(() => {
                // 5分钟未活动，执行的操作
                localStorage.removeItem('chunkIndex'); // 删除指定的localStorage数据
                console.log('未响应清楚缓存');
            }, 300000); 
        },

        clearFiles() {
            this.fileList = []; // 清除已选中的文件
            this.modal.params.file_name = ""
            this.schedule = 0
            this.modal.show = false
        },
        getMovie_id(row, url) {
            this.modal.Udata = row
            this.movie_id = row.id
            this.res_url_prefix = url
            this.modal.params.folder_name = this.movie_id
        },
        submitForm(index) {
            this.$refs["uploadFILE"].validate(async (valid) => {
                if (valid) {
                    await this.uploadImaage()
                    this.submitUpload(index)
                } else {
                    return false;
                }
            });
        },
        closeModalGroup() {
            this.modal.show = false;
        },

        //这里上传图片
        uploadImaage() {
            let data = {
                ...this.modal.Udata,
                picture: this.picture,
            }
            updateone(data).then(res => {
                if (res.code == 0) {
                    this.$emit("getList")
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
                // this.picture = this.modal.params.id + '/img/' + res.data.completeNameList[0]
                this.picture = this.movie_id + '/img/' + res.data.completeNameList[0]
                console.log(this.res_url_prefix + this.picture, '这里是拿到的图片文件');
                this.isloading = false;
            })
            return false;
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 2M.'
            });
        },
        handChangeFile(F) {
            console.log(this.chunkIndex);
            let file = F.raw
            this.modal.params.file_name = file.name
            // this.modal.params.folder_name = file.name.split('.')[0]
            this.folderName = file.name.split('.')[0];
            const chunkSize = 1024 * 1024; // 比如，每个分片1MB
            let start = 0;
            this.chunks = [];

            while (start < file.size) {
                const chunk = file.slice(start, start + chunkSize);
                this.chunks.push(chunk);
                start += chunkSize;
            }
            this.FileSize = start
            //检测所选文件是否上次上传文件
            if (this.chunkIndex && file.name == this.chunkIndex.fileName) {
                this.index = this.chunkIndex.index
                let rowSize = 0
                for (var i = 0; i <= this.chunkIndex.index; i++) {
                    console.log(this.chunks[i].size, '每个分片打大小');
                    rowSize += (this.chunks[i].size / this.FileSize) * 100
                    this.size += this.chunks[i].size
                }

                this.schedule = Number(rowSize.toFixed(2))
                console.log(this.schedule, '最终是百分之几');
                this.uploadStatus = '继续上传'
            } else {
                this.index = 0
                this.size = 0
                this.schedule = 0
                this.uploadStatus = '上传'
            }

        },
        async submitUpload(index) {
            if (index >= this.chunks.length) {
                if (this.chunks.length > 0) {
                    this.schedule = 100
                    this.isloading = false
                    // this.modal.show = false
                    this.$message.success('上传成功');
                } else {
                    this.$message.error('请选择文件');
                }
                return
            }
            //上传之前先检查是否存在上次传输中断情况

            this.isloading = true
            const formData = new FormData();
            formData.append("file", this.chunks[index]);
            formData.append("folder_name", this.modal.params.folder_name);
            formData.append('chunk_index', index); // 将文件夹名称添加到FormData对象中
            // 上传到服务器，这里用POST示例，URL需替换成你的上传接口
            uploadblob(formData).then(res => {
                this.size += this.chunks[index].size
                this.schedule = ((this.size / this.FileSize) * 100).toFixed(2)
                let data = {
                    index: index,
                    fileName: this.modal.params.file_name
                }
                localStorage.setItem('chunkIndex', JSON.stringify(data))
                this.index++
                this.submitUpload(this.index)
                if (index == this.chunks.length - 1) {
                    setTimeout(() => {
                        this.JoinFile()
                    }, 1000);
                }
            })
        },
        async JoinFile() {
            let data = {
                // folder_name: this.modal.params.folder_name,
                file_name: this.modal.params.file_name,
                total_chunks: this.chunks.length,
                slice_movie: true,
                unzip: false,
                save_chunk_file: false, //合并完成后删除服务器切片
                movie_id: this.movie_id,
                "slice_param": { "encrypt": false, "multiple_resolutions": false, "resolutions_num": 3, "cv_encoder": "h264", "cv_encoder_count": 4, "video_bitrate": "1500k", "preset": "ultrafast", "hls_time": 10, "threads": 0, "div_param": "" },
                // slice_param: {
                //     parset: "ultrafast",
                //     hls_time: 10,
                //     threads: 0
                // }
            }

            try {
                await mergechunks(data)
                localStorage.setItem("chunkIndex", JSON.stringify({ index: 0, fileName: '' }))
            } catch (err) {
                localStorage.setItem("chunkIndex", JSON.stringify({ index: 0, fileName: '' }))
            }

            //添加逻辑如果合并接口报错了就清空chunkIndex数量
            this.uploadStatus = '上传'
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