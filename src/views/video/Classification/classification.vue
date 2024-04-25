<template>
  <el-card style="height: 820px">
    <div class="body">
      <!-- 查询条件 -->
      <div class="seach-form">
        <el-form :inline="true">

          <el-form-item label="">

          </el-form-item>
        </el-form>
      </div>
      <!-- 功能区 -->
      <div>
        <el-button size="small" type="primary" @click="addAdvertising">新增分类</el-button>
        <el-button size="small" type="danger" @click="deletesing('', ids)">批量删除</el-button>
        <el-button size="small" type="primary" icon="el-icon-search" @click="getList"
          :loading="isloading">查询</el-button>
      </div>

      <el-table v-loading="loading" :data="table.data" style="width: 100%;
        margin-bottom: 20px;margin-top: 10px;" row-key="id" :header-cell-style="{ background: '#f8f8f9' }" ref="adverTable" border
        :row-class-name="rowClassNameFun" :header-row-class-name="headerRowClassName" @select-all="selectAllFun"
        @select="selectFun" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center">
        </el-table-column>
        <el-table-column prop="type" label="是否显示" align="center" :formatter="isSwow">
        </el-table-column>
        <el-table-column prop="sort_index" label="排序" align="center">
        </el-table-column>
        <el-table-column prop="sort_index" label="描述" align="center">
          <template slot-scope="scope">
            <el-popover v-if="scope.row.desc && scope.row.desc.length > 25" :content="scope.row.desc" placement="top"
              trigger="hover" width="250">
              <span slot="reference">{{ scope.row.desc.slice(0, 25) + "..." }}</span>
            </el-popover>
            <span v-else>{{ scope.row.desc }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="210" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" style="background-color:#2db7f5;border: 0;" type="info"
              @click="updateAdver(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" style="border: 0;" type="danger"
              @click="deletesing(scope.$index, scope.row.id)">删除</el-button>
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
import { getallFclass, deletemany } from "@/api/navigate"
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
          type: "",
          begin_time: "", //开始时间
          end_time: "", //结束时间
          sign_id: "", //签名id
          status: "" //状态
        },
        data: [],

      },
    };
  },

  created() {
    // this.getList()
  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    async getList() {
      this.loading = true
      let res = await getallFclass(this.table.params)
      if (res.code == 0) {
        this.table.data = res.data == null ? [] : res.data
        console.log(this.table.data, '新数据');
        // this.table.total = res.data.total
        this.initData(this.table.data)
        this.adverType = this.table.data.map(item => {
          return { label: item.name, value: item.id }
        })
        this.loading = false
      }
      this.loading = false
    },
    //初始化数据,将数据都用isSelect标记一下，isSelect为false不选中、true选中、half半选
    initData(data) {
      data.forEach((item) => {
        item.isSelect = false; //默认为不选中
        if (item.children && item.children.length) {
          this.initData(item.children);
        }
      });
    },
    selectFun(selection, row) {
      this.setRowIsSelect(row);
    },
    setRowIsSelect(row) {
      this.ids = []
      console.log('row+: ', row);
      //当点击父级点复选框时，当前的状态可能为未知状态，所以当前行状态设为false并选中，即可实现子级点全选效果
      if (row.isSelect == "half") {
        row.isSelect = false;
        this.$refs.adverTable.toggleRowSelection(row, true);
      }
      row.isSelect = !row.isSelect;
      let that = this
      function selectAllChildrens(data) {
        data.forEach((item) => {
          item.isSelect = row.isSelect;
          that.$refs.adverTable.toggleRowSelection(item, row.isSelect);
          if (item.children && item.children.length) {
            selectAllChildrens(item.children);
          }
        });
      }

      function getSelectStatus(selectStatuaArr, data) {
        data.forEach((childrenItem) => {
          selectStatuaArr.push(childrenItem.isSelect);
          if (childrenItem.children && childrenItem.children.length) {
            getSelectStatus(selectStatuaArr, childrenItem.children);
          }
        });
        return selectStatuaArr;
      }

      function getLevelStatus(row) {
        //如果当前节点的parantId =0 并且有子节点，则为1
        //如果当前节点的parantId !=0 并且子节点没有子节点 则为3
        if (row.pid == "000000000000000000000000") {
          if (row.children && row.children.length) {
            return 1;
          } else {
            return 4;
          }
        } else {
          if (!row.children || !row.children.length) {
            return 3;
          } else {
            return 2;
          }
        }

      }

      let result = {};
      //获取明确的节点
      function getExplicitNode(data, parentId) {
        data.forEach((item) => {
          if (item.id == parentId) {
            result = item;
          }
          if (item.children && item.children.length) {
            getExplicitNode(item.children, parentId);
          }
        })
        return result;
      }

      function operateLastLeve(row) {
        //操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
        let selectStatuaArr = [];
        let item = getExplicitNode(that.table.data, row.pid);
        selectStatuaArr = getSelectStatus(selectStatuaArr, item.children);
        if (
          selectStatuaArr.every((selectItem) => {
            return true == selectItem;
          })
        ) {
          item.isSelect = true;
          that.$refs.adverTable.toggleRowSelection(item, true);
        } else if (
          selectStatuaArr.every((selectItem) => {
            return false == selectItem;
          })
        ) {
          item.isSelect = false;
          that.$refs.adverTable.toggleRowSelection(item, false);
        } else {
          item.isSelect = "";
        }
        //则还有父级
        if (item.pid != "000000000000000000000000") {
          operateLastLeve(item)
        }
      }

      //判断操作的是子级点复选框还是父级点复选框，如果是父级点，则控制子级点的全选和不全选

      //1、只是父级 2、既是子集，又是父级 3、只是子级
      let levelSataus = getLevelStatus(row);
      if (levelSataus == 1) {
        selectAllChildrens(row.children);
      } else if (levelSataus == 2) {
        selectAllChildrens(row.children);
        operateLastLeve(row);
      } else if (levelSataus == 3) {
        operateLastLeve(row);
      }
    },
    // 判断是不是全选
    checkIsAllSelect() {
      this.addverIsSelect = [];
      this.table.data.forEach((item) => {
        this.addverIsSelect.push(item.isSelect);
      });
      //判断一级产品是否是全选.如果一级产品全为true，则设置为取消全选，否则全选
      let isAllSelect = this.addverIsSelect.every((selectStatusItem) => {
        return true == selectStatusItem;
      });
      return isAllSelect;
    },
    selectAllFun(selection) {
      let isAllSelect = this.checkIsAllSelect();
      console.log('this.table.data: ', this.table.data);
      this.table.data.forEach((item) => {
        item.isSelect = isAllSelect;
        this.$refs.adverTable.toggleRowSelection(item, !isAllSelect);
        this.selectFun(selection, item);
      });
    },
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
      let ids = []
      selection.forEach(node => {
        if (node.isSelect == true) {//如果上来勾选了
          if (node.children && node.children.length > 0) {//判断是否有子元素,如果有子，遍历子
            node.children.forEach(child => {
              if (child.isSelect) {
                let index = ids.findIndex(item =>
                  item.id === child.id
                );
                if (index === -1) {
                  ids.push(child.id)
                }
              }
            })
          } else {//如果没有子，
            console.log('选中')
            let index = ids.findIndex(item =>
              item.id === node.id
            );
            if (index === -1) {
              ids.push(node.id)
            }
          }
        } else if (node.isSelect == "") {//如果是半选，遍历子，将勾选的子进行push
          console.log('半选')
          if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
              if (child.isSelect) {
                ids.push(child.id)
              }
            })
          }
        }
      })
      this.ids = [...new Set(ids)]
      console.log('this.ids: ', this.ids);
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
      // console.log(status, row);
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
          deletemany({ ids }).then(res => {
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
