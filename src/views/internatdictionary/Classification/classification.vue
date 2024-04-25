<template>
  <el-card style="height: 820px">
    <div class="body">

      <!-- 功能区 -->
      <div class="seach-form">
        <el-form :inline="true">
     
          <el-form-item label="分类名称">
            <el-input size="small" v-model="table.params.category_name" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary"  @click="getList"
              :loading="isloading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button size="small" type="primary" @click="addAdvertising">新增分类</el-button>
          <!-- <el-button size="small" type="danger" @click="deletesing('', ids)">批量删除</el-button> -->
      <el-table v-loading="loading" :data="table.data" style="width: 100%;
        margin-bottom: 20px;margin-top: 10px;" row-key="id" :header-cell-style="{ background: '#f8f8f9' }"
        ref="adverTable" border :row-class-name="rowClassNameFun" :header-row-class-name="headerRowClassName"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="category_name" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="english" label="英语" align="center">
        </el-table-column>
        <el-table-column prop="india" label="印地语" align="center">
        </el-table-column>
        <el-table-column prop="simple_chinese" label="简体中文" align="center">
        </el-table-column>
        <el-table-column prop="traditional_chinese" label="繁体中文" align="center">
        </el-table-column>
        <el-table-column prop="japanese" label="日语" align="center">
        </el-table-column>
        <el-table-column prop="korean" label="韩语" align="center">
        </el-table-column>
        <el-table-column prop="india" label="印地语" align="center">
        </el-table-column>
        <el-table-column prop="french" label="法语" align="center">
        </el-table-column>
        <el-table-column prop="spanish" label="西班牙语" align="center">
        </el-table-column>
        <el-table-column prop="portuguese" label="葡萄牙语" align="center">
        </el-table-column>
        <el-table-column prop="cambodian" label="柬埔寨语" align="center">
        </el-table-column>
        <el-table-column prop="russian" label="俄语" align="center">
        </el-table-column>
        <el-table-column prop="german" label="德语" align="center">
        </el-table-column>
        <el-table-column fixed="right" width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" style="background-color:#2db7f5;border: 0;" type="info"
              @click="updateAdver(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" style="border: 0;" type="danger" <!--
              @click="deletesing(scope.$index, scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <Page v-show="table.data.length" show-sizer show-total style="margin-top:10px;float:right;" :show-total="false"
        :current="table.params.page" :page-size-opts="table.pageSizes" :page-size="table.params.limit"
        @on-page-size-change="limitchange" @on-change="pagechange"></Page>
      <!-- 新增模板 -->
      <classmodal @getList="getList" ref="classModal"></classmodal>
    </div>
  </el-card>
</template>

<script>
import { Mixin } from "../videoMixin.js"
import classmodal from "./component/classmodal.vue";
import { getallFclass, deletemany, i18npage, i18ndeletemany } from "@/api/navigate"

export default {
  components: {
    classmodal,
  },
  mixins: [Mixin],
  data() {
    return {
      ids: [],
      formItem: {
        select: "",
      },
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
      table: {
        show: false,
        total: 0,
        pageSizes: [10, 50, 100],
        params: {
          page: 1,
          limit: 10,
          category_name: ""
        },
        data: [],

      },
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
    async getList() {
      this.loading = true
      let data = {
        page: this.table.params.page,
        limit: this.table.params.limit,
        category_name: this.table.params.category_name,
      }
      let res = await i18npage(data)

      if (res.code == 0) {
        this.table.data = res.data.list == null ? [] : res.data.list
        console.log(this.table.data, '新数据');


        this.adverType = this.table.data.map(item => {
          return { label: item.name, value: item.id }
        })
        this.loading = false
      }
      this.loading = false
    },
    //初始化数据,将数据都用isSelect标记一下，isSelect为false不选中、true选中、half半选

    rowClassNameFun({ row }) {
      if (row.isSelect === '') {
        return "indeterminate";
      }
    },
    headerRowClassName({ row }) {
      let oneProductIsSelect = [];
      this.table.data.forEach((item) => {
        oneProductIsSelect.push(item.isSelect);
      });
      if (oneProductIsSelect.includes("")) {
        return "indeterminate";
      }
      return "";
    },


    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
    },

    //上传视频
    addAdvertising() {
      this.$refs.classModal.modal.show = true
      this.$refs.classModal.modal.title = "新增分类"
      this.$refs.classModal.getoldData({}, this.adverType)
    },
    isSwow(show) {
      // console.log(show);
      return show ? '是' : '否'

    },
    ispublic(h, params) {
      let text = params.row.show ? '是' : '否'
      let color = params.row.show === true ? 'green' : 'red';
      return h('Tag', {
        props: {
          color: color,
          size: "large"
        }
      }, text);
    },
    jumpType(type) {
      switch (type) {
        case 1:
          return "页面弹窗"
        case 2:
          return "外链跳转"
        default:
          return '未知'
      }
    },
    review(status, row) {
      updatetemplate({ id: row.id, status: status }).then(res => {
        this.getList();
      })
    },

    deletesing(index, id) {
      let ids = Array.isArray(id) ? id : [id]
      if (ids.length == 0) return this.$message.error('请选择分类')
      this.$Modal.confirm({
        title: "确认删除",
        content: "<p>是否确认删除此模板</p>",
        onOk: () => {
          i18ndeletemany({ ids }).then(res => {
            if (res.code == 0) {
              this.$message.success("删除成功")
              this.getList();
            }
          })
        },
      });
    },
    updateAdver(index, row) {
      this.$refs.classModal.modal.show = true
      this.$refs.classModal.modal.title = "编辑分类"
      this.$refs.classModal.getoldData(row, this.adverType)
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


.el-checkbox__inner {
  width: 16px;
  height: 16px;
}

.el-checkbox__inner::after {

  border-left: 0;
  border-top: 0;
  left: 5px;
  top: 3px;
}

.el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: rotate(50deg) scaleY(1.3);

}

.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #0fc1af !important;
  border-color: #0fc1af !important;
  color: #fff !important;
}

.indeterminate .el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: scale(0.5);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  border-color: #c0c4cc !important;
  background-color: #c0c4cc;
}

.product-show th .el-checkbox__inner {
  display: none !important;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(0.5);
  left: 0;
  right: 0;
  top: 5px;
  width: auto !important;
}
</style>
