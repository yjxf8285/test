/*
 * @Author: chengruiyang
 * @Date: 2018-08-31 16:56:31
 * @LastEditors: liuxiaofan
 * @LastEditTime: 2020-04-19 13:18:06
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
	onLoad: function () {
	},

	onShow() {
		this.loadMerchantList()
	},
	loadMerchantList() {
		let that = this
		app.api.getMerchantList({
			params: {
				idCard: app.globalData.idCard || '', //如果认证过的商户就需要传身份证
				requestType:'USERCENTER'
            },

			success(res) {
				let payload=res.payload||{}
				let accountInfos = payload.accountInfos || []
				accountInfos.forEach(item => {
					item.regionName = app.getRegionName(item.merchantRegion, 1)
					item.merchantDisplayName = util.interceptStr(item.merchantName, 25)
				})
				that.setData({
					merchantList: accountInfos,
					merchantCount: accountInfos.length
				})
			}
		})
	},
	selectItem(e) {
		let that = this
		let item = e.currentTarget.dataset.item
		let merchantList = this.data.merchantList
		merchantList.forEach(m => {
			if (m.merchantId == item.merchantId) {
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
		if (this.data.currentMerchant != null) {
			let merchantId = this.data.currentMerchant.merchantId
			let delMsg = '确定解除和商户:' + this.data.currentMerchant.merchantName + '的绑定关系吗？'
			wx.showModal({
				content: delMsg,
				confirmColor: '#F23831',
				success: function (res) {
					if (res.confirm) {
						app.api.unbindMerchant({
							params: {
								merchantId: merchantId,
							},
							success(res) {
								if (res.payload == 'success') {
									that.setData({
										merchantList: [],
										currentMerchant: null
									})
									that.loadMerchantList()
								}
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})

		}
	}

	, goAccountDetail(e) {
		let merchant = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item));
		wx.navigateTo({
			url: '/package-a/mine/account/account-pos/account-pos?merchant=' + merchant
		})
	}
});