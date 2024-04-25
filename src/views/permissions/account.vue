<template>
  <el-card class="box-card">
    <!-- 查询条件 -->
    <div class="seach-form">
      <el-form :inline="true" style="float: right">
        <el-form-item label="">
          <el-input
            v-model="table.params.account"
            placeholder="请输入用户ID或用户名"
            style="margin-right: 10px"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select
            v-model="table.params.status_"
            placeholder="请选择状态"
            size="small"
            clearable
          >
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getList"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮区域 -->
    <div style="float: left">
      <!-- <el-button type="primary" size="small" @click="openModal"
        >添加用户</el-button
      > -->
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
          fixed
        ></el-table-column>
        <el-table-column
          prop="account"
          label="用户名"
          align="center"
          min-width="130"
          fixed
        ></el-table-column>
        <el-table-column
          prop="nick_name"
          label="昵称"
          min-width="130"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="role_id"
          label="权限ID"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="权限角色"
          align="center"
          :formatter="handleRoleName"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color: blue">启用</span>
            <span v-else style="color: red">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          align="center"
          min-width="160"
          :formatter="handleTime"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
          min-width="160"
          :formatter="handleTime"
        ></el-table-column>
        <el-table-column fixed="right" width="210" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :type="scope.row.status == 0 ? 'success' : 'danger'"
              @click="handleAction(scope.$index, scope.row)"
              >{{ scope.row.status == 0 ? "启用" : "禁用" }}</el-button
            >
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

      <!--添加修改-->
      <Modal v-model="modal.show" width="800" @on-cancel="closeModal()">
        <p slot="header" style="color: #1c2438; text-align: center">
          <span>{{ modal.form.type ? "新增" : "修改" }}账户</span>
        </p>
        <div style="padding: 10px">
          <Form
            :ref="modal.form.ref"
            :model="modal.form.params"
            :rules="modal.form.rules"
            :label-width="140"
          >
            <Row>
              <Col span="18">
                <FormItem label="用户权限" prop="role_id">
                  <Select
                    v-model="modal.form.params.role_id"
                    placeholder="用户权限ID"
                    transfer
                  >
                    <Option
                      v-for="item in select.roleList"
                      :value="item.role_id"
                      :key="item.role_id"
                      >{{ item.name }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="18">
                <FormItem label="用户账号">
                  <Input
                    :disabled="modal.form.params.type == 1"
                    v-model="modal.form.params.account"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="18">
                <FormItem label="修改密码" v-if="modal.form.params.type">
                  <RadioGroup
                    v-model="modal.form.params.edit_pwd"
                    @change="changeForm"
                  >
                    <Radio :label="0">否</Radio>
                    <Radio :label="1">是</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="18" v-if="modal.form.params.edit_pwd">
                <FormItem label="用户密码" prop="pwd">
                  <Input
                    type="password"
                    autocomplete="new-password"
                    password
                    v-model="modal.form.params.pwd"
                    placeholder="请输入用户密码"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="18" v-if="modal.form.params.edit_pwd">
                <FormItem label="确认密码" prop="pwd2">
                  <Input
                    type="password"
                    autocomplete="new-password"
                    password
                    v-model="modal.form.params.pwd2"
                    placeholder="请再次输入密码"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="18">
                <FormItem label="账户昵称">
                  <Input
                    v-model="modal.form.params.nick_name"
                    placeholder="请输入使用人昵称"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="18">
                <FormItem label="绑定邮箱">
                  <Input
                    v-model="modal.form.params.email"
                    placeholder="请输入绑定邮箱"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="18">
                <FormItem label="绑定手机号">
                  <Input
                    v-model="modal.form.params.phone"
                    placeholder="请输入绑定手机号"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="warning" @click="closeModal()">取消</Button>
          <Button type="success" @click="updata()">提交</Button>
        </div>
      </Modal>
    </div>
  </el-card>
</template>
<script>
import {
  adminuserlist,
  getRolelist,
  updateadminuser,
  deleteUser,
  disableUser,
} from "@/api/user";
import md5 from "js-md5";
export default {
  name: "account",
  data() {
    return {
      loading: false,
      select: {
        rolelist: [],
      },
      table: {
        params: {
          account: "",
          page: 1,
          limit: 10,
          status_: "",
          status: -1,
        },
        data: [],
      },
      total: 0,
      pageSizes: [10, 20, 40, 60],
      modal: {
        form: {
          ref: "modal_form",
          params: {
            type: 0, //0 添加 1 修改 2删除
            role_id: 0, //用户权限（角色ID）
            account: "", //用户账户
            edit_pwd: 0,
            pwd: "",
            pwd2: "",
            nick_name: "",
            email: "", //邮箱
            phone: "", //手机号
          },
          rules: {
            role_id: [
              {
                required: true,
                message: "请选择用户权限",
                trigger: "change",
                validator: (rule, value, callback) => {
                  console.log(value);
                  if (value == null) {
                    callback(" 请选择用户权限");
                  } else {
                    callback();
                  }
                },
              },
            ],
            name: [
              {
                required: true,
                trigger: "blur",
                message: "请输入对应账户名称",
              },
            ],
            pwd: [
              {
                required: true,
                trigger: "blur",
                min: 6,
                max: 18,
                validator: (rule, value, callback) => {
                  let reg = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9_]{5,17}$/);
                  if (!this.modal.form.type) {
                    if (!value || value === "******") {
                      callback();
                    } else {
                      if (!reg.test(value) || !value) {
                        callback("请输入6~18位英文字母，数字，或数字字母组合");
                      } else {
                        callback();
                      }
                    }
                  } else {
                    if (!reg.test(value) || !value) {
                      callback("请输入6~18位英文字母，数字，或数字字母组合");
                    } else {
                      callback();
                    }
                  }
                },
              },
            ],
            pwd2: [
              {
                required: true,
                trigger: "blur",
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback("请输入确认密码");
                  } else if (this.modal.form.params["pwd"] != value) {
                    callback("请输入相同密码");
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
        },
      },
      data: [],
    };
  },
  created() {
    window.addEventListener("resize", this.getTableHeight);
    this.getRoleList();
  },
  computed: {
    tableHeight() {
      if (this.showAll) {
        return window.innerHeight - 300;
      } else {
        return window.innerHeight - 300;
      }
    },
  },
  methods: {
    closeModal() {
      this.modal.show = false;
      this.$refs[this.modal.form.ref].resetFields();
    },
    //获取权限列表
    getRoleList() {
      getRolelist({
        name: "",
        page: 1,
        limit: 100,
      }).then((res) => {
        this.select.roleList = res.data.list || [];
        this.getList();
      });
    },
    getList(page) {
      if (page) {
        this.table.params.page = 1;
      }
      if (!this.table.params.status_) {
        this.table.params.status = -1;
      } else {
        this.table.params.status = Number(this.table.params.status_);
      }
      adminuserlist(this.table.params)
        .then((res) => {
          this.table.data = res.data.list || [];
          this.table.total = res.data.total;
        })
        .catch((error) => {});
    },
    //查询分条
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
    changeForm(val) {
      console.log(this.modal.form.params.edit_pwd);
      console.log("val: ", val);
    },
    openModal() {
      this.modal.form.params = {
        type: 0, //0 添加 1 修改 2删除
        role_id: 0, //用户权限（角色ID）
        account: "", //用户账户
        edit_pwd: 0,
        pwd: "",
        nick_name: "",
        email: "", //邮箱
        phone: "", //手机号
        review: false,
      };
      this.$refs[this.modal.form.ref].resetFields();
      this.modal.show = true;
    },
    //更新表单提交
    updata() {
      this.$refs[this.modal.form.ref].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.saveManager();
        }
      });
    },
    //更新信息
    saveManager() {
      if (this.modal.form.params.type == 0) {
        this.modal.form.params["pwd"] = md5(this.modal.form.params["pwd"]);
      } else if (this.modal.form.params.type == 1) {
        if (this.modal.form.params.edit_pwd == 0) {
          this.modal.form.params["pwd"] = "";
        } else {
          this.modal.form.params["pwd"] = md5(this.modal.form.params["pwd"]);
        }
      }
      let params = { ...this.modal.form.params };
      updateadminuser(params).then((res) => {
        this.$Message.success("配置成功");
        this.getList();
        this.closeModal();
      });
    },
    handleRoleName(row, column, cellValue, index) {
      let result = this.select.roleList.find(
        (item) => item["role_id"] == row.role_id
      );
      return result ? result.name : "";
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
      console.log("row: ", row);
      this.$refs[this.modal.form.ref].resetFields();
      this.modal.form.params.account = row.account;
      this.modal.form.params.email = row.email;
      this.modal.form.params.gender = row.gender;
      this.modal.form.params.nick_name = row.nick_name;
      this.modal.form.params.phone = row.phone;
      this.modal.form.params.role_id = row.role_id;
      this.modal.form.params.pwd = "";
      this.modal.form.params.edit_pwd = 0;
      this.modal.form.params.type = 1;
      this.modal.show = true;
    },
    handleDelete(index, row) {
      this.modal.form.params = { ...row };
      this.modal.form.params.type = 2;
      this.$confirm("是否确认删除此后台用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser({ account: row.account })
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success("删除成功");
              }
            })
            .finally(() => {
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleAction(index, row) {
      this.$confirm(
        `是否确认${row.status == 0 ? "启用" : "禁用"}该用户?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          disableUser({ account: row.account, status: row.status == 0 ? 1 : 0 })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success("操作成功");
              }
            })
            .finally(() => {
              this.getList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    handleTime(row, column, cellValue, index) {
      let times =
        cellValue * 1000
          ? this.$moment(parseInt(cellValue * 1000)).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          : "";
      return times;
    },
    handleVip(row, column, cellValue, index) {
      return cellValue ? "vip" : "普通";
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
</style>
