<template>
    <el-card class="box-card">
        <!-- 查询条件 -->
        <div class="seach-form">
            <el-form :inline="true" style="float: left;">

                <el-form-item label="账号">
                    <el-input v-model="table.params.account" placeholder="请输入账号" clearable style="margin-right: 10px"
                        size="small"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-date-picker size="small" v-model="select.dataTime" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="getList(1)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮区域 -->


        <!-- 表格 -->
        <div class="table-box" ref="tableBox">
            <!-- 注意关键点：el-table 要设置 height="0" -->
            <el-table v-loading="loading" ref="multipleTable" :data="table.data" border v-if="tableHeight"
                :height="tableHeight" fit highlight-current-row
                :header-cell-style="{ background: 'rgb(15,193,175,.7)', color: '#191a23' }" style="width: 100%;height:50px">
                <!-- 空数据状态的插槽 -->
                <template slot="empty">
                    <el-empty :image-size="100" description='暂无数据'></el-empty>
                </template>
                <el-table-column prop="id" label="操作ID" align="center"></el-table-column>

                <el-table-column prop="account" label="账号" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP" align="center"></el-table-column>
                <el-table-column prop="create_time" width="180" label="创建时间" align="center"
                    :formatter="handleTime"></el-table-column>
            </el-table>

            <Page class="page" v-show="table.data.length" show-sizer show-total :total="table.total"
                :current="table.params.page" :page-size-opts="table.pageSizes" :page-size="table.params.limit"
                @on-page-size-change="limitchange" @on-change="pagechange"></Page>
        </div>
    </el-card>
</template>
<script >

import { loginloglist } from "@/api/user";
export default {
    name: "sysLog",
    data() {
        return {
            loading: false,
            select: {
                dataTime: null,
            },
            table: {
                params: {
                    page: 1,
                    limit: 10,
                    account: '',
                    ip: "",
                    id: "",
                    operation_type: "",
                    role_id: 0
                },
                data: [],
               
            },
            total: 0,
            pageSizes: [10, 20, 40, 60],
            data: [],
        }
    },
    created() {
        window.addEventListener('resize', this.getTableHeight);
        this.getList();
    },
    computed: {
        tableHeight() {
            if (this.showAll) {
                return window.innerHeight - 300
            } else {
                return window.innerHeight - 300
            }
        }
    },
    methods: {

        getList(page) {
            this.loading = true;
            if (page) {
                this.table.params.page = 1;
            }
            let params = {
                ...this.table.params,
                begin_time: this.select.dataTime == null ? 0 : this.$moment(this.select.dataTime[0]).unix(),
                end_time: this.select.dataTime == null ? 0 : this.$moment(this.select.dataTime[1]).unix()
            }
            loginloglist(params)
                .then((res) => {
                    this.table.data = res.data.list || [];
                    this.table.total = res.data.total
                    this.loading = false;
                })
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
        handleTime(row, column, cellValue, index) {
            let time = row[column.property];
            let times = time * 1000
                ? this.$moment(parseInt(time * 1000)).format(
                    "YYYY-MM-DD HH:mm:ss"
                )
                : 0;
            return times;
        },

    }

}

</script>
<style lang='less'>
@import "../../css/public_table.less";
</style>