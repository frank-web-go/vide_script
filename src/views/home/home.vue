<template>
    <el-card style="height:52rem">
        <div class="seach-form">
            <el-form :inline="true">
                <el-form-item label="广告">
                    <el-select size="small" v-model="adver_id" @change="saveAdTitle" style="width: 180px;" clearable>
                        <el-option v-for="(item, index) in adverList" :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button size="small" type="primary" icon="el-icon-search" :loading="isloading"
                        @click="getdata">查询</el-button>
                </el-form-item>
                <el-form-item label="">
                    <span style="margin: 0 100px 0 50px;font-size: 20px;font-weight: bold;">今日点击量<span
                            style="color: red;font-size: 25px;">{{ day_total }}</span>次</span>
                    <span style="margin: 0 100px 0 50px;font-size: 20px;font-weight: bold;">三十天点击量<span
                            style="color: red;font-size: 25px;">{{ month_total }}</span>次</span>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <div id="Mycharts" class="Mycharts"></div>
        </div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts';

import { getadvertisestatistics, getdataAdver, getadvertisestatisticstotal } from "@/api/advertise"
export default {
    data() {
        return {
            content: "",
            adver_id: "",
            dateList: [],
            totalList: [],
            adverList: [],
            isloading: false,
            day_total: 0,
            month_total: 0,
            myChart: null,
            adverTitle: "",
            adverTitleList: [],
        };
    },
    created() {
        // this.getdata()
        // this.getdataAdverList()

    },
    mounted() {
        //根据窗口变化图表自适应
        window.addEventListener("resize", () => {
            this.changeWidth();
        })
    },
    destroyed() {
        window.removeEventListener("resize", this.changeWidth, true);
    },
    computed: {

    },
    methods: {
        changeWidth() {
            this.myChart.resize();
        },
        getAlldata() {
            getadvertisestatisticstotal({ id: this.adver_id }).then(res => {
                this.day_total = res.data.day_total
                this.month_total = res.data.month_total
            })
        },
        saveAdTitle(val) {
            if (val) {
                this.adverTitle = this.adverList.find(v => val === v.id)["name"]
            }
        },
        async getdataAdverList() {
            let data = {
                page: 1,
                limit: 1000,
                type: -1,
                jump_type: -1,
                show: -1,
            }
            this.adverList = (await getdataAdver(data)).data.list || []
        },
        async getdata() {
            let titleList = []
            this.getAlldata() //查询的时候同时更新统计
            let res = await getadvertisestatistics({ id: this.adver_id })
            console.log('this.adver_id: ', this.adver_id);
            if (this.adver_id) {
                this.adverTitleList = [this.adverTitle]
                this.dateList = (res.data.AllAdvertiseStatistics[this.adverTitle]).map(item => item.date)
                let total = (res.data.AllAdvertiseStatistics[this.adverTitle]).map(item => item.total)
                this.totalList = { name: this.adverTitle, data: total, type: "line",areaStyle: {},smooth:true}
            } else {
                let arrays = res.data.AllAdvertiseStatistics
                console.log('arrays: ', arrays);
                let mergedArray = []
                let index = -1
                for (var item in arrays) {
                    titleList.push(item)
                    index++
                    let arrayTotal = []
                    arrays[item].forEach(v => {
                        arrayTotal.push(v.total)
                    })
                    mergedArray[index] = { name: item, areaStyle: {},smooth:true,data: arrayTotal, type: "line" };
                }

                let filterKey = Object.keys(arrays)[0]
                this.dateList = (arrays[filterKey]).map(item => item.date)
                this.adverTitleList = titleList
                this.totalList = mergedArray
            }
            this.getMycharts()
        },

        getMycharts() {
            var chartDom = document.getElementById("Mycharts");
            var myChart = echarts.init(chartDom);
            this.myChart = myChart
            myChart.showLoading();
            this.myChart.clear()
            var option = {
                title: {
                    text: '三十天点击量统计',
                    padding: [20, 0, 0, 10],
                    textStyle: {
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: this.adverList
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dateList,
                    axisLabel: {
                        rotate: 40
                    }
                },
                yAxis: {
                    type: 'value'
                },
                //柱状图内边距
                grid: {
                    left: '90px',
                    right: '40px',
                    bottom: "50px"
                },
                series: this.totalList
            };
            myChart.setOption(option)
            myChart.hideLoading();
        },
    },
};
</script>

<style scoped lang="less">
html,
body {
    height: 100%;
}

//   @import "../../css/public_table.less";
.title_card {
    display: flex;
    justify-content: space-between;

    .box-card {
        width: 24%;
        height: 150px;
    }

    .box-card1 {
        .box {
            display: flex;

            .left {
                width: 50%;
                text-align: center;
            }

            .right {
                width: 50%;
                text-align: center;
            }
        }

    }


}




// 笔记本
@media screen and (min-width: 800px) {
    .Mycharts {
        width: 100%;
        height: 30rem;
        // margin-top: 30px;
    }


}

// 台式机
@media screen and (min-width: 1900px) {
    .Mycharts {

        margin-top: 30px;
        width: 100%;
        height: 40rem;
    }


}
</style>