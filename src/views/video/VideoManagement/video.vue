<template>
  <el-card style="height: 820px">
    <!-- <img  :style="{width:'200px'}" src="" alt=""> -->
    <div class="body">
      <!-- 查询条件 -->
      <div class="seach-form">
        <el-form :inline="true">
          <el-form-item label="片名">
            <el-input size="small" v-model="table.params.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select size="small" v-model="table.params.tag" clearable>
              <el-option v-for="(item, index) in selectData.tags" :label="item.value" :value="item.value"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="语言">
            <el-select size="small" v-model="table.params.language_id" clearable>
              <el-option v-for="(item, index) in selectData.lan" :label="item.name" :value="item.id"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区">
            <el-select size="small" v-model="table.params.area_id" clearable>
              <el-option v-for="(item, index) in selectData.area" :label="item.name" :value="item.id"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类">
            <el-select size="small" v-model="table.params.cid" clearable placeholder="请选择">
              <el-option-group v-for="group in options" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="primary" icon="el-icon-search" @click="getList(1)"
              :loading="isloading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 功能区 -->
      <div>
        <el-button size="small" type="primary" @click="uploadVideo(2)">添加影片</el-button>
        <el-button size="small" type="primary" @click="BatchListing(1)">批量上架</el-button>
        <el-button size="small" type="primary" @click="BatchListing(2)">批量下架</el-button>
        <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
        <el-button size="small" type="warning"  @click="updatedictionary(ids)">批量修改字典</el-button>
      </div>
      <div class="table-scroll">
        <Table border :columns="table.columns" @on-selection-change="handSelectChange" :data="table.data"
          style="margin-top: 12px;" height="600">
          <template #img="{ row }">
            <img :style="{ width: '120px', height: '80px' }" v-image-preview :src="res_url_prefix + row.picture" alt="">
          </template>
          <template #action="{ row }">
            <Button style="margin-left: 10px;" type="info" @click="uploadVideo(1, row, res_url_prefix)"
              icon="ios-cloud-upload-outline">上传视频</Button>
            <Button style="margin-left: 10px;" type="info" @click="updateMV(row)">编辑</Button>
            <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button>
          </template>
        </Table>
      </div>

      <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;" :total="table.total"
        :current="table.params.page" :page-size-opts="table.pageSizes" :page-size="table.params.limit"
        @on-page-size-change="limitchange" @on-change="pagechange"></Page>
      <!-- 新增模板 -->
      <AddVideo @getList="getList" ref="addvideos"></AddVideo>
      <AddMovieClass :selectData="selectData" @getList="getList" ref="MovieClass"></AddMovieClass>
      <!-- 修改字典 -->
      <EditDictionary @getList="getList" :selectData="selectData" ref="editDictionary" ></EditDictionary>
    </div>
  </el-card>
</template>

