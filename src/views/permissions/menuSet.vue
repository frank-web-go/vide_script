<template>
  <el-card class="box-card">
    <!-- 查询条件 -->
    <div class="seach-form">
      <el-form :inline="true" style="float: right">
        <!-- <el-form-item label="">
          <el-input v-model="table.params.phone_number" placeholder="请输入号码" style="margin-right: 10px"
            size="small"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="table.params.type" placeholder="请输入业务" style="margin-right: 10px" size="small"></el-input>
        </el-form-item> -->
        <el-form-item label="">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getList()"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div style="float: left">
      <el-button type="primary" size="small" @click="Reset">新增菜单</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-box" ref="tableBox">
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="table.data"
        border
        v-if="tableHeight"
        :height="tableHeight"
        fit
        highlight-current-row
        :header-cell-style="{
          background: 'rgb(15,193,175,.7)',
          color: '#191a23',
        }"
        row-key="menu_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%; height: 50px"
      >
        <!-- 空数据状态的插槽 -->
        <template slot="empty">
          <el-empty :image-size="100" description="暂无数据"></el-empty>
        </template>
        <el-table-column
          type="index"
          width="55"
          align="center"
          label="序号"
          min-width="209"
        ></el-table-column>
        <el-table-column
          prop="name"
          min-width="180"
          label="菜单名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sort"
          min-width="180"
          label="菜单排序"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="icon"
          min-width="180"
          label="菜单图标"
          align="center"
        >
          <template slot-scope="scope">
            <Icon :type="scope.row.icon" size="22"></Icon>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          min-width="180"
          label="对应路由"
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <Modal v-model="form.show">
        <p slot="header">
          <span>{{ form.params.type ? "编辑" : "新增" }}菜单</span>
        </p>
        <Form
          :ref="form.ref"
          :model="form.params"
          :rules="form.rules"
          :label-width="100"
        >
          <FormItem label="菜单名称：" prop="name">
            <Input type="text" v-model="form.params.name" clearable></Input>
          </FormItem>
          <FormItem label="对应路由：" prop="url">
            <Input
              type="text"
              v-model="form.params.url"
              :disabled="form.params.type == 1"
              clearable
            ></Input>
          </FormItem>
          <FormItem label="上级菜单：">
            <Select
              placeholder="请选择上级菜单"
              v-model="form.params.pid"
              clearable
            >
              <Option
                v-for="(item, index) in table.data"
                :value="item.menu_id"
                :key="index"
                :label="item.name"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="角色权限：">
            <Select
              placeholder="请选择角色"
              v-model="form.params.role_ids"
              multiple
              clearable
            >
              <Option
                v-for="(item, index) in roleID"
                :value="item.role_id"
                :key="index"
                :label="item.name"
                >{{ item.name }}</Option
              >
            </Select>
          </FormItem>
          <Form-item label="菜单图标：" prop="icon">
            <Input
              v-model="form.params.icon"
              placeholder="请选择"
              @on-focus="openicons()"
              readonly
              clearable
            ></Input>
          </Form-item>
          <FormItem label="菜单排序：">
            <InputNumber
              style="width: 100%"
              type="text"
              v-model="form.params.sort"
            />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="form.show = false">取消</Button>
          <Button type="primary" @click="addmenus()">确认</Button>
        </div>
      </Modal>

      <!--icon选择-->
      <Modal
        v-model="icon.show"
        width="685"
        class-name="menuManage-ivu-modal"
        :mask-closable="false"
      >
        <p slot="header">
          <span>点击选择图标</span>
        </p>
        <div>
          <Input
            v-model="icon.iconSearch"
            placeholder="请输入图标名字"
            style="width: 120px"
            clearable
          ></Input>
        </div>
        <div class="menuManage-menuicons">
          <span
            v-for="(item, index) in select.icon_List"
            @click="selecticon(item)"
            :class="{ cur: item == form.params.icon }"
            :key="index"
            v-show="!icon.iconSearch || item.indexOf(icon.iconSearch) > -1"
          >
            <Icon :type="item"></Icon>
          </span>
        </div>
        <div slot="footer">
          <Button type="success" size="large" @click="icon.show = false"
            >&nbsp;取&nbsp;消&nbsp;</Button
          >
        </div>
      </Modal>
    </div>
  </el-card>
