<template>
  <el-card style="height: 820px">
    <div class="body">
      <!-- 查询条件 -->
      <div class="seach-form">
        <el-form :inline="true">
          <el-form-item label="广告类型">
            <el-select size="small" v-model="table.params.type" clearable>
              <el-option v-for="(item, index) in adverType" :label="item.label" :value="item.value"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跳转类型">
            <el-select size="small" v-model="table.params.jump_type" clearable>
              <el-option v-for="(item, index) in jumpType" :label="item.label" :value="item.value"
                :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" type="primary" icon="el-icon-search" @click="getList()"
              :loading="isloading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 功能区 -->
      <div>
        <el-button size="small" type="primary" @click="addAdvertising">新增广告</el-button>
        <el-button size="small" type="danger" @click="deletesing(ids)">批量删除</el-button>
      </div>
      <Table @on-selection-change="handSelectChange" border :columns="table.columns" :data="table.data"
        style="margin-top: 12px;" height="600">
        <template #action="{ row }">
          <Dropdown @on-click="(e) => review(e, row)">
          </Dropdown>
          <Button style="margin-left: 10px;" type="info" @click="updateAdver(row)">编辑</Button>
          <Button style="margin-left: 10px;" type="error" @click="deletesing(row.id)">删除</Button>
        </template>
      </Table>
      <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;" :total="table.total"
        :current="table.params.page" :page-size-opts="table.pageSizes" :page-size="table.params.limit"
        @on-page-size-change="limitchange" @on-change="pagechange"></Page>
      <!-- 新增模板 -->
      <addAdver @getList="getList" ref="addAdver"></addAdver>
    </div>
  </el-card>
</template>

<script>
import { Mixin } from "../videoMixin.js"
import addAdver from "./component/addAdver.vue";
import { getdataAdver, delAdver, updateAdver } from "@/api/advertise"
export default {
  components: {
    addAdver,
  },
  mixins:[Mixin],
  data() {
    return {
      ids: [],
      formItem: {
        select: "",
      },
      res_url_prefix: "",
      isloading: false,
      datetime: null,
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
      jumpType: [
        {
          label: '站内跳转',
          value: 1
        }, {
          label: '外链跳转',
          value: 2
        }
      ],
      table: {
        show: false,
        total: 0,
        pageSizes: [10, 50, 100],
        params: {
          page: 1,
          limit: 10,
          type: "",
          jump_type: "",
          begin_time: "", //开始时间
          end_time: "", //结束时间
          sign_id: "", //签名id
          status: "", //状态
          show: ""
        },
        data: [],
        columns: [
          {
            type: 'selection',width: 60,align: 'center'
          },
          { title: "名称", key: 'name', align: 'center' },
          {
            title: "图片", key: "image", align: "center",
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: this.res_url_prefix + params.row.image, // 假设每行数据中包含图片的URL
                  style: 'width: 120px; height: 80px;margin-top:10px' // 设置图片尺寸
                }
              });
            }
          },
          {
            title: "广告类型", key: "type", align: "center",
            render: (h, params) => h('span', this.seadvType(params.row.type))
          },
          { title: "跳转地址", key: "jump_url", align: "center" },
          { title: "点击数", key: "hits", align: "center" },
          {
            title: "跳转类型", key: "jump_type", align: "center",
            render: (h, params) => h('span', this.fmtjumpType(params.row.jump_type))
          },
          { title: "描述", key: "desc", align: "center", tooltip: true },
          {
            title: "创建时间", key: "create_time", align: "center",
            render: (h, params) => h('span', this.settime(params.row.create_time))
          },
          {
            title: "操作", key: "operate", align: "center", Width: 100, slot: "action"
          },
        ],
      }
    };
  },
  created() {
    this.getList()
  },
  mounted() {
 
  },
  destroyed() {

  },
  methods: {
    async getList(page = 1) {
      let data = {
        page: this.table.params.page || page,
        limit: this.table.params.limit,
        type: this.table.params.type == "" ? -1 : this.table.params.type,
        jump_type: this.table.params.jump_type == "" ? -1 : this.table.params.jump_type,
        id: "",
        show: this.table.params.show === "" ? -1 : this.table.params.show,
      }
      let res = await getdataAdver(data)
      this.table.data = res.data.list ? res.data.list : []
      this.table.total = res.data.total
      this.res_url_prefix = res.data.res_url_prefix
    },
    //上传视频
    addAdvertising() {
      this.$refs.addAdver.modal.show = true
      this.$refs.addAdver.modal.title = "新增广告"
      this.$refs.addAdver.getoldData({ res_url_prefix: this.res_url_prefix })
    },
    seadvType(type) {
      switch (type) {
        case 1:
          return "首页广告"
        case 2:
          return "弹窗广告"
        case 3:
          return "底部广告"
        default:
          return '未知'
      }
    },
    fmtjumpType(type) {
      switch (type) {
        case 1:
          return "站内跳转"
        case 2:
          return "外链跳转"
        default:
          return '未知'
      }
    },
    review(status, row) {
      console.log(status, row);
      updatetemplate({ id: row.id, status: status }).then(res => {
        this.getList();
      })
    },

    deletesing(id) {
      let ids = Array.isArray(id) ? id : [id]
      if (ids.length == 0) return this.$message.error('请选择分类')
      this.$Modal.confirm({
        title: "确认删除",
        content: "<p>是否确认删除此模板</p>",
        onOk: () => {
          delAdver({ ids }).then(res => {
            if (res.code == 0) {
              this.$message.success("删除成功")
              this.getList();
            }
          })
        },
      });
    },
    updateAdver(row) {
      this.$refs.addAdver.modal.show = true
      this.$refs.addAdver.modal.title = "编辑广告"
      row.res_url_prefix = this.res_url_prefix
      this.$refs.addAdver.getoldData(row)
    },
    settime(time) {
      return time == 0 ? time : this.$moment.unix(time).format('YYYY-MM-DD HH:mm')
    },
    limitchange(limit) {
      this.table.params.page = 1;
      this.table.params.limit = limit;
      this.getList();
    },
    //查询分页
    pagechange(page) {
      console.log(page);
      this.table.params.page = page;
      this.getList();
    },
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
}
</style>
