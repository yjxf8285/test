/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-02-27 18:06:21
 * @LastEditTime: 2019-03-05 13:57:18
 */

// package-a/help/help.js
Page({
	data: {

	},
	onLoad: function (opt) {
	},
	onReady: function () {
		this.transactionDetail = this.selectComponent("#transaction-detail")
	},
	onShow: function () {

	},
	onReachBottom() {
		if (!this.loading) {
			this.transactionDetail.onscrollbottom()
		}
	},
})