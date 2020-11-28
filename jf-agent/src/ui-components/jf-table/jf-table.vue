<!--
 * @Author: wuyulong
 * @Date: 2020-04-28 15:36:09
 * @LastEditTime: 2020-05-08 16:08:37
 * @LastEditors: wuyulong
 * @Description: wyl update code!
 * @FilePath: /new-jf-agent-web/src/ui-components/jf-table/jf-table.vue
 -->
<template>
    <div class="jf-table">
        <el-table
            :data="tableData"
            style="width: 100%"
            border
            v-loading="loading"
            :header-cell-style="tableHeaderStyle"
        >
            <el-table-column label="序号" type="index" width="50" align="center">
                <template scope="scope">
                    <!-- 有分页时，序号显示 -->
                    <span
                        v-if="pageObj"
                    >{{(pageObj.currentPage - 1)*pageObj.size + scope.$index + 1}}</span>
                    <!-- 无分页时，序号显示 -->
                    <span v-else>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <template v-for="(col, index) in columns">
                <!-- 操作列/自定义列 -->
                <slot v-if="col.slot" :name="col.slot"></slot>
                <!-- 普通列 -->
                <el-table-column
                    v-else
                    :key="index"
                    :prop="col.prop"
                    :label="col.label"
                    :width="col.width"
                    :formatter="col.formatter"
                    align="center"
                ></el-table-column>
            </template>
        </el-table>
        <div class="jf-pagination">
            <el-pagination
                v-if="pageObj"
                layout="slot, prev, pager, next, jumper"
                :page-size="pageObj.size"
                :total="pageObj.total"
                :current-page="pageObj.currentPage"
                @current-change="pageObj.func"
            >
                <span style="font-size:14px; color:#666; margin-right:16px; font-weight:500;">
                    共{{Math.ceil(pageObj.total/pageObj.size)}}页/{{pageObj.total}}条数据
                </span>
            </el-pagination>
        </div>
    </div>
</template>

<style lang="scss">
@import "@/styles/common.scss";

.jf-table {
    padding: 20px 0;
    margin-top: 50px;
    .jf-pagination {
        margin: 20px auto 0;
        text-align: right;
        .el-pagination {
            .el-pagination__total,.el-pagination__jump{
                font-size: 14px !important;
                font-weight:500 !important;
            }
            
            button {
                color: #999;
                border: 1px solid #d9d9d9;
                font-size: 14px;
                box-sizing: border-box;
                border-radius: 4px;
                padding:0 4px !important;
                margin: 0 4px;
                min-width: 35.5px;
                &.btn-prev{
                    background-color: none !important;
                    // padding-right: 4px !important;
                    i{
                        font-size: 14px !important;;
                    }
                    &:disabled {
                        border: 1px solid #e5e5e5;
                        color: #d9d9d9;
                    }
                }
                &.btn-next {
                    background-color: none !important;
                    // padding-right: 4px !important;
                    i{
                        font-size: 14px !important;;
                    }
                    &:disabled {
                        border: 1px solid #e5e5e5;
                        color: #d9d9d9;
                    }
                }
            }
            .el-pager {
                .number {
                    color: #999;
                    background: none;
                    border: 1px solid #d9d9d9;
                    font-size: 14px;
                    border-radius: 4px;
                    box-sizing: border-box;
                    margin: 0 4px;
                    padding: 0 3px;
                    &.active {
                        border: none;
                        background: $blue;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>

<script>
// const JfUploadExcel = {
//     install:function(Vue){
//         Vue.com
//     }
// }

export default {
    name: "JfTable",
    data() {
        return {
            currentPage1: 0
        };
    },
    props: {
        tableData: {
            type: Array,
            default: []
        },
        columns: {
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: false
        },
        pageObj: {
            type: Object,
            default: {}
        }
    },
    methods: {
        handleSizeChange() {},
        handleCurrentChange() {},
        tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return `
            background:rgba(248,248,248,1);
            color: rgba(0,0,0,0.65);
            height: 30px!important;
            font-size: 14px;
            `;
            }
        }
    }
};
</script>