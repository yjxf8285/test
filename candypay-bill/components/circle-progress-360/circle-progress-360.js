/* 总负债比例环形形进度条组件
 * 原理：先定义左右2个半圆，旋转左边半圆，露出底色。
 * 当角度大于180度的时候，把右半圆颜色设置为底色，同时把左边半圆的遮罩层也设置层底色
 * @Author: Liuxiaofan 
 * @Date: 2018-09-20 13:51:24 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-09-20 17:24:35
 */
Component({
    properties: {
        width: { // 图形的宽度
            type: Number,
            value: 160
        },
        border: { // 弧线的宽度
            type: Number,
            value: 20
        },
        progress: { // 进度0-360
            type: Number,
            value: 0
        },
        size: {
            type: String,
            value: 'm'
        },
        percent: { // 百分比 0-100
            type: String,
            value: '0.00'
        },
        barColor: { // 进度条颜色
            type: String,
            value: '#EB464E'
        }
    },
    data: {
        rSemicircleBg: '#ccc', // 右半圆背景色
        lMaskBg: '', // 左半圆遮罩色
        maskWidth: 140,
    },
    // pageLifetimes: {
    //     show() {
    //         this.init()
    //     }
    // },
    ready() {
        this.init()
    },
    methods: {
        init() { 
            this.setData({
                maskWidth: this.data.width - this.data.border
            })
        }
    }
})
