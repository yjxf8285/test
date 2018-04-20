/**
 * 金山合作页
 * Created by richard on 14-9-11.
 */

define(function (require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var tplEvent = tpl.event;
    var util = require('util');
    var Pagination = require('uilibs/pagination');
    var moment = require('moment');
    var publishHelper = require('modules/publish/publish-helper');

    /**
     * 列表
     * @param {object} opts
     */
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var List = function (opts) {
        opts = $.extend({
            element: null //容器是JQ对象
        }, opts || {});
        this.options = opts;
        this.$el = opts.element;
        this.init(); //初始化
    };
    $.extend(List.prototype, {
        init: function () {
            this.setupComponent();
            this.bindEvents(); //事件绑定
        },
        bindEvents: function () {
            var elEl = this.$el;
            var that = this;
            //搜索
            elEl.on('click', '.search-btn', function () {
                that.search();
            });
            //导出
            elEl.on('mouseenter', '.export-btn', function () {
                var startTimeDsVal = that.startTimeDs.getValue() || 0;
                var endTimeDsVal = that.endTimeDs.getValue() || 0;
                var startTime, endTime;
                if (startTimeDsVal) {
                    startTime = moment(startTimeDsVal, 'YYYYMMDD HH:mm').unix();
                } else {
                    startTime = 0;
                }
                if (endTimeDsVal) {
                    endTime = moment(endTimeDsVal, 'YYYYMMDD HH:mm').unix();
                } else {
                    endTime = 0;
                }
                var keywordVal = $.trim($('.keyword-input', that.$el).val());
                var linkStr = '/H/Management/GetLoginRecordsExcel?beginDate=' + startTime + '&endDate=' + endTime + '&keyword=' + keywordVal + '&isAbnormal=' + that.options.isAbnormal + '';
                $(this).attr('href', linkStr);
            });
            //看全部
            elEl.on('click', '.totalnum', function () {
                that.options.isAbnormal = 0;
                that.refresh({
//                    beginDate: 0,// long，开始日期
//                    endDate: 0,//long，结束日期
//                    keyword: '',//string，搜索关键字
                    isAbnormal: 0//int，是否异常(全部=0;异常=1)
                });
            });
            //看异常
            elEl.on('click', '.unusualnum', function () {
                that.options.isAbnormal = 1;
                that.refresh({
                    //                    beginDate: 0,// long，开始日期
                    //                    endDate: 0,//long，结束日期
                    //                    keyword: '',//string，搜索关键字
                    isAbnormal: that.options.isAbnormal//int，是否异常(全部=0;异常=1)
                });
            });
        },
        // 搜索
        search: function () {
            var startTimeDsVal = this.startTimeDs.getValue() || 0;
            var endTimeDsVal = this.endTimeDs.getValue() || 0;
            var startTime, endTime;
            if (startTimeDsVal) {
                startTime = moment(startTimeDsVal, 'YYYYMMDD HH:mm').unix();
            } else {
                startTime = 0;
            }
            if (endTimeDsVal) {
                endTime = moment(endTimeDsVal, 'YYYYMMDD HH:mm').unix();
            } else {
                endTime = 0;
            }

            var keywordVal = $.trim($('.keyword-input', this.$el).val());

            if (startTime&&endTime&&(startTime > endTime)) {
                util.alert('开始时间不能大于结束时间');
            } else {
                this.refresh({
                    beginDate: startTime,// long，开始日期
                    endDate: endTime,//long，结束日期
                    keyword: keywordVal,//string，搜索关键字
                    isAbnormal: 0//int，是否异常(全部=0;异常=1)
                });
            }

        },
        // 请求数据
        load: function () {
            var that = this;
            var elEl = this.$el;
            var tBodyEl = $('.kingsoft-table tbody', elEl);
            util.api({
                "url": this.options.url,
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                beforeSend: function () {
                    $('.loading-bar', elEl).show(); //显示黄条加载提示
                },
                "success": function (responseData) {
                    var totalCount = 0;
                    var isAuthorized = responseData.isAuthorized;
                    $('.loading-bar', elEl).hide(); //隐藏黄条加载提示
                    if (isAuthorized && responseData.success) {
                        totalCount = responseData.value.totalCount || 0;
                        $('.totalnum', elEl).text(responseData.value.allRecordsCount);
                        $('.unusualnum', elEl).text(responseData.value.abnormalCount || 0);
                        if (totalCount > 0) {
                            tBodyEl.html(that.formaTtrStr(responseData));
                            tBodyEl.find('tr:odd').addClass('odd');
                            $('.company-name', elEl).text(responseData.value.enterpriseName || '');
                            $('.loginer-name', elEl).text(responseData.value.adminName || '');
                            that.pagination.setTotalSize(totalCount);//设置分页总数
                            that.pagination.render().show();
                        } else {
                            tBodyEl.html(' <td colspan="7"><div class="list-empty-tip" style="display: block;"><img class="icon-empty" alt="loading" src="../../html/card/assets/images/clear.gif">&nbsp;&nbsp;<span class="empty-text">暂无记录</span></div></td>');
                            that.pagination.hide();
                        }
                    } else {
                        elEl.html('<div class="err-page"></div>');
                    }
                }
            });
        },
        // 刷新数据
        refresh: function (data) {
            this.options.data = _.extend(this.options.data, data);
            this.load();
        },
        // TR数据格式化
        formaTtrStr: function (responseData) {
            var formatDataStr = '';
            var formatData = {};
            _.extend(formatData, responseData || {});
            // timingMessageRemainds数据重新整理
            _.each(formatData.value.loginRecords, function (loginRecord) {
                var createTime = moment(loginRecord.loginTime).format('YYYY-MM-DD HH:mm');
                var loginArea = loginRecord.loginArea || '';
                var loginDeviceName = loginRecord.loginDeviceName || '';
                var name = loginRecord.name || '';
                var post = loginRecord.post || '';
                var loginIP = loginRecord.loginIP || '';
                var remark = loginRecord.remark || '';

                formatDataStr += '<tr><td>' + createTime + '</td><td>' + name + '</td><td>' + post + '</td><td>' + loginDeviceName + '</td><td>' + loginIP + '</td><td>' + loginArea + '</td><td><span style="color:#f54438;">' + remark + '</span></td></tr>';
            });

            return formatDataStr;
        },
        // 设置组件
        setupComponent: function () {
            var elEl = this.$el;
            var that = this;
            //初始化分页组件
            this.pagination = new Pagination({
                "element": this.options.pagEl,
                "pageSize": 10,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });
            this.pagination.on('page', function (pageNumber) {
                that.refresh({
                    pageNumber: pageNumber// int，页码
                });
            });
            this.startTimeDs = new DateSelect({
                "element": $('.start-date', elEl),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日",
                "isCRM": true
            });
            this.endTimeDs = new DateSelect({
                "element": $('.end-date', elEl),
                "placeholder": "选择日期",
                "formatStr": "YYYY年MM月DD日",
                "isCRM": true
            });

        }
    });

    exports.init = function () {
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var list = new List({
            url: '/Management/GetLoginRecords',
            element: $('.kingsoft-bd', tplEl),
            pagEl: $('.pagination-wrapper', tplEl),
            isAbnormal: 0,
            data: {
                beginDate: 0,// long，开始日期
                endDate: 0,//long，结束日期
                keyword: '',//string，搜索关键字
                isAbnormal: 0,//int，是否异常(全部=0;异常=1)
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，页数
            }
        });
        list.load();

        /* //监听页面切换事件
         tplEvent.on('switched', function (tplName2, tplEl) {
         //如果是当前页面隐藏头尾并且改变宽度。
         if (tplName2 == tplName) {
         $('.app-inner').css({ width: '980px' });
         $('.hd').hide();
         $('.ft').hide();
         } else {
         $('.app-inner').css({ width: '960px' });
         $('.hd').show();
         $('.ft').show();
         }
         });*/


    };
});