<script>
import { Mixin } from "../videoMixin.js"
import AddVideo from "./component/addVideoModial.vue";
import AddMovieClass from "./component/addMovieClass.vue";
import EditDictionary from "./component/dictionaryModial.vue"
import { pageMovie, deletemany, Batchpublic } from "@/api/fileopt";
import { GetAreaall, GetTagall, GetLanall } from "@/api/dictionary";
import { getallFclass } from "@/api/navigate"
export default {
  components: {
    AddVideo,
    AddMovieClass,
    EditDictionary
  },
  mixins: [Mixin],
  data() {
    return {
      selectData: {
        tags: [],
        lan: [],
        area: [],
      },
      classList: [],
      res_url_prefix: "",
      isloading: false,
      datetime: null,
      ids: [],
      table: {
        show: false,
        total: 0,
        pageSizes: [10, 50, 100],
        params: {
          page: 1,
          limit: 10,
          name: "",
          cid: "",
          tag: "",
          actor: "",
          language: "",
          language_id: "",
          area_id: "",
          area: "",
        },
        data: [],
        columns: [
          { type: 'selection', width: 60, align: 'center', width: 70 },
          { title: "视频名称", key: 'name', align: 'center', tooltip: true, width: 100 },
          {
            title: "视频状态", key: 'slice_status', align: 'center', width: 120,
            render: (h, params) => { return this.fmtMovieStatus(h, params) }
          },
          {
            title: "是否上架", key: 'public', align: 'center', width: 100,
            render: (h, params) => { return this.ispublic(h, params) }
          },
          {
            title: "标签", key: "tags", align: "center", width: 100,
            render: (h, params) => {
              return h('Tooltip', {
                props: {
                  content: this.setTags(params.row.tags),
                  placement: 'bottom'
                }
              }, [
                h('span', this.randerTags(params.row.tags))
              ]);
            }
          },
          { title: "播放次数", key: "hits", align: "center", width: 60, width: 100 },
          { title: "主演", key: "actor", align: "center", width: 100 },
          // { title: "简介", key: "blurb", align: "center", tooltip: true, width: 100 },
          { title: "语言", key: "language", align: "center", width: 100 },
          {
            title: "封面", key: "picture", align: "center", slot: "img", width: 200
          },
          { title: "地区", key: "area", align: "center", width: 100 },
          {
            title: "上映时间", key: "release_time", align: "center", width: 140,
            render: (h, params) => h('span', this.settime(params.row.release_time))
          },
          {
            title: "操作", key: "operate", align: "center", width: 300, slot: "action", 
          },
        ],
      },
      options: [],
      // fixed: 'right'

    };
  },

  created() {
    // this.getList()
    // this.getselectData()
    // this.getClassList()
  },
  mounted() {
    console.log(Mixin, '查看数据');
  },
  destroyed() {

  },
  methods: {

    getClassList() {
      getallFclass().then(res => {
        if (res.code == 0) {
          this.$refs.MovieClass.Classification = res.data
          this.$refs.editDictionary.Classification = res.data
          this.options = res.data.map(item => {
            if (item.children) {
              return {
                label: item.name,

                options: item.children.map(item1 => {
                  return {
                    label: item1.name,
                    value: item1.id
                  }
                })
              }
            } {
              return {
                label: item.name,

                options: []
              }
            }

          })
        }
      })
    },
    getList(page) {
      if (page) {
        this.table.params.page = page
      }
      pageMovie(this.table.params).then(res => {
        this.res_url_prefix = res.data.res_url_prefix
        this.table.data = res.data.list || []
        this.table.total = res.data.total
      })
    },
    updatedictionary(ids){
      if (ids.length == 0) {
        this.$message.warning("请选择要修改的影片")
        return
      }
      this.$refs.editDictionary.modal.params = {} 
      this.$refs.editDictionary.modal.params.movie_ids = ids
      this.$refs.editDictionary.modal.show = true
    },
    //上传视频
    uploadVideo(e, row, url) {
      if (e == 1) {
        this.$refs.addvideos.modal.show = true
        this.$refs.addvideos.modal.title = "上传视频"
        row.res_url_prefix = this.res_url_prefix
        this.$refs.addvideos.getMovie_id(row, url)

      } else {
        this.$refs.MovieClass.modal.show = true
        this.$refs.MovieClass.modal.params = {}
        this.$refs.MovieClass.modal.title = "添加影片"
        this.$refs.MovieClass.getData({})
      }
    },

    BatchListing(e) {
      if (this.ids.length == 0) return this.$Message.error('请选择要操作的影片')
      const OKid = this.table.data.reduce((acc, item) => {
        if (this.ids.includes(item.id) && item.slice_status === 2 || item.ext_link) {
          acc.push(item.id);
        }
        return acc;
      }, []);
      Batchpublic({ ids: e == 1 ? OKid : this.ids, public: e == 1 ? true : false }).then(res => {
        if (res.code == 0) {
          this.$message.success(e == 1 ? '上架成功' : '下架成功')
          this.getList()
        }
      })
    },
    updateMV(row) {
      row.res_url_prefix = this.res_url_prefix
      this.$refs.MovieClass.modal.show = true
      this.$refs.MovieClass.modal.title = "编辑影片"
      this.$refs.MovieClass.getData(row)
    },
    deletesing(id) {
      let ids = Array.isArray(id) ? id : [id]
      if (ids.length == 0) return this.$message.error("请选择要删除的影片")
      this.$Modal.confirm({
        title: "确认删除",
        content: "<p>是否确认删除此模板</p>",
        onOk: () => {
          deletemany({ ids }).then(res => {
            if (res.code == 0) {
              this.$message.success("删除成功")
              this.getList();
            }
          })
        },
      });
    },
    setTags(tags) {
      let tag = ""
      if (tags) {
        tags.map((item, index) => {
          if (index == tags.length - 1) {
            tag += item
          } else {
            tag += item + '、'
          }
        })
        return tag
      } else {
        return tags
      }

    },
    randerTags(tags) {
      if (tags) {
        return tags.length > 1 ? tags[0] + '...' : tags
      } else {
        return tags
      }

    },
    settime(time) {
      if ((time + '').length > 11) {
        return time == 0 ? time : this.$moment.unix(time / 1000).format('YYYY-MM-DD')
      } else {
        return time == 0 ? time : this.$moment.unix(time).format('YYYY-MM-DD')
      }
    },
    fmtMovieStatus(h, params) {
      if (params.row.ext_link) {

        return h('Tag', {
          props: {
            color: "green",
            size: "large"
          }
        }, "完成切片");
      } else {
        let type = {
          color: '',
          text: ''
        }
        switch (params.row.slice_status) {
          case 0:
            type.text = "等待切片"
            type.color = 'warning'
            break;
          case 1:
            type.text = "正在切片"
            type.color = 'blue'
            break;
          case 2:
            type.text = "完成切片"
            type.color = 'green'
            break;
          case 3:
            type.text = "切片失败"
            type.color = 'red'
            break;
          default:
            type.text = "未知"
            type.color = '#ccc'
            break;
        }
        return h('Tag', {
          props: {
            color: type.color,
            size: "large",
          }
        }, type.text);
      }
    },
    ispublic(h, params) {
      let text = params.row.public ? '是' : '否'
      let color = params.row.public === true ? 'green' : 'red';
      return h('Tag', {
        props: {
          color: color,
          size: "large"
        }
      }, text);
    },
    limitchange(limit) {
      this.table.params.page = 1;
      this.table.params.limit = limit;
      this.getList();
    },
    //查询分页
    pagechange(page) {
      this.table.params.page = page;
      this.getList();
    },
    async getselectData() {
      this.selectData.tags = (await GetTagall()).data
      this.selectData.lan = (await GetLanall()).data
      this.selectData.area = (await GetAreaall()).data
    }
  },
};
</script>

