/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var Pagination = require('uilibs/pagination'); //分页组件
    exports.init = function() {
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var globalData = FS.getAppStore('globalData');
        var model = globalData.model;

        var smsstatisticsNullTipEl = $('.smsstatistics-nulltip', tplEl);
        var smsstatisticsTableEl = $('.smsstatistics-table', tplEl);
        var smsstatisticsTheadEl = $('thead', smsstatisticsTableEl);
        var smsstatisticsTbodyEl = $('tbody', smsstatisticsTableEl);
        var smsstatisticsPaginationEl = $('.smsstatistics-pagination', tplEl);
        var smsstatisticsTopInfoEl = $('.smsstatistics-top-info', tplEl);
        var smsstatisticsTitEl = $('.smsstatistics-tit', tplEl);
        var selectEl = $('select', tplEl);

        /**
         * 设置当前年月
         */
        var selcetyearEl = $('.smsstatistics-top-selcetyear', tplEl);
        var selcetmonthEl = $('.smsstatistics-top-selcetmonth', tplEl);
        var nowYear = new Date().getFullYear();
        var nowMonth = new Date().getMonth() + 1;
        var optionStr = '';
        if (nowMonth < 10) {
            nowMonth = "0" + nowMonth;
        }
        for (var i = 2012; i <= nowYear; i++) {
            optionStr += '<option value="' + i + '"> ' + i + '年 </option>';
            selcetyearEl.html(optionStr);
        }
        selcetyearEl.val(nowYear);
        selcetmonthEl.val(nowMonth);
        
        var yearMonth = nowYear.toString() + nowMonth.toString();
        //年月选择事件绑定
        selectEl.on('change', function() {
            yearMonth = selcetyearEl.val() + selcetmonthEl.val();
            getSMSStatistics(1); //执行请求
        });
        //初始化分页组件
        var pagination = new Pagination({
            "element": smsstatisticsPaginationEl,
            "pageSize": 20
        }).render();
        //分页组件事件绑定
        pagination.on('page', function(pageNumber) {
            getSMSStatistics(pageNumber);
        });
        var formatData = function(data) {
            var trStr = '';
            var records = data.records || [];
            _.each(records, function(record) {
                var employeeName = record.employeeName;
                var employeeID = record.employeeID;
                var yearMonth = record.yearMonth;
                var workAmount = record.workAmount; //工作短信
                var customerAmount = record.customerAmount; //客群短信
                var netMarketingAmount = record.netMarketingAmount; //客群网信
                var smsMarketingAmount = record.smsMarketingAmount; //营销短信
                //权限判断：1是工作管理，其他为促销宝或都有
                if (model == 1) {
                    trStr += '<tr><td class="txt-left"><a href="#datamanage/smsstatisticsdetail/=/id-' + employeeID + '/name-' + employeeName + '">' + employeeName + '</a></td><td class="txt-center">' + workAmount + '</td><td class="txt-center">' + customerAmount + '</td></tr>';
                } else {
                    trStr += '<tr><td class="txt-left"><a href="#datamanage/smsstatisticsdetail/=/id-' + employeeID + '/name-' + employeeName + '">' + employeeName + '</a></td><td class="txt-center">' + workAmount + '</td><td class="txt-center">' + customerAmount + '</td><td class="txt-center">' + netMarketingAmount + '</td><td class="txt-center">' + smsMarketingAmount + '</td></tr>';
                }
            });
            return trStr;
        };
        /**
         * 获取短信统计
         */
        var getSMSStatistics = function(pageNumber) {
            util.api({
                "url": '/Management/GetSMSStatistics',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "yearMonth": yearMonth,
                    "employeeID": -1,
                    "pageSize": 20,
                    "pageNumber": pageNumber
                },
                "success": function(responseData) {
                    var data = responseData.value || {};
                    var records = data.records;
                    var totalCount = data.totalCount;
                    var workAmount = data.workAmount;
                    var customerAmount = data.customerAmount;
                    var netMarketingAmount = data.netMarketingAmount; //客群网信
                    var smsMarketingAmount = data.smsMarketingAmount; //营销短信
                    var theadStr = ' <tr><th>员工姓名</th><th width="100" class="txt-center">工作短信(条)</th><th width="100" class="txt-center">客群短信(条)</th><th width="100">营销网信（条）</th><th width="100">营销短信（条）</th></tr>';
                    var smsstatisticsTopInfoStr = '工作短信：' + workAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;客群短信：' + customerAmount + '条';
                    if (responseData.success) {
                        //权限判断：1是工作管理，其他为促销宝或都有
                        if (model == 1) {
                            theadStr = ' <tr><th>员工姓名</th><th width="180" class="txt-center">工作短信(条)</th><th width="180" class="txt-center">客群短信(条)</th></tr>';
                        } else {
                            smsstatisticsTopInfoStr = '工作短信：' + workAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;客群短信：' + customerAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;营销网信：' + netMarketingAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;营销短信：' + smsMarketingAmount + '条';
                        }
                        //如果数据为空
                        if (records.length > 0) {
                            smsstatisticsTheadEl.html(theadStr);
                            smsstatisticsTbodyEl.html(formatData(data));
                            smsstatisticsNullTipEl.hide();
                            smsstatisticsTableEl.show();
                        } else {
                            smsstatisticsTableEl.hide();
                            smsstatisticsNullTipEl.show();
                        }
                        //渲染
                        smsstatisticsTitEl.text('短信统计(' + totalCount + ')');
                        smsstatisticsTopInfoEl.html(smsstatisticsTopInfoStr);
                        pagination.setTotalSize(totalCount); //设置分页总数
                    }
                }
            });
        };
        getSMSStatistics(1); //执行请求

        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a', tplEl), 'fl-item-on');
        //促销宝权限控制
        if (model == 2) {
            $('.tpl-l .flag-left-list li', tplEl).hide();
            $('.tpl-l .sms-manage-item', tplEl).show();
        }
    };
});