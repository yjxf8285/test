Component({
  /**
   * 组件的属性列表
   */
  properties: {
    canClickMask: {
      type: Boolean,
      value: false
    },
    //是否显示modal
    show: {
      type: Boolean,
      value: false
    },
    //modal的宽度
    width: {
      type: String,
      value: '90%'
    },
    //modal的高度
    height: {
      type: String,
      value: 'auto'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      if (this.data.canClickMask) this.setData({ show: false })
    },
    hide() {
      this.setData({ show: false })
    },
    cancel() {
      this.triggerEvent('cancel')
      this.hide()
    },
    confirm() {
      this.triggerEvent('confirm')
      this.hide()
    },
    myCatchTouch: function () {
      console.log('stop user scroll it!');
      return;
    }
  }
})
