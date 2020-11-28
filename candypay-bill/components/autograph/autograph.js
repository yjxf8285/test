/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @Date: 2020-03-10 15:56:34
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-20 15:40:55
 */
// 采坑： 如果html标签里面写了 type="2d"，会导致真机空白
var ctx = null; //canvas实例
var touchs = [];
Component({
    properties: {

    },
    data: {
        canvasW: 140,
        canvasH: 56,
        lineColor: '#333', // 笔划的颜色
        LineWidth: 3, //笔划粗细
        count: 0 //画了几笔
    },
    ready() {
        this.autoWidth()
        this.init()
    },
    methods: {
        autoWidth() {
            const dpr = wx.getSystemInfoSync().pixelRatio // 获取设备的屏幕分辨率是2x还是3x
            let canvasW, canvasH;
            if (dpr >= 2) {
                canvasW = this.data.canvasW * 2
                canvasH = this.data.canvasH * 2
            }
            if (dpr >= 3) {
                canvasW = this.data.canvasW * 2.21
                canvasH = this.data.canvasH * 2.21
            }
            
            // 最近小高度100
            if (canvasH < 100) {
                canvasH = 100
            }
            
            if (canvasW < 280) {
                canvasW = 280
            }

            this.setData({
                canvasW,
                canvasH,
            })
        },
        init: function (options) {
            ctx = wx.createCanvasContext('autograph', this); // 如果是组件的形式，第2个参数要写this
            ctx.setStrokeStyle(this.data.lineColor);
            ctx.setLineWidth(this.data.LineWidth);
            ctx.setLineCap('round');
            ctx.setLineJoin('round');
        },
        // 画布的触摸移动开始手势响应
        start: function (event) {
            // console.log("触摸开始" + event.changedTouches[0].x);
            // console.log("触摸开始" + event.changedTouches[0].y);
            //获取触摸开始的 x,y
            let point = { x: event.changedTouches[0].x, y: event.changedTouches[0].y }
            touchs.push(point);
        },
        // 画布的触摸移动手势响应
        move: function (e) {
            let point = { x: e.touches[0].x, y: e.touches[0].y }
            touchs.push(point);
            if (touchs.length >= 2) {
                this.draw(touchs);
            }
        },
        // 画布的触摸移动结束手势响应
        end: function (e) {
            this.setData({
                count: this.data.count + 1
            })
            // console.info("触摸结束" + this.data.count);
            //清空轨迹数组
            for (let i = 0; i < touchs.length; i++) {
                touchs.pop();
            }

        },
        // 画布的长按手势响应
        longtap: function (e) {
            // console.log("长按手势" + e);
        },
        cancel() { },
        error: function (e) {
            // console.log("画布触摸错误" + e);
        },
        //绘制
        draw: function (touchs) {
            let point1 = touchs[0];
            let point2 = touchs[1];
            // console.info(point1, point2)
            touchs.shift();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
            ctx.draw(true);
        },
        //清除操作
        clearClick: function () {
            //清除画布
            ctx.clearRect(0, 0, 750, 700);
            ctx.draw(true);
            this.setData({
                count: 0
            })
        },
        //保存图片
        saveClick: function (callback) {
            if (this.data.count < 3) {
                wx.showModal({
                    title: '提示',
                    content: '签名不符合规范，请重新签名',
                    showCancel: false
                })
            } else {
                wx.canvasToTempFilePath({
                    canvasId: 'autograph',
                    fileType: 'jpg',
                    destWidth: 800,
                    destHeight: 500,
                    success: function (res) {
                        callback && callback(res.tempFilePath) //把图片路径回调出去
                    },
                    fail(res) {
                        console.info('保存失败', res)
                    }
                }, this)
            }

        }
    }
})