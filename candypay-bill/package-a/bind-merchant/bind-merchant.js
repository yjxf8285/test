const app = getApp()
import util from '../../utils/util'
Page({
    data: {
        cardNo: ''
    },
    setCardNo(e) {
        this.setData({
            cardNo: e.detail.value
        })
    }
    ,
    onClickBtn() {
        let that = this
        if (this.data.cardNo == '') {
            util.showToast('请输入该设备对应商户的结算卡号!')
            return
        }
        wx.showModal({
            title: '提示',
            content: '绑定之后老版记账设置失效，是否进行绑定？',
            showCancel: true,
            success(res) {
                if (res.confirm) {
                    app.api.bindMerchant({
                        data: {
                            encSn: app.globalData.watingToBindSn,
                            cardNo: that.data.cardNo
                        },
                        success(res) {
                            util.showToast('绑定商户成功')
                            that.setMode() // 先把模式切完再跳页面
                        }
                    })
                }
                if (res.cancel) {
                    console.log('用户点击了取消')
                }
            }
        })

    },
    setMode(){
        app.api.switchModeType({
            params: {
                modeType:'DEVICE'
            },
            success: res => {
                wx.switchTab({
                    url: "/pages/index/index"
                })
            }
        })
    },
    onUnload() {
        app.globalData.watingToBindSn = ''
    }

})