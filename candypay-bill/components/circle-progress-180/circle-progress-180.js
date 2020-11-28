/* 总负债比例半弧形进度条组件
 * @Author: Liuxiaofan 
 * @Date: 2018-09-20 13:51:24 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-09-20 17:24:35
 */
Component({
    properties: {
        width: { // 图形的宽度
            type: Number,
            value: 100
        },
        border: { // 弧线的宽度
            type: Number,
            value: 12
        },
        progress: { // 进度0-180
            type: Number,
            value: 10
        },
        barColor: { // 进度条颜色
            type: String,
            value: '#4cb90c'
        }
    },
    data: {
        height: 50,
        maskWidth: 90,
    },
    ready() {
        this.setData({
            height: this.data.width / 2,
            maskWidth: this.data.width - this.data.border
        })
    }
})
