<template>
    <div>
        <el-col :span="1.5" class="elrow">
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="$emit('query')">查询</el-button>
            </el-form-item>
        </el-col>
        <el-col :span="1.5" class="elrow">
            <el-form-item>
                <el-button type="primary" icon="el-icon-refresh" size="mini">重置</el-button>
            </el-form-item>
        </el-col>
        <el-col :span="1.5" class="elrow">
            <el-form-item>
                <el-button type="text" size="mini" @click="closeSearch">
                    {{ word }}
                    <i :class="showAll ? 'el-icon-arrow-up ' : 'el-icon-arrow-down'"></i>
                </el-button>
            </el-form-item>
        </el-col>
    </div>
</template>

<script>
export default {
    props: {
        showAll: {
            type: Boolean,
            defalut: true
        },
    },
    computed: {
        word: function () {
            if (this.showAll == false) {
                //对文字进行处理
                return "收起";
            } else {
                return "展开";
            }
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.closeSearch();
        });
    },
    methods: {
        closeSearch() {
            this.$emit('closepop');
            console.log('子组件的状态：' + this.showAll)
        }
    }
}
</script>

<style></style>