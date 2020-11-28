/*
 * @Author: Liuxiaofan 
 * @Date: 2018-09-20 13:51:24 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-09-20 17:24:35
 */
const app = getApp()
Component({
    externalClasses: ['keypad-class'],
    properties: {
        value: {
            type: String,
            value: ''
        },
        integerLength: {
            type: Number,
            value: 7
        },
        decimalLength: {
            type: Number,
            value: 2
        }
    },
    data: {
        show: false,
        placeholder: '0.00',
        keys: ['1', '2', '3', '删除', '4', '5', '6', '清空', '7', '8', '9', '', '', '0', '.', '完成']
    },
    methods: {
        show() {
            this.setData({
                show: !this.data.show
            })
            app.setBtnvisual(false) // 隐藏滑动按钮
        },
        hide() {
            this.setData({
                show: false
            })
            app.setBtnvisual(true) // 显示滑动按钮
        },
        _defRule(item, value) {
            let placeholder = '0.00'
            switch (item) {
                case '删除':
                    value = value.substring(0, value.length - 1)
                    if (!value) {
                        placeholder = '0.00'
                    } else {
                        placeholder = ''
                    }
                    this.setData({
                        placeholder,
                        value
                    })
                    break
                case '完成':
                    this.submit()
                    break
                case '清空':
                    this.setData({
                        placeholder,
                        value: ''
                    })
                    break
                case '-':
                    if (value.includes('-')) {
                        value = value.replace('-', '')
                    } else {
                        value = '-' + value
                    }
                    this.setData({
                        placeholder: '',
                        value: value
                    })
                    break
                case '.':
                    // .前面必须有数并且只能有一个
                    if (!value.includes('.')) {
                        if (value[0] == '-') {
                            if (value[1]) {
                                return true
                            }
                        } else {
                            if (value[0]) {
                                return true
                            }
                        }
                    }
                    break
                default:
                    //0后面只能. 
                    if (value[0] == '-') {
                        if (value[1] == '0' && item != '.') {
                            if (value[2] == '.') {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return true
                        }
                    } else {
                        if (value[0] == '0' && item != '.') {
                            if (value[1] == '.') {
                                return true
                            } else {
                                return false
                            }
                        } else {
                            return true
                        }
                    }


            }
        },
        lengthLimit(value) {
            let sTa = value.split('.')
            let integer = sTa[0]
            let decimal = sTa[1] || ''
            if (integer.length > this.data.integerLength) {
                return false
            }
            if (decimal.length > this.data.decimalLength) {
                return false
            }
            return true
        },
        keydown(e) {
            let item = e.target.dataset.item
            let value = this.data.value
            if (!this._defRule(item, value)) return
            let val = value + item
            if (!this.lengthLimit(val)) return
            this.setData({
                placeholder: '',
                value: val
            })
        },
        submit() {
            this.triggerEvent('submit', this.data.value);
            this.hide()
        }
    }
});
