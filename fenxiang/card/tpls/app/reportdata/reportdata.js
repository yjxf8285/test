/**
 * 上报数据
 * @author liuxf
 **/
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event,
        store = tpl.store,
        list = tpl.list;

    var util = require('util');
    var SearchBox = require('uilibs/search-box');//搜索框组件
    var leftNav = require('modules/app-report-leftnav/app-report-leftnav');
    var Pagination = require('uilibs/pagination2');//分页组件
    var moment = require('moment');
    var json = require('json');
    var publishHelper = require('modules/publish/publish-helper');
    var DateSelect = require('calendar');
    var approveemployeeslistTpl = require('./approveemployeeslist.html');


    var ReportData = function (opts) {
        opts = $.extend({
            element: null //容器是JQ对象
        }, opts || {});
        this.options = opts;
        this.$el = opts.element;
        this.sendType = 1; //上报1；补报2；修改3
        this.init(); //初始化
    };
    $.extend(ReportData.prototype, {
        init: function () {
            var elEl = this.$el;
            this.bindEvents();
            this.setupComponent();
        },
        //事件绑定
        bindEvents: function () {
            var elEl = this.$el;
            var that = this;
            var reportdataEl = elEl.closest('#report-reportdata');
            var listWarpsEl = $('.reportdata-list-warps', elEl);
            var txEl = $('.tx-warp', elEl);
            var xgEl = $('.xg-warp', elEl);
            var lssjEl = $('.lssj-warp', elEl);
            var sbsjEl = $('.sbsj-warp', elEl);
            reportdataEl.on('click', '.reportdata-list', function () {
                that.reset();
            });

            //主列表
            elEl.on('click', '.report-back', function (e) { //返回
                that.reset();
            }).on('click', '.fill-btn', function (e) { //今日上报
                that.sendType = 1;//上报类型为上报
                //                listWarpsEl.hide();
                var templateID = $(e.currentTarget).attr('data-templateid');
                var currentDay = $(e.currentTarget).attr('data-currentday');
                var lastUpdateTime = $(e.currentTarget).attr('data-lastupdatetime');
                that.txGetData({
                    templateID: templateID,
                    lastUpdateTime: lastUpdateTime,
                    currentDay: currentDay //int，报表日期(等于0时候不返回行数据信息)
                });
            }).on('click', '.historydata-btn', function (e) {//历史记录
                var templateID = $(e.currentTarget).attr('data-templateid');
                var currentDay = that.yesterday.replace(/-/g, '');//默认进来的是昨天的数据
                that.lsGetData({
                    templateID: templateID,
                    currentDay: currentDay //int，报表日期(等于0时候不返回行数据信息)
                });

            }).on('click', '.modify-btn', function (e) {//修改
                that.sendType = 3;//上报类型为修改
                //                listWarpsEl.hide();
                var templateID = $(e.currentTarget).attr('data-templateid');
                var currentDay = $(e.currentTarget).attr('data-currentday');
                var lastUpdateTime = $(e.currentTarget).attr('data-lastupdatetime');
                that.txGetData({
                    templateID: templateID,
                    lastUpdateTime: lastUpdateTime,
                    currentDay: currentDay //int，报表日期(等于0时候不返回行数据信息)
                });
            });
            //表格的加减号事件
            txEl.on('click', '.add-btn', function (e) {
                var meEl = $(e.currentTarget);
                var fnListEl = $('.report-common-table-fn-wrap', txEl);
                var liEl = meEl.closest('li');
                var trEl = $('.report-common-table tbody tr', txEl);
                var subEl = meEl.siblings('.subtract-btn');
                var fNodeName = trEl.eq(liEl.index()).find('.mn-select-title').text() || trEl.eq(liEl.index()).find('.node-tit-warp').text();
                var fNodeValue = util.mnGetter(trEl.eq(liEl.index()).find('.mn-select-box')) || trEl.eq(liEl.index()).find('.mn-select-box').attr('data-value') || trEl.eq(liEl.index()).find('.node-tit-warp').attr('data-nodeid');
                if (!meEl.is('.disabled')) {
                    subEl.removeClass('disabled');
                    trEl.eq(liEl.index()).after(that.baseTrStrs);
                    trEl.eq(liEl.index()).next().find('.mn-select-box').attr('data-value', fNodeValue).find('.mn-select-title').text(fNodeName);
                    liEl.after('<li><span class="add-btn"></span><span class="subtract-btn"></span></li>');
                    that.oderNumberSort();
                    if ($('.report-common-table tbody tr', txEl).length >= 20) {
                        $('.report-common-table-fn-wrap', txEl).find('.add-btn').addClass('disabled');
                        return;
                    }
                } else {
                    util.alert('最多可添加50个项目');
                }

            }).on('click', '.subtract-btn', function (e) {
                var fnListEl = $('.report-common-table-fn-wrap', txEl);
                var allAddBtn = fnListEl.find('.add-btn');
                var meEl = $(e.currentTarget);
                var liEl = meEl.closest('li');
                var trEl = $('.report-common-table tbody tr', txEl);
                allAddBtn.removeClass('disabled');
                if (!meEl.is('.disabled') && !meEl.is('.locked')) {
                    if (trEl.length <= 2) {
                        trEl.eq(liEl.index()).remove();
                        liEl.remove();
                        $('.report-common-table-fn-wrap li').eq(0).find('.subtract-btn').addClass('disabled');
                    } else {
                        trEl.eq(liEl.index()).remove();
                        liEl.remove();
                    }
                    that.oderNumberSort();
                } else {
                    util.alert('至少添加1个项目');
                }

            }).on('click', '.submit-s-btn', function (e) { //提交
                that.submit();

            }).on('click', '.submit-m-btn', function (e) { //修改的提交
                that.modify();
            }).on('click', '.drtdatadetail-table input', function (e) { //表单点击的时候清空默认值
                if ($(this).val() == '0' || $(this).val() == '0.00') {
                    $(this).val('');
                }
            }).on('blur', '.drtdatadetail-table input', function (e) { //表单离开焦点后如果为空就赋给默认值
                var meEl = $(this);
                var type = meEl.attr('data-itemtype');
                var name = meEl.attr('data-itemname');
                if (type == 1 && isNaN($(this).val())) {
                    util.alert('"' + name + '"请填写整数', function () {
                        meEl.focus().val('');
                    });
                    return false;
                }
                if (type == 2 && isNaN($(this).val())) {
                    util.alert('"' + name + '"请填写小数', function () {
                        meEl.focus().val('');
                    });
                    return false;
                }
                (type == 1 && $(this).val() == '') && $(this).val('0');
                (type == 2 && $(this).val() == '') && $(this).val('0.00');
                type == 2 && $(this).val(Number($(this).val()).toFixed(2));//始终保留2位小数

            });

            //历史数据
            lssjEl.on('click', '.history-modify-btn', function (e) {
                var templateID = $(e.currentTarget).attr('data-templateid');
                var currentDay = $(e.currentTarget).attr('data-currentday');
                var lastUpdateTime = $(e.currentTarget).attr('data-lastupdatetime');
                that.sendType = 2;//上报类型为补报
                if (!$(e.currentTarget).is('.disabled')) {
                    //                    listWarpsEl.hide();
                    that.txGetData({
                        templateID: templateID,
                        lastUpdateTime: lastUpdateTime,
                        currentDay: currentDay //int，报表日期(等于0时候不返回行数据信息)
                    });
                }
            }).on('click', '.history-search-btn', function (e) {//历史记录的搜索
                //                var lastUpdateTime = $(e.currentTarget).attr('data-lastupdatetime');
                var templateID = $(e.currentTarget).attr('data-templateid');
                var currentDay = $(e.currentTarget).siblings('.date-inp-warp').find('input').val();
                that.lsGetData({
                    templateID: templateID,
                    currentDay: currentDay.replace(/-/g, "") //int，报表日期(等于0时候不返回行数据信息)
                });
            }).on('click', '.export-excel-btn', function (e) {
                if (!$(e.currentTarget).is('.disabled')) {
                    alert('暂未开发！');
                }
            });

        },
        //序号排序
        oderNumberSort: function () {
            var tBodyEl = $('.tx-warp .drtdatadetail-table', this.$el);
            var trEl = $('tbody tr', tBodyEl);
            trEl.each(function (i) {
                $(this).find('td').eq(0).text(i + 1);
            });
        },
        /**
         * 历史记录数据获取
         * @param oData
         */
        lsGetData: function (oData) {
            var elEl = this.$el;
            var that = this;
            var listWarpsEl = $('.reportdata-list-warps', elEl);
            var lssjEl = $('.lssj-warp', elEl);
            var modifyBtnEl = $('.history-modify-btn', lssjEl);
            var exportBtnEl = $('.export-excel-btn', lssjEl);
            var searchBtnEl = $('.history-search-btn', elEl);
            var txTalbeEl = $('table', lssjEl);
            var txTheadEl = $('thead', txTalbeEl);
            var txTbodyEl = $('tbody', txTalbeEl);
            //            var submitEl = $('.submit-btn', lssjEl);
            //            var txFnEl = $('.report-common-table-fn-wrap', lssjEl);
            var crumbsEl = $('.report-breadcrumb', elEl);
            util.api({
                "url": '/DataReporting/GetDataReportHistory', //谁的接口地址
                "type": 'get',
                "dataType": 'json',
                "data": oData,
                beforeSend: function () {
                },
                "success": function (responseData) {
                    var templateName = responseData.value && responseData.value.templateName || '';
                    var templateID = responseData.value && responseData.value.templateID || 0;
                    var nodeSenders = responseData.value && responseData.value.nodeSenders || [];//行数据
                    var templateItems = responseData.value && responseData.value.templateItems || [];//列数据
                    var drtDataDetailRows = responseData.value && responseData.value.drtDataDetailRows || [];//如果是修改进来的用这里的数据展示
                    var isBak = responseData.value && responseData.value.isBak || false;//是否需要补报
                    var thStrs = '';
                    var trStrs = '';
                    if (responseData.success) {
                        that.templateID=templateID;
                        //重置面包屑
                        crumbsEl.html('<span>当前位置:</span><a href="#app/reportdata" class="report-back">报数系统</a>&gt; <a href="#app/reportdata" class="report-back">上报数据</a>&gt; ' + templateName);
                        modifyBtnEl.attr({
                            "data-templateid": oData.templateID,
                            "data-currentday": oData.currentDay
                        });
                        searchBtnEl.attr({
                            "data-templateid": oData.templateID,
                            "data-currentday": oData.currentDay
                        });
                        $('.templatename', lssjEl).text(templateName);//表格名称
                        //表头
                        _.each(templateItems, function (item) {
                            var itemType = item.itemType;
                            var itemTypeStr = '';
                            switch (itemType) {
                                case 1:
                                    itemTypeStr = '请输入整数';
                                    break;
                                case 2:
                                    itemTypeStr = '小数点保留两位';
                                    break;
                                case 3:
                                    itemTypeStr = '最多输入100字';
                                    break;
                            }
                            thStrs += '<th>' + item.itemName + '</th>';

                        });
                        txTheadEl.html('<th width="45">序号</th><th width="144">层次名称</th>' + thStrs);
                        if (drtDataDetailRows.length > 0) {
                            //表身
                            _.each(drtDataDetailRows, function (item, i) {
                                var tdStrs = '';
                                var textAlign = '';
                                _.each(item.dataItems, function (item, i) {
                                    if(item.itemType==1||item.itemType==2){
                                        textAlign='text-right';
                                    }
                                    tdStrs += '<td class="'+textAlign+'">' + item.value + '</td>';
                                });
                                trStrs += '<tr data-nodeid="' + item.drtCommonDataDetail.nodeID + '" data-drtid="' + item.drtCommonDataDetail.drtID + '"><td class="sort-number">' + (i + 1) + '</td><td>' + item.drtCommonDataDetail.nodeName + '</td>' + tdStrs + '</tr>';

                            });
                            txTbodyEl.html(trStrs);
                            modifyBtnEl.removeClass('disabled');
                            exportBtnEl.removeClass('disabled');
                            modifyBtnEl.text('编辑');
                        } else {//如果没有数据的情况
                            txTbodyEl.html('<tr><td colspan="' + (templateItems.length + 2) + '" class="empty-tip">没有数据</td></tr>');
                            if (isBak) {
                                modifyBtnEl.text('补报').attr('sendtype', 2);
                            } else {
                                modifyBtnEl.addClass('disabled');

                            }
                            exportBtnEl.addClass('disabled');
                        }
                        listWarpsEl.hide();
                        lssjEl.show();

                    }
                }
            });
        },
        /**
         * 获取审核人列表
         * @param templateID
         * @param warpEl
         * @private
         */
        _getApproveEmployees: function (templateID, warpEl) {
            var sendType = this.sendType;
            var template = _.template(approveemployeeslistTpl); //模板
            var appStr = '';
            switch (sendType) {
                case 1:
                    appStr = '上报截止时间后的修改需要审核，请选择一个审核人：';
                    break;
                case 2:
                    appStr = '补报数据需要审核，请选择一个审核人：';
                    break;
                case 3:
                    appStr = '修改历史数据需要审核，请选择一个审核人：';
                    break;
            }
            util.api({
                "url": '/DataReporting/GetApproveEmployees',
                "type": 'get',
                "dataType": 'json',
                "data": {templateID: templateID},
                "beforeSend": function () {
                },
                "success": function (responseData) {
                    var formatData = {};
                    _.extend(formatData, responseData || {});
                    warpEl.html(template(formatData));
                    $('.approvemployees-list-title', warpEl).text(appStr);
                }
            });
        },
        /**
         * 今日上报请求数据
         * @param oData
         */
        txGetData: function (oData) {
            var elEl = this.$el;
            var that = this;
            var txEl = $('.tx-warp', elEl);
            var txTalbeEl = $('.drtdatadetail-table', txEl);
            var txTheadEl = $('thead', txTalbeEl);
            var txTbodyEl = $('tbody', txTalbeEl);
            var submitEl = $('.submit-btn', txEl);
            var txFnEl = $('.report-common-table-fn-wrap', txEl);
            var crumbsEl = $('.report-breadcrumb', elEl);
            var listWarpsEl = $('.reportdata-list-warps', elEl);
            util.api({
                "url": '/DataReporting/CheckIsUnaudited', //是否已经审批
                "type": 'get',
                "dataType": 'json',
                "data": oData,
                "success": function (responseData) {
                    var value = responseData.value || 1;
                    if (responseData.success) {
                        if (value == 2) {
                            util.alert('您的上次修改还在审核中', function () {

                            });
                        } else {
                            util.api({
                                "url": '/DataReporting/GetDataReportSenderTemplateItems',
                                "type": 'get',
                                "dataType": 'json',
                                "data": oData,
                                beforeSend: function () {

                                },
                                "success": function (responseData) {
                                    listWarpsEl.hide();
                                    var templateName = responseData.value && responseData.value.templateName || '';
                                    var drtDataDetailRows = responseData.value && responseData.value.drtDataDetailRows || [];//如果是修改进来的用这里的数据展示
                                    var nodeSenders = responseData.value && responseData.value.nodeSenders || [];//行数据
                                    var templateItems = responseData.value && responseData.value.templateItems || [];//列数据
                                    var isNeedApprove = responseData.value && responseData.value.isNeedApprove || false;//是否有审核人
                                    var serviceTime = responseData.value && responseData.serviceTime || '';//当前时间
                                    var thStrs = '';
                                    var trStrs = '';
                                    var baseNodeName = '';
                                    var baseTrStrs = '';
                                    var baseTdStrs = '';
                                    var basenodeID = '';
                                    var liStr = '';
                                    var nodeNameLiStr = '';
                                    var crumbsStr = '';//面包屑
                                    var textAlign='';

                                    if (responseData.success) {
                                        //重置面包屑
                                        crumbsEl.html('<span>当前位置:</span><a href="#app/reportdata" class="report-back">报数系统</a>&gt; <a href="#app/reportdata" class="report-back">上报数据</a>&gt; ' + templateName);
                                        //如果有审核人就请求审核人列表
                                        if (isNeedApprove) {
                                            that._getApproveEmployees(oData.templateID || 0, $('.approvemployees-list-warp', txEl));
                                            $('.approvemployees-list-warp', txEl).show();
                                        } else {
                                            $('.approvemployees-list-warp', txEl).hide();
                                        }

                                        $('.templatename', txEl).text(moment.unix(serviceTime).format('YYYY-MM-DD') + '  ' + templateName);//表格名称
                                        //表头
                                        _.each(templateItems, function (item) {
                                            var itemType = item.itemType;
                                            var itemTypeStr = '';
                                            var fieldValue = '';
                                            var maxlengthNum = 100;
                                            switch (itemType) {
                                                case 1:
                                                    itemTypeStr = '请输入整数';
                                                    fieldValue = '0';
                                                    maxlengthNum = 9;
                                                    break;
                                                case 2:
                                                    itemTypeStr = '小数点保留两位';
                                                    fieldValue = '0.00';
                                                    maxlengthNum = 12;
                                                    break;
                                                case 3:
                                                    itemTypeStr = '最多输入100字';
                                                    maxlengthNum = 100;
                                                    break;
                                            }
                                            if(item.itemType==1||item.itemType==2){
                                                textAlign='text-right';
                                            }else{
                                                textAlign='';
                                            }
                                            thStrs += '<th>' + item.itemName + '</th>';
                                            baseTdStrs += '<td><input class="'+textAlign+'" maxlength="' + maxlengthNum + '" type="text" data-itemtype="' + item.itemType + '" data-itemname="' + item.itemName + '" data-fieldname="' + item.fieldName + '" value="' + fieldValue + '" placeholder="' + itemTypeStr + '"/></td>';
                                        });

                                        txTheadEl.html('<th width="45">序号</th><th width="144">层次名称</th>' + thStrs);
                                        //所有层级数据
                                        _.each(nodeSenders, function (item) {
                                            baseNodeName = item.templateNode.nodeName;
                                            basenodeID = item.nodeID;
                                            nodeNameLiStr += '<li class="mn-select-item" data-value="' + item.nodeID + '">' + item.templateNode.nodeName + '</li>';
                                        });

                                        baseTrStrs = '<tr><td class="sort-number">' + 0 + '</td><td class="text-left"> <span select-cls="" class="mn-select-box sort-select-list" data-value="' + basenodeID + '"> <span class="mn-select-title-wrapper"><span class="mn-select-title">' + baseNodeName + '</span><span class="title-icon"></span></span> <ul class="mn-select-list">' + nodeNameLiStr + '</ul> </span> </td>' + baseTdStrs + '</tr>';
                                        that.baseTrStrs = baseTrStrs;//保存起来后面加行的时候用
                                        var orginalData = [];
                                        if (drtDataDetailRows.length > 0) { //如果是修改进来的

                                            _.each(drtDataDetailRows, function (item, i) {

                                                var tdStrs = '';
                                                //把减号置灰
                                                liStr += '<li><span class="add-btn"></span><span class="subtract-btn disabled locked"></span></li>';//按钮锁定
                                                //td列
                                                _.each(item.dataItems, function (item, i) {
                                                    var itemType = item.itemType || 1;
                                                    var itemTypeStr = '';
                                                    var fieldValue = '';
                                                    var maxlengthNum = 100;
                                                    switch (itemType) {
                                                        case 1:
                                                            itemTypeStr = '请输入整数';
                                                            fieldValue = '0';
                                                            maxlengthNum = 9;
                                                            break;
                                                        case 2:
                                                            itemTypeStr = '小数点保留两位';
                                                            fieldValue = '0.00';
                                                            maxlengthNum = 12;
                                                            break;
                                                        case 3:
                                                            itemTypeStr = '最多输入100字';
                                                            maxlengthNum = 100;
                                                            break;
                                                    }
                                                    if(item.itemType==1||item.itemType==2){
                                                        textAlign='text-right';
                                                    }else{
                                                        textAlign='';
                                                    }
                                                    tdStrs += '<td><input class="'+textAlign+'" type="text" maxlength="' + maxlengthNum + '" data-itemtype="' + item.itemType + '" data-itemname="' + item.itemName + '" data-fieldname="' + item.fieldName + '" value="' + item.value + '" placeholder="' + itemTypeStr + '" /></td>';
                                                    orginalData.push(item.value);
                                                });
                                                trStrs += '<tr data-nodeid="' + item.drtCommonDataDetail.nodeID + '" data-drtid="' + item.drtCommonDataDetail.drtID + '"><td class="sort-number">' + (i + 1) + '</td><td class="text-left"><span class="node-tit-warp" data-nodeid="' + item.drtCommonDataDetail.nodeID + '">' + item.drtCommonDataDetail.nodeName + '</span></td>' + tdStrs + '</tr>';
                                            });
                                            submitEl.data(oData).addClass('submit-m-btn').removeClass('submit-s-btn');
                                            that.orginalData = orginalData;
                                        } else {

                                            //表身
                                            _.each(nodeSenders, function (item, i) {
                                                //如果只有1条把减号置灰
                                                if (nodeSenders.length == 1) {
                                                    liStr = '<li><span class="add-btn"></span><span class="subtract-btn disabled"></span></li>';//加减按钮
                                                } else {
                                                    liStr += '<li><span class="add-btn"></span><span class="subtract-btn"></span></li>';//加减按钮
                                                }

                                                var tdStrs = '';
                                                var nodeName = item.templateNode.nodeName;

                                                //td列
                                                _.each(templateItems, function (item, i) {
                                                    var itemType = item.itemType;
                                                    var itemTypeStr = '';
                                                    var fieldValue = '';
                                                    var maxlengthNum = 100;
                                                    switch (itemType) {
                                                        case 1:
                                                            itemTypeStr = '请输入整数';
                                                            fieldValue = '0';
                                                            maxlengthNum = 9;
                                                            break;
                                                        case 2:
                                                            itemTypeStr = '小数点保留两位';
                                                            fieldValue = '0.00';
                                                            maxlengthNum = 12;
                                                            break;
                                                        case 3:
                                                            itemTypeStr = '最多输入100字';
                                                            maxlengthNum = 100;
                                                            break;
                                                    }
                                                    if(item.itemType==1||item.itemType==2){
                                                        textAlign='text-right';
                                                    }else{
                                                        textAlign='';
                                                    }
                                                    tdStrs += '<td><input  class="'+textAlign+'" type="text" maxlength="' + maxlengthNum + '" data-itemtype="' + item.itemType + '" data-itemname="' + item.itemName + '" data-fieldname="' + item.fieldName + '" value="' + fieldValue + '" placeholder="' + itemTypeStr + '" /></td>';
                                                });
                                                trStrs += '<tr><td class="sort-number" width="45">' + (i + 1) + '</td><td class="text-left"> <span select-cls="" class="mn-select-box sort-select-list" data-value="' + item.nodeID + '"> <span class="mn-select-title-wrapper"><span class="mn-select-title">' + nodeName + '</span><span class="title-icon"></span></span> <ul class="mn-select-list">' + nodeNameLiStr + '</ul> </span> </td>' + tdStrs + '</tr>';

                                            });
                                            submitEl.data(oData).addClass('submit-s-btn').removeClass('submit-m-btn');
                                        }
                                        submitEl.attr('isneedapprove', isNeedApprove);
                                        txTbodyEl.html(trStrs);
                                        txFnEl.html(liStr);
                                        txEl.show();
                                    }
                                }
                            });
                        }
                    }
                }
            });


        },
        //周格式化
        weekFormat: function (item) {
            var weekStr = '';
            var weekArr = [];
            item.isMonday ? weekArr.push('周一') : weekArr.push(' ');
            item.isTuesday ? weekArr.push('周二') : weekArr.push(' ');
            item.isWednesday ? weekArr.push('周三') : weekArr.push(' ');
            item.isThursday ? weekArr.push('周四') : weekArr.push(' ');
            item.isFriday ? weekArr.push('周五') : weekArr.push(' ');
            item.isSaturday ? weekArr.push('周六') : weekArr.push(' ');
            item.isSunday ? weekArr.push('周日') : weekArr.push(' ');
            var trimStr = $.trim(weekArr.join(''));
            //如果都有就是每天
            if (item.isMonday && item.isTuesday && item.isWednesday && item.isThursday && item.isFriday && item.isSaturday && item.isSunday) {
                weekStr = '每天';
            } else {
                if (trimStr.indexOf(' ') >= 0) {//不是连续的
                    weekStr = _.reject(weekArr, function (num) {
                        return num == ' ';
                    }).join('、');
                } else {
                    if (trimStr.length == 2) {
                        weekStr = trimStr;
                    } else {
                        weekStr = trimStr.substring(0, 2) + '至' + trimStr.substring(trimStr.length - 2, trimStr.length);
                    }

                }
            }
            return weekStr;
        },
        //拼列表
        reportdataMainListStr: function (responseData) {
            var dRTemplates = responseData.value && responseData.value.dRTemplates || [];
            var htmlStr = '';
            var that = this;
            _.each(dRTemplates, function (item, i) {
                var reportTime = item.sendDeadline ? (item.sendDeadline - 1 + ':00') : '';
                var fnBtn = '';
                var weekStr = that.weekFormat(item);
                var status = item.status;
                var senderStatus = item.senderStatus;
                var isStatusGray = 'f-gray';
                var issenderStatusGray = '';
                if (status == 3) {
                    isStatusGray = 'f-green';
                }
                if (senderStatus == 1) {
                    issenderStatusGray = 'f-gray';
                }
                if (senderStatus == 2) {
                    issenderStatusGray = 'f-red';
                }
                switch (item.senderStatus) {
                    case 1:
                        fnBtn = '<a href="javascript:void(0)" class="modify-btn" data-templateid="' + item.templateID + '" data-currentday="' + (item.currentDay || 0) + '" data-lastupdatetime="' + moment(item.lastUpdateTime).unix() + '">修改</a>';
                        break;
                    case 2:
                        fnBtn = '<a href="javascript:void(0)" class="fill-btn" data-templateid="' + item.templateID + '" data-currentday="' + (item.currentDay || 0) + '" data-lastupdatetime="' + moment(item.lastUpdateTime).unix() + '">今日上报</a>';
                        break;
                    case 3:
                        fnBtn = '<a href="javascript:void(0)" class="f-gray">今日上报</a>';
                        break;
                }

                //                htmlStr += '<tr><td>' + (i + 1) + '</td><td class="text-left">' + item.templateName + '</td><td>' + weekStr + '</td><td class="' + isStatusGray + '">' + item.statusDesc + '</td><td>00:00 - ' + reportTime + '</td><td class="' + issenderStatusGray + '">' + item.senderStatusDes + '</td><td>' + fnBtn + '<a href="javascript:void(0)" class="historydata-btn" data-templateid="' + item.templateID + '" data-currentday="' + (item.currentDay || 0) + '" data-lastupdatetime="' + moment(item.lastUpdateTime).unix() + '">历史数据</a></td></tr>';

                htmlStr += '<tr><td class="text-left">' + item.templateName + '</td><td class="f-gray">' + weekStr + '</td><td class="' + isStatusGray + '">' + item.statusDesc + '</td><td class="f-gray">00:00 - ' + reportTime + '</td><td class="' + issenderStatusGray + '">' + item.senderStatusDes + '</td><td>' + fnBtn + '<a href="javascript:void(0)" class="historydata-btn" data-templateid="' + item.templateID + '" data-currentday="' + (item.currentDay || 0) + '" data-lastupdatetime="' + moment(item.lastUpdateTime).unix() + '">历史数据</a></td></tr>';

            });
            return htmlStr;
        },
        // 刷新数据
        refresh: function (data) {
            this.options.data = _.extend(this.options.data, data);
            this.load();
        },
        //重置默认状态
        reset: function () {
            var elEl = this.$el;
            var that = this;
            var listWarpsEl = $('.reportdata-list-warps', elEl);
            var txEl = $('.tx-warp', elEl);
            var xgEl = $('.xg-warp', elEl);
            var lssjEl = $('.lssj-warp', elEl);
            var sbsjEl = $('.sbsj-warp', elEl);
            var crumbsEl = $('.report-breadcrumb', elEl);
            //重置面包屑
            crumbsEl.html('<span>当前位置:</span><a href="#app/reportdata" class="report-back">报数系统</a>&gt; <a href="#app/reportdata" class="report-back">上报数据</a>');
            this.refresh({
                keyword: '',//string，搜索关键字
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，页数
            });

            this.pagination.reset();
            this.searchBox.clear();
            listWarpsEl.hide();
            sbsjEl.show();
        },
        // 加载
        load: function () {
            var that = this;
            var elEl = this.$el;
            var tbodyEl = $('.reportdata-main-list-talbe tbody', elEl);
            util.api({
                "url": '/DataReporting/GetDataReportSenderTemplates',
                "type": 'get',
                "dataType": 'json',
                "data": this.options.data,
                beforeSend: function () {
                    var loadingEl = '<tr><td colspan="6"><div class="feed-list-loading list-loading"><span class="icon-loading"><img src="' + FS.BLANK_IMG + '" alt="loading" /></span>&nbsp;<span class="loading-text">正在加载，请稍候&#8230;</span></div></td></tr>';
                    tbodyEl.html(loadingEl);
                },
                "success": function (responseData) {
                    var yesterday = moment.unix(responseData.serviceTime).subtract(1, 'day').format('YYYY-MM-DD');
                    that.yesterday = yesterday;
                    if (responseData.success) {
                        if (responseData.value.totalCount != 0) {
                            tbodyEl.html(that.reportdataMainListStr(responseData));

                            $('.date-inp-warp .date', elEl).val(yesterday);//
                        } else {
                            tbodyEl.html('<tr><td colspan="6" class="empty-tip">没有任何报表的上报权限，如有需要请联系管理员。</td></tr>');
                        }

                        if (that.options.data.keyword != '' && responseData.value.totalCount == 0) {
                            tbodyEl.html('<tr><td colspan="6" class="empty-tip">未搜索到符合条件的结果</td></tr>');
                        }
                        that.pagination.setTotalSize(responseData.value.totalCount);//设置分页总数
                    }
                }
            });
        },
        //修改
        modify: function () {
            var that = this;
            var elEl = this.$el;
            var txEl = $('.tx-warp', elEl);
            var txTalbeEl = $('.drtdatadetail-table', txEl);
            var approvemployeesTalbeEl = $('.approvemployees-list-talbe', txEl);
            var approvemployeesRadioEl = $('.mn-radio-box', approvemployeesTalbeEl);
            var txTbodyEl = $('tbody', txTalbeEl);
            var txTrEl = $('tr', txTbodyEl);
            var submitEl = $('.submit-btn', txEl);
            var isneedapprove = submitEl.attr('isneedapprove');
            var subData = submitEl.data();
            var dataReportDataJson = [];
            var dataApproverID = 0;
            var isCanSubmit = [];//是否启用提交
            var isBreak = false;//控制是否跳出循环
            var modifyData = [];
            txTrEl.each(function (i) {
                var rowNum = i + 1;
                var nodeID = util.mnGetter($(this).find('.mn-select-box')) || $(this).find('.mn-select-box').attr('data-value') || $(this).data('nodeid');
                var drtID = $(this).attr('data-drtid') || 0;
                var inputEl = $(this).find('td input');
                var DataItems = [];
                if (isBreak) {
                    return false;
                }
                inputEl.each(function (i) {
                    var that = this;
                    var type = $(this).attr('data-itemtype');
                    var itemName = $(this).attr('data-itemname');
                    if (isNaN($(this).val()) && (type == 1 || type == 2)) {
                        util.alert('请填写数字类型', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;
                    }
                    if (($(this).val() > 99999999 || $(this).val() < -99999999 ) && type == 1) {
                        //                        $(that).focus();
                        /*util.alert('请填写第' + rowNum + '行的' + itemName, function () {
                         $(that).focus();
                         }
                         );*/
                        util.alert('整数类型范围：-99999999到99999999', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;

                    } else if (($(this).val() > 99999999.99 || $(this).val() < -99999999.99 ) && type == 2) {
                        util.alert('小数类型范围：-99999999.99到99999999.99', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;
                    } else {
                        DataItems.push({
                            fieldName: $(this).attr('data-fieldname'),
                            value: $(this).val()
                        });
                        isCanSubmit = [];
                        modifyData.push($(this).val());
                    }
                });
                dataReportDataJson.push({
                    drtID: drtID,//只有编辑才会有
                    nodeID: nodeID,//层级
                    DataItems: DataItems
                });
            });

            if (that.orginalData.join(',') == modifyData.join(',')) {//如果修改的数据和源数据相同
                util.alert('您没有修改的内容');
                return false;
            }

            if (util.mnGetter(approvemployeesRadioEl)) {
                dataApproverID = util.mnGetter(approvemployeesRadioEl);
            } else {
                dataApproverID = 0;
            }
            var oData = {
                templateID: subData.templateID,//int，模板ID
                currentDay: subData.currentDay,//int，报表日期
                dataApproverID: dataApproverID,
                dataReportDataJson: json.stringify(dataReportDataJson)//把数组转换为json格式
            };

            if (isCanSubmit.length <= 0) {
                if (isneedapprove == 'true') { //如果需要审批

                    if (dataApproverID > 0) { //审核人必须要有
                        util.api({
                            "url": '/DataReporting/DataReportEdit',
                            "type": 'post',
                            "dataType": 'json',
                            "data": oData,
                            beforeSend: function () {
                            },
                            "success": function (responseData) {
                                if (responseData.success) {
                                    util.alert('修改成功！', function () {
                                        that.reset();
                                    });
                                } else {
                                    if (responseData.ErrorCode == 9001001) { //未选审核人
                                        that._getApproveEmployees(oData.templateID || 0, $('.approvemployees-list-warp', txEl));
                                        $('.approvemployees-list-warp', txEl).show();
                                    }
                                }
                            }
                        });
                    } else {
                        util.alert('请选择审核人');
                    }
                } else {
                    util.api({
                        "url": '/DataReporting/DataReportEdit',
                        "type": 'post',
                        "dataType": 'json',
                        "data": oData,
                        beforeSend: function () {
                        },
                        "success": function (responseData) {
                            if (responseData.success) {
                                util.alert('修改成功！', function () {
                                    that.reset();
                                });
                            } else {
                                if (responseData.ErrorCode == 9001001) { //未选审核人
                                    that._getApproveEmployees(oData.templateID || 0, $('.approvemployees-list-warp', txEl));
                                    $('.approvemployees-list-warp', txEl).show();
                                    isneedapprove = 'true';
                                }
                            }
                        }
                    });
                }


            }
        },
        // 上报提交
        submit: function () {
            var that = this;
            var elEl = this.$el;
            var txEl = $('.tx-warp', elEl);
            var txTalbeEl = $('.drtdatadetail-table', txEl);
            var txTbodyEl = $('tbody', txTalbeEl);
            var txTrEl = $('tr', txTbodyEl);
            var submitEl = $('.submit-btn', txEl);
            var approvemployeesTalbeEl = $('.approvemployees-list-talbe', txEl);
            var approvemployeesRadioEl = $('.mn-radio-box', approvemployeesTalbeEl);
            var subData = submitEl.data();
            var dataReportDataJson = [];
            var dataApproverID;
            var isCanSubmit = [];//是否启用提交
            var isBreak = false;//控制是否跳出循环
            var isneedapprove = submitEl.attr('isneedapprove');
            txTrEl.each(function (i) {
                var rowNum = i + 1;
                var nodeID = util.mnGetter($(this).find('.mn-select-box')) || $(this).find('.mn-select-box').attr('data-value') || $(this).attr('data-nodeid');
                var inputEl = $(this).find('td input');
                var DataItems = [];
                if (isBreak) {
                    return false;
                }
                inputEl.each(function (i) {
                    var that = this;
                    var type = $(this).attr('data-itemtype');
                    var itemName = $(this).attr('data-itemname');
                    if (isNaN($(this).val()) && (type == 1 || type == 2)) {
                        util.alert('请填写数字类型', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;
                    }
                    if (($(this).val() > 99999999 || $(this).val() < -99999999 ) && type == 1) {
                        //                        $(that).focus();
                        /*util.alert('请填写第' + rowNum + '行的' + itemName, function () {
                         $(that).focus();
                         }
                         );*/
                        util.alert('整数类型范围：-99999999到99999999', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;

                    } else if (($(this).val() > 99999999.99 || $(this).val() < -99999999.99 ) && type == 2) {
                        util.alert('小数类型范围：-99999999.99到99999999.99', function () {
                            $(that).focus();
                        });
                        isCanSubmit.push('no');
                        isBreak = true;
                        return false;
                    } else {
                        DataItems.push({
                            fieldName: $(this).attr('data-fieldname'),
                            value: $(this).val()
                        });
                        isCanSubmit = [];
                    }
                });
                dataReportDataJson.push({
                    drtID: 0,//只有编辑才会有
                    nodeID: nodeID,//层级
                    DataItems: DataItems
                });
            });

            if (isCanSubmit.length <= 0) {

                util.api({
                    "url": '/DataReporting/CheckIsNeedBak', // 检查是否需要补报
                    "type": 'get',
                    "dataType": 'json',
                    "data": {
                        templateID: subData.templateID,// int，模板ID
                        currentDay: subData.currentDay//int，报表日期
                    },

                    "success": function (responseData) {
                        if (responseData.success) {

                            if (responseData.value) {
                                //补报

                                if (isneedapprove == 'true') { //如果需要审批
                                    if (util.mnGetter(approvemployeesRadioEl)) {
                                        dataApproverID = util.mnGetter(approvemployeesRadioEl);
                                    } else {
                                        dataApproverID = 0;
                                    }
                                    if (dataApproverID > 0) { //审核人必须要有
                                        util.api({
                                            "url": '/DataReporting/DataReportBak',
                                            "type": 'post',
                                            "dataType": 'json',
                                            "data": {
                                                templateID: subData.templateID,//int，模板ID
                                                currentDay: subData.currentDay,//int，报表日期
                                                dataApproverID: dataApproverID || 0,//int，审批人ID
                                                dataReportDataJson: json.stringify(dataReportDataJson)//把数组转换为json格式
                                            },
                                            beforeSend: function () {
                                            },
                                            "success": function (responseData) {
                                                if (responseData.success) {
                                                    util.alert('提交成功！', function () {
                                                        that.reset();
                                                    });
                                                } else {
                                                    if (responseData.ErrorCode == 9001001) { //未选审核人
                                                        that._getApproveEmployees(subData.templateID || 0, $('.approvemployees-list-warp', txEl));
                                                        $('.approvemployees-list-warp', txEl).show();
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        util.alert('请选择审核人');
                                    }
                                } else {
                                    util.api({
                                        "url": '/DataReporting/DataReportBak',
                                        "type": 'post',
                                        "dataType": 'json',
                                        "data": {
                                            templateID: subData.templateID,//int，模板ID
                                            currentDay: subData.currentDay,//int，报表日期
                                            dataApproverID: dataApproverID || 0,//int，审批人ID
                                            dataReportDataJson: json.stringify(dataReportDataJson)//把数组转换为json格式
                                        },
                                        beforeSend: function () {
                                        },
                                        "success": function (responseData) {
                                            if (responseData.success) {
                                                util.alert('提交成功！', function () {
                                                    that.reset();
                                                });
                                            } else {
                                                if (responseData.ErrorCode == 9001001) { //未选审核人
                                                    that._getApproveEmployees(subData.templateID || 0, $('.approvemployees-list-warp', txEl));
                                                    $('.approvemployees-list-warp', txEl).show();
                                                    isneedapprove = 'true';
                                                }
                                            }
                                        }
                                    });
                                }

                            } else {
                                //正常上报
                                util.api({
                                    "url": '/DataReporting/DataReportSend',
                                    "type": 'post',
                                    "dataType": 'json',
                                    "data": {
                                        templateID: subData.templateID,//int，模板ID
                                        currentDay: subData.currentDay,//int，报表日期
                                        lastUpdateTime: subData.lastUpdateTime,//long，模板最后更新时间
                                        dataReportDataJson: json.stringify(dataReportDataJson)//把数组转换为json格式
                                    },
                                    beforeSend: function () {
                                    },
                                    "success": function (responseData) {
                                        if (responseData.success) {
                                            util.alert('提交成功！', function () {
                                                that.reset();
                                            });
                                        }
                                    }
                                });
                            }
                        }


                    }
                });
            }

        },
        // 设置组件
        setupComponent: function () {
            var that = this;
            var elEl = this.$el;
            var lssjEl = $('.lssj-warp', elEl);
            var txEl = $('.tx-warp', elEl);
            //分页
            this.pagination = new Pagination({
                "element": this.options.pagEl,
                "pageSize": this.options.data.pageSize,
                "visiblePageNums": 7//最小可见页码 >3,第一页和末页为保留页码
            });
            this.pagination.render();
            this.pagination.on('page', function (pageNumber) {
                that.refresh({
                    pageNumber: pageNumber// int，页码
                });
            });
            //日期选择组件
            this.lsdate = new DateSelect({"trigger": lssjEl.find('.date-inp-warp .date')});
            this.lsdate.on('selectDate',function(date){
                that.lsGetData({
                    templateID: that.templateID,
                    currentDay: moment(date).format('YYYYMMDD')
                });
            });
            //实例化搜索框
            this.searchBox = new SearchBox({
                "element": $('.search-warp',this.$el),
                "placeholder": "搜索"
            });
            this.searchBox.on('search', function (queryValue) {
                var len = queryValue.length || 0;
                var limitLen = 200;
                if (len > limitLen) {
                    util.alert('关键词长度不能大于' + limitLen + '字,请修改', function () {
                    });
                } else {
                    that.refresh({
                        keyword: queryValue//搜索关键字
                    });
                }
            });
            util.mnEvent($('.states-list-select-list', elEl), 'change', function(val, text) {
                that.refresh({
                    status: val
                });
            });

        },
        destroy: function () {
            var elEl = this.$el;
            elEl.empty();
            elEl.off();
            this.lsdate.destroy();
        }
    })
    ;

    /**
     * 页面载入执行函数
     */
    exports.init = function () {
        var tplEl = exports.tplEl;
        var tplName = exports.tplName;
        // 设置左侧导航
        leftNav.init($('.tpl-l', tplEl));
        var reportData = new ReportData({
            element: tplEl, //父级容器
            pagEl: $('.page-warp', tplEl),
            data: {
                status:0,
                keyword: '',//string，搜索关键字
                pageSize: 10,//int，分页大小
                pageNumber: 1//int，页数
            }
        });
        reportData.load();
        //页面离开的时候执行销毁
        tplEvent.one('beforeremove', function (tplName2) {
            if (tplName2 == tplName) {
                reportData.destroy();
            }
        });
    }

})
;