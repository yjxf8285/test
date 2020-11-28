/*
 * @Author: liuxiaofan
 * @Description: v2.0.0
 * @LastEditors: liuxiaofan
 * @Date: 2019-03-04 10:32:53
 * @LastEditTime: 2020-04-29 17:51:48
 */
// 补0
function prefixInteger(num, length = 2) {
    if (!num) return
    return new Array(length - ('' + num).length + 1).join(0) + num;
}

module.exports = {
    // 千位逗号分隔
    toNumbers(num, len = 2) {
        num = Number(num).toFixed(len)
        num = num + '';
        let strToArr = num.split('.')
        if (strToArr[0] >= 10000000) {
            strToArr[0] = strToArr[0] / 10000 + '万'
            return strToArr[0] + '.' + strToArr[1]
        } else {
            if (!num.includes('.')) {
                num += '.'
            }
            return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
                return $1 + ',';
            }).replace(/\.$/, '');
        }

    },

    // 可以增减年
    getNowDate(type = 1, countYear = null) {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (countYear) {
            year = year + countYear
        }

        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day
        }
        let nowDate = year + "-" + month + "-" + day
        switch (type) {
            case 1:
                nowDate = year + "-" + month + "-" + day
                break
            case 2:
                nowDate = month + "-" + day
                break
            case 3:
                nowDate = year + "-" + month
                break
            case 4:
                nowDate = month
                break
            case 5:
                nowDate = year + "." + month
                break
            case 6:
                nowDate = day
                break
        }
        return nowDate
    },
    subBankName(bankName) {
        bankName = bankName || ''
        if (bankName == null || bankName == undefined) {
            return '银行'
        }
        //先匹配银行两个字，然后截取银行前面的字符
        let b_name = bankName.substr(0, bankName.indexOf('银行'))
        let result
        if (b_name != '') {
            result = b_name + '银行'
        }
        else {
            result = bankName
        }
        return result
    },
    hideCardNumber(cardNo = '', len = 16) {
        switch (len) {
            case 8:
                cardNo = '**** ' + cardNo.substr(cardNo.length - 4, 4);
                break
            case 16:
                cardNo = cardNo.substr(0, 4) + ' **** **** ' + cardNo.substr(cardNo.length - 4, 4);
                break
        }

        return cardNo
    },
    hideSnNumber(sn) {
        sn = sn || ''
        if (sn != '') {
            sn = sn.substr(0, 4) + ' **** **** ' + sn.substr(sn.length - 4, 4);
        }
        return sn
    },
    prefixInteger,
    //回上一页并带参数
    setNavigateBackWithData(data, pageRoute) {
        let pages = getCurrentPages()
        if (pages.length > 1) {
            let prePage = pages[pages.length - 2]
            if (pageRoute != undefined && pageRoute != null) {
                //要校验的路径符合，说明没问题，设置数据
                if (prePage.route == pageRoute) {
                    prePage.setData(data)
                }
            }
            else {
                prePage.setData(data)
            }
        }
        wx.navigateBack()
    },
    subCardNumber(cardNo = '') {
        let ret = ''
        let numbers = cardNo.split('')
        for (let i = 0; i < numbers.length; i++) {
            if ((i + 1) % 4 == 0) {
                numbers[i] += ' '
            }
            ret += numbers[i]
        }
        return ret
    },
    //指定字数文字长度截取
    interceptStr(str, length = 6) {
        str = str || ''
        if (str == null || str == undefined || str == '') {
            return ''
        }
        let result = ''
        if (str.length > length) {
            result = str.substr(0, length) + '...'
        } else {
            result = str
        }
        return result
    },
    //获取当前月份 可增减年份
    getMonth(monthOnly = true, str = false) {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let res = ''
        if (monthOnly) {
            res = prefixInteger(month)
        } else {
            if (str) {
                res = year + '-' + prefixInteger(month)
            } else {
                res = year + prefixInteger(month)
            }

        }

        return res
    },
    /**
     * 数组对象去重
     * @param objArr 数组对象
     * @param key 去重的条件字段
    */
    uniqueMap(objArr, key) {
        let arr = []
        let tempObj = {}
        objArr.forEach(function (item) {
            if (!tempObj[item[key]]) {
                arr.push(item)
                tempObj[item[key]] = 1
            }
        })
        return arr
    },

    showToast(msg) {
        setTimeout(() => {
            wx.showToast({
                title: msg,
                icon: "none",
            });
            setTimeout(() => {
                wx.hideToast();
            }, 2000)
        }, 0);
    },

    hideIdCard(idcard) {
        idcard = idcard || ''
        let ret = ''
        if (idcard.length > 15) {
            ret = idcard.substr(0, 6) + '---' + idcard.substr(idcard.length - 4, idcard.length)
        }
        return ret
    },

    timestampToTime(timestamp, type = 1) {
        if (!timestamp) return ''
        // let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(Number(timestamp))
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate()
        let h = date.getHours() ? this.prefixInteger(date.getHours()) + ':' : '00:'
        let m = date.getMinutes() ? this.prefixInteger(date.getMinutes()) + ':' : '00:'
        let s = date.getSeconds() ? this.prefixInteger(date.getSeconds()) : '00'
        let res
        switch (type) {
            case 1:
                res = Y + '-' + prefixInteger(M) + '-' + prefixInteger(D) + ' ' + h + m + s
                break
            case 2:
                res = Y + '-' + prefixInteger(M) + '-' + prefixInteger(D)
                break
            case 3:
                res = prefixInteger(M) + '-' + prefixInteger(D)
                break
            case 4:
                res = prefixInteger(M)
                break
        }
        return res
    },
    // 根据groupId获取对应的银行logo图片文件名
    getBankLogo(groupId = 0) {
        try {
            let existBankId = [107, 155, 184, 226, 264, 372, 401, 413, 423, 449, 539, 644, 656, 383];
            let imgName = existBankId.includes(groupId) ? groupId : 'icon_default@2x'
            return imgName
        }
        catch (exception) {
            console.log('getBankLogo err:', groupId)
        }

    },
    // 转换日期显示的格式
    formatDateStr(dataStr = '1999-01-01') {
        dataStr = dataStr.split('-')
        dataStr = dataStr[0] + '年' + dataStr[1] + '月' + dataStr[2] + '日'
        return dataStr
    },
    //    TRUE,        //开通
    //    FALSE,        //禁用
    //    INIT,        //待提交
    //    ACCOUNT_SETTLE_INFO, // 待提交
    //    BASEINFO_INIT,   // 待提交
    //    WAIT_AUDIT,    //待审核
    //    AUDITING,      //审核中
    //    AUDIT_REJECT , //审核拒绝
    //    DELETE,        //已删除
    //    SUSPEND,       //挂起
    //    WAIT_OPEN,     //待开通
    //    PRETRANS;    //预开通
    //    橙色：待提交、审核中、待审核、待开通、挂起
    //    红色：关闭、已删除（不关联已删除状态的商户）
    //    绿色：预开通、已开通
    transStatusType(type = '') {
        let green = '#0FC544'
        let orange = '#F98A36'
        let red = '#EB464E'
        let bggreen = '#E1FFEA'
        let bgorange = '#FFEFE1'
        let bgred = '#fff'
        let transTypeObj = {
            // 绿色2个
            'PRETRANS': {
                name: '预开通',
                fontColor: green,
                bgColor: bggreen
            },
            'TRUE': {
                name: '已开通',
                fontColor: green,
                bgColor: bggreen
            },
            // 红色2个
            'FALSE': {
                name: '禁用',
                fontColor: red,
                bgColor: bgred
            },
            'DELETE': {
                name: '已删除',
                fontColor: red,
                bgColor: bgred
            },
            // 其余状态都是橙色
            'INIT': {
                name: '待提交',
                fontColor: orange,
                bgColor: bgorange
            },
            'ACCOUNT_SETTLE_INFO': {
                name: '待提交',
                fontColor: orange,
                bgColor: bgorange
            },
            'BASEINFO_INIT': {
                name: '待提交',
                fontColor: orange,
                bgColor: bgorange
            },
            'WAIT_AUDIT': {
                name: '待审核',
                fontColor: orange,
                bgColor: bgorange
            },
            'AUDITING': {
                name: '审核中',
                fontColor: orange,
                bgColor: bgorange
            },
            'AUDIT_REJECT': {
                name: '审核拒绝',
                fontColor: orange,
                bgColor: bgorange
            },
            'SUSPEND': {
                name: '挂起',
                fontColor: orange,
                bgColor: bgorange
            },
            'WAIT_OPEN': {
                name: '待开通',
                fontColor: orange,
                bgColor: bgorange
            },

        }
        return transTypeObj[type] || {
            name: '其他',
            color: green
        }
    },
    /**
     * 交易类型枚举
     * V2.0账单明细：
     * 'REGULAR': '消费'、手账-消费：-，绿色
     * 'VOID': '撤销'：+，红色
     * 'REVERSAL': '冲正'：+，红色
     * 'REFUND': '退货'、手账-退货：+，红色
     * 'REPAYMENT': '还款'、手账-还款：+，红色
     * 'PRE_AUTH': '预授权'：-，绿色
     * 'PRE_AUTH_VOID': '预授权撤销'：+，红色
     * 'PRE_AUTH_COMP': '预授权完成'：-，绿色
     * 'PRE_AUTH_COMP_VOID': '预授权完成撤销' ：+，红色
     * 'COST': '费用'：根据交易展示一致（eg.若交易为“消费，，绿色”，    费用为“，绿色”；* 若交易为“撤销，，红色”，则费用为“，红色”    --V2.1版本，账单明细隐藏“手续费”，在交* 易详情展示。
     **/
    // POS消费、POS消费撤销、POS预授权、POS预授权撤销、POS预授权完成、POS预授权完成撤销
    transTranDeviceType(type = '') {
        let green = '#41a206'
        let red = '#EB464E'
        let transTypeObj = {
            'REGULAR': {
                name: '消费',
                color: green,
                sign: '-'
            },
            'VOID': {
                name: '消费撤销',
                color: red,
                sign: '+'
            },
            'REVERSAL': {
                name: '消费冲正',
                color: red,
                sign: '+'
            },
            'REFUND': {
                name: '消费退货',
                color: red,
                sign: '+'
            },
            'CUSTOM_REFUND': {
                name: '手账退货',
                color: red,
                sign: '+'
            },
            'REPAYMENT': {
                name: '还款',
                color: red,
                sign: '+'
            },
            'PRE_AUTH': {
                name: '预授权',
                color: green,
                sign: '-'
            },
            'PRE_AUTH_VOID': {
                name: '预授权撤销',
                color: red,
                sign: '+'
            },
            'PRE_AUTH_COMP': {
                name: '预授权完成',
                color: green,
                sign: '-'
            },
            'PRE_AUTH_COMP_VOID': {
                name: '预授权完成撤销',
                color: red,
                sign: '+'
            },
            'COST': {
                name: '费用',
                color: green,
                sign: '-'
            },
        }
        return transTypeObj[type] || {
            name: '其他',
            color: green,
            sign: '-'
        }
    },
    // 与上面相反的一套规则，COST不变
    antiTransTranDeviceType(type = '') {
        let green = '#41a206'
        let red = '#EB464E'
        let transTypeObj = {
            'REGULAR': {
                name: '消费',
                color: red,
                sign: '+'
            },
            'VOID': {
                name: '撤销',
                color: green,
                sign: '-'
            },
            'REVERSAL': {
                name: '冲正',
                color: green,
                sign: '-'
            },
            'REFUND': {
                name: '退货',
                color: green,
                sign: '-'
            },
            'CUSTOM_REFUND': {
                name: '退货',
                color: green,
                sign: '-'
            },
            'REPAYMENT': {
                name: '还款',
                color: green,
                sign: '-'
            },
            'PRE_AUTH': {
                name: '预授权',
                color: red,
                sign: '+'
            },
            'PRE_AUTH_VOID': {
                name: '预授权撤销',
                color: green,
                sign: '-'
            },
            'PRE_AUTH_COMP': {
                name: '预授权完成',
                color: red,
                sign: '+'
            },
            'PRE_AUTH_COMP_VOID': {
                name: '预授权完成撤销',
                color: green,
                sign: '-'
            },
            'COST': {
                name: '费用',
                color: green,
                sign: '-'
            },
        }
        return transTypeObj[type] || {
            name: '其他',
            color: green,
            sign: '-'
        }
    },
    // 产品名称：全部、标准银行卡、小额双免（以商户本身特征-北京预算，包含优惠）、手机闪付（以商户本身特征-北京预算,包含优惠）、银联二维码、微信、支付宝

    // 双免
    // public static final String TRANS_SYTLE_MM="MM";
    // 云闪付
    // public static final String TRANS_SYTLE_YSF="YSF";
    // 云闪付+免密
    // public static final String TRANS_STYLE_YSFMM="YSFMM";
    // 标准银行卡(历史数据如果是空也认为是YHK)
    // public static final String TRANS_STYLE_YHK="YHK";

    // 银联二维码
    // public static final String TRANS_STYLE_YL="YL";

    // 微信
    // public static final String TRANS_STYLE_WX="WX";

    // 支付宝
    // public static final String TRANS_STYLE_ZFB="ZFB";

    // 图标展示规则
    // 银行图标 - 双免/云闪付/云闪付+免密/标准银行卡
    // 云闪付图标 - 银联二维码 
    // 微信 - 微信
    // 支付宝 - 支付宝
    styleTypeObj(styleType) {
        let styleTypeObj = {
            'TRANS_STYLE_YL': {
                name: '银联二维码',
                iconName: 'icon_yinlian_pay'
            },
            'TRANS_STYLE_WX': {
                name: '微信',
                iconName: 'icon_wechat_pay'
            },
            'TRANS_STYLE_ZFB': {
                name: '支付宝',
                iconName: 'icon_ali_pay'
            }

        }
        return styleTypeObj[styleType] || {
            name: '',
            iconName: ''
        }

    },
    // '' {} [] null undefind 则为空
    isEmpty(obj) {
        let res = false
        if (!obj || Object.keys(obj).length == 0) {
            res = true
        }
        return res
    },
    GetQueryString(url) {
        var reg = new RegExp("(^|&)" + url + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    getUrlParams(urlStr = '') {
        var params = {},
            query;
        if (urlStr.indexOf('?') !== -1) {
            query = urlStr.slice(urlStr.indexOf('?') + 1);
            if (query.length > 0) {
                params = {};
                query = query.split('&');
                query.forEach(function (param) {
                    var tempParam = param.split('=');
                    params[tempParam[0]] = decodeURI(param.substring(param.indexOf('=') + 1, param.length));
                })
            }
        }
        return params;
    },
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    formatTime(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return [hour, minute].map(this.formatNumber).join(':')
        // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    },
    cutFourCardNumber(cardNo = '') {
        cardNo = cardNo.substr(cardNo.length - 4, 4);
        return cardNo
    },
    // 生成N位随机整数
    randomCode(length = 4) {
        let num = "";
        for (var i = 0; i < length; i++) {
            num += Math.floor(Math.random() * 10)
        }

        return num
    },
    // 扫码条形码
    scanBarCode(cb) {
        wx.scanCode({
            onlyFromCamera: true,
            success(res) {
                let result = res.result || ''
                console.info(result)
                // 条形码没有http
                if (result.indexOf('http') != -1) {
                    result = ''
                    wx.showModal({
                        title: '提示',
                        content: '请扫描终端背后条形码',
                        showCancel: false,
                    })
                } else {
                    cb && cb(result)
                }
            },
            fail(res) {
                console.info('scanCode fail',res)
                // wx.showModal({
                //     title: '提示',
                //     content: '识别失败！',
                //     showCancel: false,
                // })
            }
        })
    },
    // 解析二维码
    parseQRcode(qrcode = '') {
        qrcode = qrcode || ''
        let decode_qr = decodeURIComponent(qrcode) || ''
        let index = decode_qr.indexOf('?') + 1
        // 非合法二维码返回空
        if (decode_qr.indexOf('jump/') == -1) {
            return ''
        } else {
            if (index != 0) {
                decode_qr = decode_qr.substr(index, qrcode.length - index)
                return decode_qr
            }
        }
        return ''
    },
    //过去vendor type 对应的中文
    getVendorTypeName(vendorType) {
        if (!vendorType) return '无'
        let res = ''
        switch (vendorType) {
            case 'DEFAULT':
                res = '默认'
                break;
            case 'SPECIFIED':
                res = '速记'
                break;
            case 'group':
                res = '消费圈'
                break;
        }
        return res
    },
    // DIANPAY("DIANPAY","点付"),
    // QUPAY_D("QUPAY-D","趣付-电签"),
    // QUPAY_T("QUPAY-T","趣付-传统POS"),
    // KSHUA("KSHUA","开刷"),
    // OTHER("OTHER","其它"),
    getBrandName(brandCode = '') {
        if (!brandCode) return '无品牌'
        let res = ''
        switch (brandCode) {
            case 'DIANPAY':
                res = '点付'
                break;
            case 'QUPAY-D':
                res = '趣付电签'
                break;
            case 'QUPAY-T':
                res = '趣付传统POS'
                break;
            case 'KSHUA':
                res = '开刷'
                break;
            case 'OTHER':
                res = '其它'
                break;
        }
        return res
    },
    // 根据身份证号获取年龄
    getAgeFromIdCard(identityCard) {
        var len = (identityCard + "").length;
        var strBirthday = "";
        //处理18位的身份证号码从号码中得到生日和性别代码
        if (len == 18) {
            strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
        }
        if (len == 15) {
            var birthdayValue = '';
            birthdayValue = identityCard.charAt(6) + identityCard.charAt(7);
            if (parseInt(birthdayValue) < 10) {
                strBirthday = "20" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
            } else {
                strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
            }

        }
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday);
        var nowDateTime = new Date();
        var age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    //获取经过计算的时间- 目前就写了计算月的，有时间再补全其他逻辑
    getCountedTime(opt) {
        let options = Object.assign({
            y: 0,
            m: 0,
            d: 0,
            h: 0
        }, opt)
        let date = new Date()
        let resH = date.setHours(date.getHours() - options.h)//小时
        let resD = new Date().setDate((new Date().getDate() - options.d))//天
        let resM = new Date().setMonth((new Date().getMonth() + Number(options.m)))//月
        let resY = new Date().setFullYear((new Date().getFullYear() - options.y))//年
        let res = new Date(resM)
        let year = res.getFullYear()
        let month = res.getMonth() + 1
        let day = res.getDate()

        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day
        }
        let result = year + '-' + month + '-' + day

        return result

    },
}