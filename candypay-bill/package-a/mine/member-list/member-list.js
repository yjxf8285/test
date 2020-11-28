/*
 * @Author: chengruiyang
 * @Date: 2018-08-31 16:56:31
 * @LastEditors: Richard
 * @LastEditTime: 2018-12-19 17:06:13
 * @Description: 
 */

const util = require('../../../utils/util.js') //只能是相对路径
const app = getApp()
Page({
	data: {
		merchantList: [],
		merchantCount: 0,
		currentMerchant: null
	},
	onShow() {
		this.loadMerchantList()
	},
	loadMerchantList() {
		let that = this
		app.api.getMemberList({
			success(res) {
				res.payload.forEach(item => {
					item.idCardName = util.hideIdCard(item.idCard || '')
				})
				that.setData({
					merchantList: res.payload,
					merchantCount: res.payload.length
				})
			}
		})
	},
	selectItem(e) {
		let that = this
		let item = e.currentTarget.dataset.item
		let merchantList = this.data.merchantList
		merchantList.forEach(m => {
			if (m.idCard == item.idCard) {
				if (m.cur) {
					m.cur = false
					that.setData({
						currentMerchant: null
					})
				}
				else {
					m.cur = true
					that.setData({
						currentMerchant: m
					})
				}
			} else {
				m.cur = false
			}
		});
		this.setData({
			merchantList
		})
		this.triggerEvent('onselect', item)
	},
	delMerchant(e) {
		let that = this
		let currentItem = this.data.currentMerchant || {}
		if (currentItem) {
			wx.showModal({
				content: '确定要删除此用户吗？',
				confirmColor: '#F23831',
				success: function (res) {
					if (res.confirm) {
						app.api.delMember({
							params: {
								idCard: currentItem.idCard,
							},
							success(res) {
								that.loadMerchantList()
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		}
	},
	goToDetail(e) {
		let merchant = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item));
		wx.navigateTo({
			url: '/package-a/mine/member-list/member-detail/member-detail?merchant=' + merchant
		})
	}
});