/**
 * 指令绩效管理模板
 * lxf 2014-1-3
 * 遵循seajs module规范
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var store = tpl.store;
    var tplEvent = tpl.event;

    /* 引入其他模块 */
    var util = require('util'),
            Dialog = require('dialog');
    var publish = require('modules/publish/publish');
    var moment = require('moment');
    var tplCommon = require('../work-common'),
            approveCommon = require('tpls/approve/approve-common');
    var publishHelper = require('modules/publish/publish-helper');

    /* 定义组件 */
    var DateSelect = publishHelper.DateSelect; //选择日期组件
    var SelectBar = publish.selectBar; //选人组件
    var PwdValid = approveCommon.AllApproveValid;
    var contactData = util.getContactData(); //员工数据
    var currentUserData = contactData["u"]; //自己

    /* 初始化 */
    exports.init = function() {
        var tplEl = exports.tplEl;
        var tplName = exports.tplName;
        var performanceEl = $('.performance', tplEl);
        var contactData = util.getContactData(),
                loginUserData = contactData["u"];
        var inVipService = loginUserData.inVipService; //true是收费用户
        //公共处理
        tplCommon.init(tplEl, tplName);

        /**
         * 指令绩效管理类
         */
        var Performance = function(opts) {
            opts = $.extend({
                "element": performanceEl //容器是JQ对象
            }, opts || {});
            this.opts = opts;
            this.element = opts.element;
            this.statusId = 0; //状态ID
            this.init(); //初始化
        };
        $.extend(Performance.prototype, {
            init: function() {
                this.inVipServiceFn(); //是否是收费用户的操作
                this.bindEvents(); //事件绑定
                this.setDateSelect(); //实例化选择日期组件
                this.senderSb(); //实例化发出人选人组件
                this.executorSb(); //实例化执行人选人组件
            },
            /**
             * 是否是收费用户的操作
             */
            inVipServiceFn: function() {
                var elEl = this.element;
                var submitBtn = $('.j-submit-btn', elEl);
                var totalDownloadTimeBtn = $('.total-download-time', elEl);
                if (!inVipService) {//如果不是VIP
                    submitBtn.addClass('button-state-disabled'); //按钮置灰
                    util.api({
                        "url": '/file/GetDownLoadLimit',
                        "type": 'get',
                        "dataType": 'json',
                        "data": {
                            "bussinessType": 3
                        },
                        beforeSend: function() {
                        },
                        "success": function(responseData) {
                            if (responseData.success) {
                                //成功之后

                                var value = responseData.value.value;
                                var value1 = responseData.value.value1;
                                var remain = value - value1; //剩余下载次数
                                totalDownloadTimeBtn.text(value);
                                if (remain > 0) {//有余次的情况下
                                    submitBtn.text('生成报表（余' + remain + '次）');
                                    submitBtn.data('value', remain);//次数保存起来
                                    submitBtn.removeClass('button-state-disabled'); //按钮取消置灰
                                } else {
                                    submitBtn.text('生成报表（余0次）');
                                }
                            }
                        }
                    });
                } else {
                    $('.readme-list', elEl).remove();
                }
            },
            bindEvents: function() {
                var elEl = this.element;
                var that = this;
                //提交
                elEl.on('click', '.performance-form .j-submit-btn', function(e) {
                    var meEl = $(e.currentTarget);
                    if (!meEl.is('.button-state-disabled')) {//可用时
                        that.inVipServiceFn();//再判断一下余次
                        that.fecth();
                    }
                });
                //下载表格
                elEl.on('click', '.download-link', function(evt) {
                    var linkEl = $(evt.currentTarget);
                    var submitBtn = $('.j-submit-btn', elEl);
                    var value = submitBtn.data('value');//次数保存起来
                    submitBtn.text('生成报表（余' + (value - 1) + '次）');
                    if (value == 1) {
                        submitBtn.addClass('button-state-disabled'); //按钮置灰
                    }
                    linkEl.hide();

                });
                //发出时间的按钮事件
                elEl.on('click', '.performance-status a', function() {
                    $('.performance-status a', elEl).removeClass('cur');
                    $(this).addClass('cur');
                    that.statusId = $(this).data('statusid');
                    return false;
                });
                //清空日期
                elEl.on('click', '.performance-form .clear-h', function() {
                    that.starttimeDs.clear();
                    that.endtimeDs.clear();
                });
                //快捷方式选取时间
                elEl.on('click', '.date-shortcut', function(evt) {
                    var starttimeDs = that.starttimeDs;
                    var endtimeDs = that.endtimeDs;
                    var meEl = $(this);
                    if (meEl.hasClass('current-week')) { //本周
                        starttimeDs.setValue(moment().startOf('week').add('d', 1));
                        endtimeDs.setValue(moment().endOf('week').add('d', 1));
                    }
                    if (meEl.hasClass('last-week')) { //上周
                        starttimeDs.setValue(moment().startOf('week').subtract('w', 1).add('d', 1));
                        endtimeDs.setValue(moment().startOf('week'));
                    }
                    if (meEl.hasClass('current-month')) { //本月
                        starttimeDs.setValue(moment().startOf('month'));
                        endtimeDs.setValue(moment().endOf('month'));
                    }
                    if (meEl.hasClass('last-month')) { //上月
                        starttimeDs.setValue(moment().startOf('month').subtract('M', 1));
                        endtimeDs.setValue(moment().endOf('month').subtract('M', 1));
                    }
                    evt.preventDefault();
                });

            },
            /**
             * 发出人选人组件
             */
            senderSb: function() {
                var elEl = this.element;
                var senderSbEl = $('.sender-sb', elEl);
                var senderSb = new SelectBar({
                    "element": senderSbEl,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactData['p'] //数据来源
                        }
                    ],
                    "singleCked": true, //单选？
                    "title": "选择发出人",
                    "autoCompleteTitle": "请输入姓名或拼音"
                });
                this.senderSb = senderSb;
            },
            /**
             * 执行人选人组件
             */
            executorSb: function() {
                var elEl = this.element;
                var senderSbEl = $('.executor-sb', elEl);
                var executorSb = new SelectBar({
                    "element": senderSbEl,
                    "data": [
                        {
                            "title": "同事",
                            "type": "p",
                            "list": contactData['p'] //数据来源
                        },
                        {
                            "title": "部门",
                            "type": "g",
                            "list": contactData['g'] //数据来源
                        }
                    ],
                    "singleCked": false, //单选？
                    "title": "选择执行人",
                    "autoCompleteTitle": "请输入员工姓名或部门"
                });
                this.executorSb = executorSb;
            },
            /**
             * 配置选择日期组件
             */
            setDateSelect: function() {
                var elEl = this.element;
                var startTimeEl = $('.start-date', elEl);
                var endTimeEl = $('.end-date', elEl);
                //开始时间
                var starttimeDs = new DateSelect({
                    "element": startTimeEl,
                    "placeholder": "选择日期",
                    "formatStr": "YYYY年MM月DD日"
                });
                //结束时间
                var endtimeDs = new DateSelect({
                    "element": endTimeEl,
                    "placeholder": "选择日期",
                    "formatStr": "YYYY年MM月DD日"
                });
                this.starttimeDs = starttimeDs;
                this.endtimeDs = endtimeDs;
            },
            /**
             * 验证提交数据
             */
            isValid: function() {
                var starttimeDs = this.starttimeDs,
                        endtimeDs = this.endtimeDs;
                var oData = this.setOdata();
                if (oData.startTime == 0) {
                    util.showInputError($('input', starttimeDs.element));
                    return false;
                }
                if (oData.endTime == 0) {
                    util.showInputError($('input', endtimeDs.element));
                    return false;
                }
                if (oData.startTime > oData.endTime) {
                    util.alert('请选择发送的结束时间大于开始时间');
                    return false;
                }
                return true;
            },
            /**
             * 参数数据
             */
            setOdata: function() {
                var senderSb = this.senderSb;
                var executorSb = this.executorSb;
                var senderSbData = senderSb.getSelectedData();
                var executorSbData = executorSb.getSelectedData();
                var senderSbMemberData = senderSbData['p'] || [0];
                var executorSbMemberDataP = executorSbData['p'] || [];
                var executorSbMemberDataG = executorSbData['g'] || [];
                var startTime = this.starttimeDs.getValue(true);
                var endTime = this.endtimeDs.getValue(true);
                var oData = {};
                if (startTime) {
                    startTime = startTime.unix();
                } else {
                    startTime = 0;
                }
                if (endTime) {
                    endTime = endTime.add('days', 1).subtract('seconds', 1).unix();
                } else {
                    endTime = 0;
                }
                _.extend(oData, {
                    "workType": this.statusId, //日志类型；0：全部；1：执行中；2：已完成；3：已取消
                    "startTime": startTime,
                    "endTime": endTime,
                    "assignerID": senderSbMemberData[0], //发出人数据
                    "executerEmployeeIDs": executorSbMemberDataP,
                    "executerCircleIDs": executorSbMemberDataG
                });
                return oData;
            },
            /**
             * 导出数据的请求
             */
            fecth: function() {
                var that = this;
                var elEl = this.element;
                var oData = this.setOdata();
                var downbtnTipEl = $('.downbtntip', elEl);
                if (this.isValid()) {
                    util.api({
                        "url": '/FeedWork/GetExportWorkSummary',
                        "type": 'post',
                        "dataType": 'json',
                        "data": oData,
                        beforeSend: function() {
                            downbtnTipEl.show().addClass('loading').html('正在生成报表，请稍后...');
                        },
                        "success": function(responseData) {
                            if (responseData.success) {
                                var downLink = '<a class="download-link" href="' + FS.API_PATH + '/df/gettemp1?id=' + responseData.value + '&name=' + encodeURIComponent("员工指令统计报表") + '.xls&bussinessType=3">生成完毕，点击下载报表</a>';
                                //成功之后
                                downbtnTipEl.html(downLink).removeClass('loading');

                            } else {
                                downbtnTipEl.hide();
                            }
                        }
                    }, {
                        "modal": $('.performance-form .j-submit-btn', elEl) //禁止对按钮添加logding样式
                    });
                }
            },
            destroy: function() {
                //this.xxx = null;
            }
        });
        //实例化
        var performance = new Performance({"element": performanceEl});
        //密码验证
        var pwdValid = new PwdValid({
            "defaultRequestData": function() {
                return {
                    "functionNo": 5
                };
            },
            "successCb": function(responseData) {
                if (responseData.success) {
                    //直接隐藏
                }
            }
        });
        tplEvent.one('switched', function(tplName2, tplEl) {
            if (tplName2 == tplName) {
                pwdValid.show();
            }
        });
    };
});