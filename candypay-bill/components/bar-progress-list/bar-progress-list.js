/* 分类统计横向柱状图
 * @Author: Liuxiaofan 
 * @Date: 2018-09-20 13:51:24 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-09-20 17:24:35
 */
Component({
    properties: {
        type: { // 0 分类统计 1 银行额度负债
            type: Number,
            value: 0
        },
        listData: {
            type: Array,
            value: []
        }
    }
})
