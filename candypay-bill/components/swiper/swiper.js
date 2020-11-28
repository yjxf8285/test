/*
 * @Author: Liuxiaofan 
 * @Date: 2018-08-29 10:00:43 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-08-29 15:02:35
 */
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {

    },
    data: {
        maxWidth: 100,
        rightWidth: 0,
        startX: 0
    },
    methods: {

        touchS(e) {
            this.triggerEvent('customevent', {})
            if (e.touches.length == 1) {  // 必须是单指操作
                this.setData({
                    startX: e.touches[0].clientX
                });

            }
        },
        touchM: function (e) {
            let that = this
            let maxWidth = this.data.maxWidth;
            let rightWidth = that.data.rightWidth;
            let moveX = e.touches[0].clientX;
            let disX = that.data.startX - moveX;
            if (e.touches.length == 1) {// 必须是单指操作
                if (rightWidth <= 0) {
                    if (disX >= 0) {
                        rightWidth = disX
                    } else {
                        rightWidth = 0
                    }
                } else {
                    if (disX >= 0) {
                        if (rightWidth >= maxWidth) {
                            rightWidth = maxWidth
                        } else {
                            rightWidth = disX
                        }
                    } else {
                        if (rightWidth >= 0) {
                            rightWidth = maxWidth + disX
                        } else {
                            rightWidth = 0
                        }
                    }
                }
                this.setData({
                    rightWidth: rightWidth
                })
            }
        },
        touchE: function (e) {
            let that = this
            let maxWidth = this.data.maxWidth;
            if (e.changedTouches.length == 1) {
                let endX = e.changedTouches[0].clientX;
                let disX = that.data.startX - endX;
                let rightWidth = that.data.rightWidth;
                let timer;
                if (rightWidth >= (maxWidth / 2)) {
                    timer = setInterval(() => {
                        if (rightWidth <= (maxWidth - 1)) {
                            rightWidth = rightWidth + 1
                            this.setData({
                                rightWidth: rightWidth
                            })
                        } else {
                            clearInterval(timer)
                        }
                    }, 1)
                } else {
                    timer = setInterval(() => {
                        if (rightWidth >= 0) {
                            rightWidth = rightWidth - 1
                            this.setData({
                                rightWidth: rightWidth
                            })
                        } else {
                            clearInterval(timer)
                        }
                    }, 1)
                }
            }
        }
    }
})