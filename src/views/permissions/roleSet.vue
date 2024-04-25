<template>
  <el-card class="box-card">
    <!-- 查询条件 -->
    <div class="seach-form">
      <el-form :inline="true" style="float: right">
        <el-form-item label="">
          <el-input
            v-model="table.params.name"
            placeholder="请输入角色名称"
            style="margin-right: 10px"
            size="small"
          ></el-input>
        </el-form-item>
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
      <el-button type="primary" size="small" @click="Reset">新增角色</el-button>
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
          prop="role_id"
          min-width="180"
          label="角色ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          min-width="180"
          label="角色名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="desc"
          min-width="180"
          label="描述"
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

      <Page
        class="page"
        v-show="table.data.length"
        show-sizer
        show-total
        :total="table.total"
        :current="table.params.page"
        :page-size-opts="table.pageSizes"
        :page-size="table.params.limit"
        @on-page-size-change="limitchange"
        @on-change="pagechange"
      ></Page>

      <!--添加角色-->
      <Modal v-model="table.form.show" @on-cancel="closeReset">
        <p slot="header">
          <span>{{ table.form.params.role_id ? "编辑" : "添加" }}角色</span>
        </p>
        <Form
          :model="table.form.params"
          :ref="table.form.ref"
          style="margin-top: 32px"
          :rules="table.form.rule"
          :label-width="160"
        >
          <Row>
            <Col span="20">
              <FormItem label="角色名:">
                <Input
                  type="text"
                  placeholder="请填写角色名称"
                  v-model="table.form.params.name"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="角色备注:">
                <Input
                  type="text"
                  placeholder="请填写角色备注"
                  v-model="table.form.params.desc"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="20">
              <FormItem label="权限选择:">
                <Button type="primary" @click="treeshow()">菜单权限选择</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button type="success" @click="updatedSaveRole"
            >&nbsp;提&nbsp;交&nbsp;</Button
          >
        </div>
      </Modal>
      <Modal v-model="Tree.show">
        <p slot="header">
          <span>菜单权限选择</span>
        </p>
        <Tree ref="tree" :data="Tree.data" show-checkbox></Tree>
        <div slot="footer">
          <Button type="success" @click="Tree.show = false"
            >&nbsp;暂&nbsp;存&nbsp;</Button
          >
        </div>
      </Modal>
    </div>
  </el-card>
