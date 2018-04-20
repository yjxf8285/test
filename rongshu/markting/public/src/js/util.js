/**
 * Created by 刘晓帆 on 2016-4-11.
 * 工具箱
 */
'use strict';
var root = window || {};
var app = require('app') || window.app;
var showLog = true;
$.extend(root, {
    baseUrl: '/',
    baseDir: 'm/',
    appName: 'TETEM',
    versions: '1.0.0', //当前版本号
    API_PATH: '/proxy/localhost:8089/api/',//AJAX路径
    BASE_PATH: '',//根路径
    IMG_PATH: '',//图片服务器路径
    //BASE_PATH: '/mkt',//根路径
    //IMG_PATH: '/mkt',//图片服务器路径
    EMPTY_FN: function () {
    }
});

var util = {
    /**
     *
     * @param val
     * @param type
     */
    log: function (val, type) {
        if (type) {
            showLog && console[type](val);
        } else {
            showLog && console.info(val);
        }
    },

    /**
     * 补零
     * @param num
     * @param n
     * @returns {string}
     */
    pad: function (num) {
        var result = new Array(2 - ('' + num).length + 1).join(0) + num;
        return result;
    },
    /**
     * 随机生成n个1-maxNum之间的值不会重复的整数组，十位补0
     * @param minNum-maxNum 范围
     * @param n 多少个
     * @param pad 是否需要补0
     * @param repeat 是否可以重复
     * @returns {arr}
     */
    randomIntNum: function (minNum, maxNum, n, pad, repeat) {
        var hash = {};
        var newArr = [];
        var rNum;
        minNum || 1;
        maxNum || 9;
        n || 1;
        for (var i = 0; i < n;) {
            rNum = parseInt(Math.random() * maxNum + minNum);
            if (repeat) {
                pad && (rNum < 10) && (rNum = '0' + rNum);
                newArr.push(rNum);
                i++;
            } else {
                if (!hash[rNum]) {
                    hash[rNum] = true;
                    pad && (rNum < 10) && (rNum = '0' + rNum);
                    newArr.push(rNum);
                    i++;
                }
            }

        }
        return newArr;
    },
    /**
     * 获得地址栏传递参数
     * @returns {null}
     * demo.html?cid=1&aa=2
     */
    getLocationParams: function (href) {
        href = href || location.href;
        var params = null,
            query;
        if (href.indexOf('?') !== -1) {
            query = href.slice(href.indexOf('?') + 1);
            if (query.length > 0) {
                params = {};
                query = query.split('&');
                _.each(query, function (param) {
                    var tempParam = param.split('=');
                    params[tempParam[0]] = decodeURI(param.substring(param.indexOf('=') + 1, param.length));
                });
            }
        }
        return params;
    },
    /**
     * 验证可定义的合法url
     * @url String URI
     * @field String 域
     * @suffix String 域名后缀
     */
    isFieldUrl: function (url, field, suffix) {
        field || (field = '[a-z]+');
        suffix || (suffix = '[a-z]+');
        var rUrl = new RegExp('^(?:https?:\\/\\/)?(?:\\w+\\.)*' + field + '\\.' + suffix + '$', '');
        return rUrl.test(url);
    },
    /**
     * ajax封装
     * @param opts
     * @param customOpts
     * @returns {*}
     */
    api: function (opts, customOpts) {
        var that = this;
        var success = opts.success || root.EMPTY_FN;
        var beforeSend = opts.beforeSend || root.EMPTY_FN;
        var error = opts.error || root.EMPTY_FN;
        var complete = opts.complete || root.EMPTY_FN;
        if (opts.surl) {
            opts.url = opts.surl;
        } else {
            opts.url = root.API_PATH + opts.url;
        }
        opts.data = $.extend(opts.data, {
            sid: 11
        })
        opts = $.extend({
            timeout: 5000,
            type: 'get',
            autoJumpLogin: true,
            //contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }, opts, {
            success: function (responseData, textStatus, jqXHR) {
                var status = responseData.status;
                if (status == 401 && opts.autoJumpLogin) {
                    dialog.confirm({
                        content: "您还没有登录，请先登录！", hasSureHander: function () {
                            window.location.href = "/m/html/login.html"
                        }
                    });
                }
                return success.apply(this, arguments);

            },
            beforeSend: function () {
                return beforeSend.apply(this, arguments);
            },
            error: function (jqXHR, textStatus) {
                //that.showErrorInfo(jqXHR);
                return error.apply(this, arguments);
            },
            complete: function (jqXHR, textStatus) {
                return complete.apply(this, arguments);
            }
        });
        //if (opts.type.toLowerCase() == "post" && opts.data) {
        //    opts.data = JSON.stringify(opts.data);
        //}
        var jqAjax = $.ajax(opts);
        return jqAjax;
    },
    uuid: function () {
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
        }

        return uuid;
    },
    /**
     * 点击非目标区域时执行回调
     * @param targetDom
     * @param cb
     */
    bodyClose: function (jqueryDom, callback) {
        $(document).on('click', function (e) {
            var _con = jqueryDom;   // 设置目标区域
            if (!_con.is(e.target) && _con.has(e.target).length === 0) { // Mark 1

                callback();
            }
        });
    },
    getChartColors: function () {
        return ['#8a93d9', '#73a9dc', '#62c1dc', '#62dccf', '#f8b656', '#f6c755', '#c090ec', '#fd8eab'];
    }
}
window.util = util;
module.exports = util;