</template>
<script>
import {
  AllMenu,
  addmenu,
  deletemenu,
  getroleID,
  updatemenu,
} from "@/api/user";
import menuicons from "@/config/menuicons";

export default {
  name: "menuSet",
  data() {
    return {
      setType: "",
      loading: false,
      roleID: [],
      select: {
        menu_list: [],
        icon_List: [],
      },
      table: {
        data: [],
      },

      form: {
        ref: "menuset",
        show: false,
        params: {
          type: 0, //0 新增 1编辑 2删除
          menu_id: "",
          role_ids: [],
          status: 0, //0 启动 1禁用
          icon: "",
          name: "",
          mtype: 0, //0 菜单 1按钮
          pid: 0,
          sort: 1,
          url: "",
          api: "",
        },
        rules: {
          name: [
            {
              required: true,
              trigger: "blur",
              message: "请输入对应菜单名",
            },
          ],
          url: [
            {
              required: true,
              message: "请输入对应路由名",
              trigger: "blur",
            },
          ],
        },
      },
      icon: {
        show: false,
        iconSearch: "",
      },
    };
  },
  created() {
    window.addEventListener("resize", this.getTableHeight);
    this.getList();
    this.getroleID();
  },
  computed: {
    tableHeight() {
      if (this.showAll) {
        return window.innerHeight - 230;
      } else {
        return window.innerHeight - 230;
      }
    },
  },
  mounted() {
    this.select.icon_List = menuicons;
  },
  methods: {
    getroleID() {
      getroleID().then((res) => {
        this.roleID = res.data.list;
      });
    },
    //获取所有菜单列表
    getList() {
      this.loading = true;
      AllMenu({})
        .then((res) => {
          let data = res.data || [];
          // data.map((item) => {
          //   item.id = item.menu_id.toString();
          //   item.children.map((item1) => {
          //     item1.id = item1.menu_id.toString();
          //   });
          // });

          this.table.data = data;
          this.loading = false;
          console.log(data);
        })
        .catch((error) => {
          this.loading = false;
        });
    },

    //打开icon选取
    openicons() {
      this.icon.show = true;
    },
    Reset() {
      this.setType = "新增";
      this.form.params = {
        icon: "",
        pid: 0,
        mtype: 0,
        status: 0,
        name: "",
        type: 0,
        url: "",
        icon: "",
        menu_id: 0,
        api: "",
        sort: 0,
      };
      this.form.show = true;
      this.$refs[this.form.ref].resetFields();
    },
    //更新菜单信息
    addmenus() {
      this.$refs[this.form.ref].validate((valid) => {
        if (valid) {
          if (this.setType == "新增") {
            let data = this.form.params;
            addmenu(this.form.params)
              .then((res) => {
                this.form.show = false;
                this.getList();
              })
              .catch((error) => {});
          } else {
            console.log("修改菜单");
            updatemenu(this.form.params).then((res) => {
              this.form.show = false;
              this.getList();
            });
          }
        }
      });
    },
    // 确定图标选择
    selecticon(item) {
      this.form.params.icon = item;
      this.icon.show = false;
    },
    handleUpdate(index, row) {
      console.log(row);
      this.setType = "修改";
      this.form.params = row;
      this.form.params.type = 1;
      this.form.mtype = 0;
      this.form.show = true;
      // this.$refs[this.form.ref].resetFields(); 编辑不需要清空表单
    },
    handleDelete(index, row) {
      let _this = this;
      this.$confirm("是否确认删除此菜单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = { menu_id: row.menu_id };
          deletemenu(data)
            .then((res) => {
              _this.getList();
            })
            .catch((error) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style lang="less">
@import "../../css/public_table.less";

.account-select {
  pointer-events: none;
  cursor: pointer;
}

.account-select-modal {
  .ivu-modal-body {
    padding: 0 !important;
  }
}

.hidden-table {
  display: none !important;
}

.menuManage-menuicons {
  width: 660px;
  height: 400px;
  overflow-y: scroll;

  span {
    float: left;
    width: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 28px;
    cursor: pointer;
    border-radius: 5px;
  }

  span.cur {
    background: green;
    color: #fff;
  }

  span:hover {
    background: #eee;
    color: #495060;
  }
}
</style>