</template>
<script>
import { getRolelist, AllMenu, updaterole } from "@/api/user";
// import { getRolelist, AllMenu, SaveRole, GetRoleInfo, DelRole, GetUserMenu, GetRoleTypeList } from "@/api/admin/permission";
export default {
  name: "roleSet",
  data() {
    return {
      loading: false,
      table: {
        params: {
          name: "",
          page: 1,
          limit: 10,
        },
        data: [],
        form: {
          show: false,
          ref: "setRole",
          params: {
            role_id: 0,
            menu: [],
            name: "",
            desc: "",
            type: 0, //0 新增 1编辑 2删除
          },

          rule: {
            name: [
              { required: true, message: "请填写角色名称", trigger: "blur" },
            ],
          },
        },
        total: 0,
        pageSizes: [10, 20, 40, 60],
      },
      Tree: {
        show: false,
        name: "",
        btn_name: "",
        data: [],
        tree_data: [],
        menu: [],
      },
    };
  },
  methods: {
    //treeshow
    treeshow() {
      this.Tree.show = true;
      if (this.table.form.params.type) {
        let menu_ids = this.table.form.params.menu;
        let data = JSON.parse(JSON.stringify(this.Tree.tree_data));
        data[0].children.map((item) => {
          if (menu_ids.includes(item.menu_id)) {
            item.checked = true;
            item.expand = true;
          } else {
            item.checked = false;
          }
          item["children"].map((item1) => {
            if (menu_ids.includes(item1.menu_id)) {
              item1.checked = true;
              item1.expand = true;
            } else {
              item.checked = false;
            }
            item1["children"].map((item2) => {
              if (menu_ids.includes(item2.menu_id)) {
                item2.checked = true;
                item2.expand = true;
              } else {
                item.checked = false;
              }
            });
          });
        });
        console;
        this.Tree.data = JSON.parse(JSON.stringify(data));
      }
    },
    //获取所有菜单列表
    allMenu() {
      AllMenu({})
        .then((res) => {
          let dataList = res.data || [];
          let data = dataList;

          data.map((item) => {
            item.title = item.name;
            item.children = item.children || [];
            item.children.sort((v1, v2) => {
              return v1.sorts - v2.sorts;
            });
            item.children.map((item2) => {
              item2.title = item2.name;
              item2.children = item2.children || [];
              item.expand = true;
              item2.children.map((item3) => {
                item3.expand = true;
                item3.children = item3.children || [];
              });
            });
          });
          data = JSON.parse(JSON.stringify(dataList || []));
          let tree_data = JSON.parse(JSON.stringify(dataList || []));
          tree_data[0].children.map((item) => {
            item.expand = true;
            item.children = item.children.filter((v) => v);
          });

          this.Tree.data = [
            {
              title: "后台系统admin",
              expand: true,
              children: JSON.parse(JSON.stringify(tree_data)),
            },
          ];
          this.Tree.tree_data = [
            {
              title: "后台系统admin",
              expand: true,
              children: JSON.parse(JSON.stringify(tree_data)),
            },
          ];
        })
        .catch((error) => {});
    },
    //获取列表数据
    getList(page) {
      if (page) {
        this.table.params.page = 1;
      }
      console.log(this.table.params, 111);
      getRolelist(this.table.params)
        .then((res) => {
          this.table.data = res.data.list || [];
          this.table.total = res.data.total;
        })
        .catch((error) => {});
    },
    //查询分页
    pagechange(page) {
      this.table.params.page = page;
      this.getList();
    },
    //查询分条
    limitchange(limit) {
      this.table.params.page = 1;
      this.table.params.limit = limit;
      this.getList();
    },
    //新增角色
    Reset() {
      this.$refs[this.table.form.ref].resetFields();
      this.table.form.params = {
        role_id: 1,
        menu: [],
        name: "",
        desc: "",
        type: 0, //0 新增 1编辑 2删除
      };
      this.table.form.show = true;
    },
    closeReset() {
      this.$refs[this.table.form.ref].resetFields();
      this.table.form.show = false;
    },
    //提交角色配置
    updatedSaveRole() {
      let data = this.$refs["tree"].getCheckedNodes() || [];
      // 获取所有子id和父id
      let idArr = data
        .map((data) => data.menu_id)
        .concat(data.map((data) => data.pid));
      // 数组去重
      idArr = Array.from(new Set(idArr));
      let deleteArr = [0];
      // 数组差集
      this.table.form.params.menu = [...idArr].filter((x) =>
        [...deleteArr].every((y) => y !== x)
      );
      this.$refs[this.table.form.ref].validate((valid) => {
        if (valid) {
          this.saveRole();
        }
      });
    },

    saveRole() {
      updaterole(this.table.form.params).then((res) => {
        if (this.table.form.params == 2) {
          this.$Notice.success({
            title: "删除过角色成功",
            duration: 1,
          });
        } else {
          this.closeReset();
        }

        this.getList();
      });
    },
    handleTime(row, column, cellValue, index) {
      let time = row[column.property];
      let times =
        time * 1000
          ? this.$moment(parseInt(time * 1000)).format("YYYY-MM-DD HH:mm:ss")
          : 0;
      return times;
    },
    handleUpdate(index, row) {
      this.table.form.params = {
        role_id: row.role_id,
        menu: row.menu,
        name: row.name,
        desc: row.desc,
        type: 1, //0 新增 1编辑 2删除
      };
      this.table.form.show = true;
    },
    handleDelete(index, row) {
      let _this = this;
      this.table.form.params = {
        role_id: row.role_id,
        menu: row.menu,
        name: row.name,
        desc: row.desc,
        type: 2, //0 新增 1编辑 2删除
      };
      this.$confirm("角色下有管理员 会删除失败?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          _this.saveRole();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },

  created() {
    window.addEventListener("resize", this.getTableHeight);
    this.getList();
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
    this.allMenu();
  },
};
</script>
<style lang="less" scoped>
@import "../../css/public_table.less";

.r-btn {
  margin-top: 20px;
}
</style>
