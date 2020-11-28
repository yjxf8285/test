Page({

    /**
     * Page initial data
     */
    data: {

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad: function (options) {

    },
    previewImg() {
        wx.previewImage({
            current: '/image/help/03.png', // 当前显示图片的http链接
            urls: ['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558435479782&di=8506fb9fd08aa0ee1f1a6a8f7af02f53&imgtype=0&src=http%3A%2F%2Fhtml51.com%2Fdata%2Fattachment%2Fportal%2F201901%2F21%2F153531dacaxaosyluxqu8y.jpeg'] // 需要预览的图片http链接列表
        })
    }

})