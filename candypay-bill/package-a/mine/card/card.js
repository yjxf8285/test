/*
 * @Author: chengruiyang
 * @Date: 2018-08-31 16:56:31
 * @LastEditors: Richard
 * @LastEditTime: 2018-11-23 13:39:39
 * @Description: 
 */

const util = require('../../../utils/util.js') //只能是相对路径
const app = getApp()
Page({
	data: {
		carInfoData: [],
		cardCount: 0,
		currentCard: null,
	},
	onShow: function (opt) {
		//加载卡列表
		this.loadCardList()
	},
	loadCardList() {
		let that = this
		app.api.getCard({
			success(res) {
				res.payload.forEach(cardInfo => {
					cardInfo.bankName = util.subBankName(cardInfo.bankName)
					if (cardInfo.vendorName == null || cardInfo.vendorName == '') {
						cardInfo.vendorName = '无'
					}
					cardInfo.cardDisplayNo = util.subCardNumber(cardInfo.cardNo)
				});
				res.payload.forEach(m => {
					m.fullBankName = m.bankName
				})
				that.setData({
					carInfoData: res.payload,
					cardCount: res.payload.length
				})
			}
		})
	},
	selectItem(e) {
		let that = this
		let item = e.currentTarget.dataset.item
		let carInfoData = this.data.carInfoData
		carInfoData.forEach(m => {
			if (m.cardNo == item.cardNo) {
				if (m.cur) {
					m.cur = false
					that.setData({
						currentCard: null
					})
				}
				else {
					m.cur = true
					that.setData({
						currentCard: m
					})
				}
			} else {
				m.cur = false
			}
		});
		this.setData({
			carInfoData
		})
		this.triggerEvent('onselect', item)
	}
	,
	delCard(e) {
		let that = this
		if (this.data.currentCard != null) {
			let cardNo = Number(this.data.currentCard.cardNo)
			let delMsg = '已绑定商户:' + this.data.currentCard.vendorName + (this.data.currentCard.vendorName == '无' ? ' ' : ',删除此卡会解除绑定关系,') + '确定删除吗？'
			wx.showModal({
				content: delMsg,
				confirmColor: '#F23831',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定')
						app.api.delCard({
							params: {
								cardNo: cardNo,
							},
							success(res) {
								console.log('删除结果-->' + res)
								if (res.payload == 'success') {
									that.setData({
										carInfoData: [],
										currentCard: null
									})
									that.loadCardList()
								}
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})

		}
	},
	gotoAddCard() {
		let entryMode = 'addCard'
		wx.navigateTo({
			url: '/package-a/add-card/add-card?entryMode=' + entryMode + '&cardList=' + JSON.stringify(this.data.carInfoData)
		})
	},
	editCard(e) {
		let cardModel = JSON.stringify(e.currentTarget.dataset.item);
		console.log(cardModel)
		let entryMode = 'editCard'
		wx.navigateTo({
			url: '/package-a/add-card/add-card?entryMode=' + entryMode + '&card=' + cardModel
		})
	}

});