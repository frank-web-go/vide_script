<template>
  <div class="monitor-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="system">
          <div class="system-first">
            <el-button style="margin-left: 15px" type="success" size="mini"
              >Running</el-button
            >
            <span class="title">阿里云</span>
          </div>
          <div class="system-item">
            <span>系统</span>
            <span>{{ list.host_info && list.host_info.os }}</span>
          </div>
          <div class="system-item">
            <span>时间</span>
            <span>{{ handleTime(new Date().getTime() / 1000) }}</span>
          </div>
          <div class="system-item">
            <span>内存</span>
            <span
              >{{ list.memory_info && list.memory_info.used_size }}GB/{{
                list.memory_info && list.memory_info.total_size
              }}GB
            </span>
          </div>
          <div class="system-item">
            <span>在线</span>
            <span>{{
              list.host_info && list.host_info.boot_time | handleBootTime
            }}</span>
          </div>
          <div class="system-item">
            <span>交换</span>
            <span>0</span>
          </div>
          <div class="system-item">
            <span>硬盘</span>
            <span
              >{{ list.disk_info && parseInt(list.disk_info.used_size) }}GB/{{
                list.disk_info && parseInt(list.disk_info.total_size)
              }}GB</span
            >
          </div>
          <div class="system-item">
            <span>下载 <i class="el-icon-caret-bottom"></i></span>
            <span>{{ list.net_info && list.net_info.receive_bytes }}KB</span>
          </div>
          <div class="system-item">
            <span>上传<i class="el-icon-caret-top"></i></span>
            <span>{{ list.net_info && list.net_info.send_bytes }}KB</span>
          </div>
          <div class="progress-container" v-if="list.cpu_info">
            <span style="margin-top: 15px">CPU</span>
            <el-progress
              v-if="list.cpu_info.use_rate >= 40 && list.cpu_info.use_rate < 70"
              style="width: 85%; margin-top: 15px"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.cpu_info.use_rate.toFixed(2))"
              text-color="#fff"
              define-back-color="#aaa"
            ></el-progress>
            <el-progress
              v-else
              style="width: 85%; margin-top: 15px"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.cpu_info.use_rate.toFixed(2))"
              define-back-color="#aaa"
              :status="handleStatus(list.cpu_info.use_rate)"
              text-color="#fff"
            ></el-progress>
          </div>
          <div class="progress-container" v-if="list.memory_info">
            <span>RAM</span>
            <el-progress
              v-if="
                list.memory_info.use_rate >= 40 &&
                list.memory_info.use_rate < 70
              "
              style="width: 85%"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.memory_info.use_rate.toFixed(2))"
              text-color="#fff"
              define-back-color="#aaa"
            ></el-progress>
            <el-progress
              v-else
              style="width: 85%"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.memory_info.use_rate.toFixed(2))"
              :status="handleStatus(list.memory_info.use_rate)"
              text-color="#fff"
              define-back-color="#aaa"
            ></el-progress>
          </div>
          <div class="progress-container" v-if="list.disk_info">
            <span>硬盘</span>
            <el-progress
              v-if="
                list.disk_info &&
                list.disk_info.use_rate >= 40 &&
                list.disk_info.use_rate < 70
              "
              style="width: 85%"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.disk_info.use_rate.toFixed(2))"
              text-color="#fff"
              define-back-color="#aaa"
            ></el-progress>
            <el-progress
              v-else
              style="width: 85%"
              :text-inside="true"
              :stroke-width="28"
              :percentage="Number(list.disk_info.use_rate.toFixed(2))"
              :status="handleStatus(list.disk_info.use_rate) || ''"
              text-color="#fff"
              define-back-color="#aaa"
            ></el-progress>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="host">
          <div>
            <span>服务器信息</span>
          </div>
          <div>
            <span>主机名称</span>
            <span>{{ list.host_info && list.host_info.name }}</span>
          </div>
          <div>
            <span>操作系统</span>
            <span>{{ list.host_info && list.host_info.os }}</span>
          </div>
          <div>
            <span>进程数量</span>
            <span>{{ list.host_info && list.host_info.process_num }}</span>
          </div>
          <div>
            <span>平台</span>
            <span>{{ list.host_info && list.host_info.plat_form }}</span>
          </div>
          <div>
            <span>内核架构</span>
            <span>{{ list.host_info && list.host_info.kernel_arch }}</span>
          </div>
          <div>
            <span>开机时间</span>
            <span>{{
              handleTime(list.host_info && list.host_info.boot_time)
            }}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-card class="box-card">
      <!-- 查询条件 -->
      <div class="seach-form" style="margin-top: -15px">
        <el-form :inline="true" style="float: right; height: 50px">
          <el-form-item label="">
            <el-input
              v-model="name"
              placeholder="请输入进程名称"
              clearable
              style="margin-right: 10px"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="table-box">
        <el-table
          :data="data"
          border
          v-if="data"
          height="330"
          fit
          highlight-current-row
          :header-cell-style="{ background: '#f9f6f6', color: '#606266' }"
          style="width: 100%; height: 50px"
        >
          <template slot="empty">
            <el-empty :image-size="100" description="暂无数据"></el-empty>
          </template>
          <el-table-column
            prop="name"
            label="进程名称"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="pid"
            label="进程ID"
            align="center"
          ></el-table-column>
          <el-table-column label="CPU使用率" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cpu_percent }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="threads_num"
            label="进程数量"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            align="center"
            :formatter="handleTime"
          ></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getSystemInfo } from "@/api/user";
let that;
export default {
  name: "serviceMonitor",
  data() {
    return {
      list: [],
      timer: null,
      that: this,
      data: [],
      name: "",
    };
  },
  computed: {
    handleStatus() {
      return (val) => {
        if (val >= 0 && val < 40) {
          return "success";
        } else if (val >= 70 && val < 80) {
          return "warning";
        } else {
          return "exception";
        }
      };
    },
  },
  filters: {
    handleBootTime(val) {
      let time = new Date().getTime() - val * 1000;
      return (
        Math.floor(that.$moment.duration(time).asHours() * 100) / 100 + "小时"
      );
    },
  },
  created() {
    that = this.that;
  },
  mounted() {
    this.getSystemList();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getSystemList() {
      this.getlist();
      this.timer = setInterval(() => {
        this.getlist();
      }, 2000);
    },
    getlist() {
      getSystemInfo().then((res) => {
        this.list = res.data;
        this.data = [];
        for (let key in res.data.process_info_list) {
          this.data.push(res.data.process_info_list[key]);
        }
        if (this.name) {
          this.data = this.data.filter((item) =>
            item.name.toUpperCase().includes(this.name.trim().toUpperCase())
          );
          console.log("this.data: ", this.data);
        } else {
          this.data = this.data.filter((item) => item);
        }
      });
    },
    handleTime(val) {
      let time = val;
      let times =
        time * 1000
          ? this.$moment(parseInt(time * 1000)).format("YYYY-MM-DD HH:mm:ss")
          : 0;
      return times;
    },
  },
};
</script>

<style lang="less">
@import "../../css/public_table.less";

.monitor-container {
  width: 100%;
  height: 400px;
  color: #303133;

  .system,
  .host {
    background: #fff;
    height: calc(100vh-400px);
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