<style lang="less">
.monitor-container {
  width: 100%;
  height: 400px;
  color: #303133;

  .system,
  .host {
    background: #fff;
    height: 400px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    div {
      span:nth-child(2) {
        color: #969799;
      }
    }
  }

  .host {
    div {
      display: flex;
      justify-content: space-between;
      padding: 15px 20px;
      border-bottom: 1px solid #e6ebf5;
    }

    div:first-child {
      font-size: 17px;
      width: 100%;
    }

    div:nth-child(n + 2) {
      width: 96%;
      margin: auto;
    }
  }

  .system {
    .system-first {
      position: relative;
      font-size: 17px;
      padding: 15px 20px;
      width: 100%;
      padding: 13px 0;
      border-bottom: 1px solid #e6ebf5;

      .title {
        position: absolute;
        left: 50%;
        color: initial;
      }
    }

    .system-item {
      width: 45%;
      float: left;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e6ebf5;
      padding: 13px 0;
    }

    .system-item:nth-child(even) {
      margin-left: 15px;
    }

    .system-item:nth-child(odd) {
      margin-left: 12px;
    }

    .progress-container {
      border: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      padding: 0 20px;
      margin-top: 15px;
      clear: left;
    }
  }

  .table-scroll {
    overflow-x: auto;
  }

  .image-preview-mask {
    z-index: 9999;
    /* 设置遮罩层的层级 */
  }


}
</style>
