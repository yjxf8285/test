/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var Pagination = require('uilibs/pagination');//分页组件
    var globalData = FS.getAppStore('globalData');
    var model = globalData.model;
    exports.init = function() {
        var queryParams = util.getTplQueryParams(); //地址栏传给模板的参数
        var queryid = queryParams ? queryParams.id : 0;
        var queryname = queryParams ? queryParams.name : 0;
        var tplName = exports.tplName;
        var tplEl = exports.tplEl;
        var smsstatisticsdetailNullTipEl = $('.smsstatisticsdetail-nulltip', tplEl);
        var smsstatisticsdetailTableEl = $('.smsstatisticsdetail-table', tplEl);
        var smsstatisticsdetailTheadEl = $('thead', smsstatisticsdetailTableEl);
        var smsstatisticsdetailTbodyEl = $('tbody', smsstatisticsdetailTableEl);
        var smsstatisticsdetailPaginationEl = $('.smsstatisticsdetail-pagination', tplEl);
        var smsstatisticsdetailTopInfoEl = $('.smsstatisticsdetail-top-info', tplEl);
        var smsstatisticsdetailTitEl = $('.smsstatisticsdetail-tit .h1', tplEl);
        var smsstatisticsTopBackEl = $('.smsstatisticsdetail-top-back', tplEl);
        var selectEl = $('select', tplEl);
        //初始化页面模板数据
        smsstatisticsTopBackEl.html('<a href="#datamanage/smsstatistics">返回查看全部</a> > ' + queryname + '');
        //初始化分页组件
        var pagination = new Pagination({
            "element": smsstatisticsdetailPaginationEl,
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
                var yearMonth = record.yearMonth.toString();
                var workAmount = record.workAmount;//工作短信
                var customerAmount = record.customerAmount;//客群短信
                var netMarketingAmount = record.netMarketingAmount;//客群网信
                var smsMarketingAmount = record.smsMarketingAmount;//营销短信
                var fYearMonth = yearMonth.substring(0, 4) + '-' + yearMonth.substring(4);
                //权限判断：1是工作管理，其他为促销宝或都有
                if (model == 1) {
                    trStr += '<tr><td class="txt-left">' + fYearMonth + '</td><td class="txt-center">' + workAmount + '</td><td class="txt-center">' + customerAmount + '</td></tr>';
                } else {
                    trStr += '<tr><td class="txt-left">' + fYearMonth + '</td><td class="txt-center">' + workAmount + '</td><td class="txt-center">' + customerAmount + '</td><td class="txt-center">' + netMarketingAmount + '</td><td class="txt-center">' + smsMarketingAmount + '</td></tr>';
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
                    "yearMonth": -1,
                    "employeeID": queryid,
                    "pageSize": 20,
                    "pageNumber": pageNumber
                },
                "success": function(responseData) {
                    var data = responseData.value || {};
                    var records = data.records;
                    var totalCount = data.totalCount;
                    var workAmount = data.workAmount;
                    var customerAmount = data.customerAmount;
                    var netMarketingAmount = data.netMarketingAmount;//客群网信
                    var smsMarketingAmount = data.smsMarketingAmount;//营销短信
                    var theadStr = ' <tr><th>员工姓名</th><th width="100" class="txt-center">工作短信(条)</th><th width="100" class="txt-center">客群短信(条)</th><th width="100">营销网信（条）</th><th width="100">营销短信（条）</th></tr>';
                    var smsstatisticsdetailTopInfoStr = '工作短信：' + workAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;客群短信：' + customerAmount + '条';
                    if (responseData.success) {
                        //权限判断：1是工作管理，其他为促销宝或都有
                        if (model == 1) {
                            theadStr = ' <tr><th>员工姓名</th><th width="180" class="txt-center">工作短信(条)</th><th width="180" class="txt-center">客群短信(条)</th></tr>';
                        } else {
                            smsstatisticsdetailTopInfoStr = '工作短信：' + workAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;客群短信：' + customerAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;营销网信：' + netMarketingAmount + '条&nbsp;&nbsp;&nbsp;&nbsp;营销短信：' + smsMarketingAmount + '条';
                        }
                        //如果数据为空
                        if (records.length > 0) {
                            smsstatisticsdetailTheadEl.html(theadStr);
                            smsstatisticsdetailTbodyEl.html(formatData(data));
                            smsstatisticsdetailNullTipEl.hide();
                            smsstatisticsdetailTableEl.show();
                        } else {
                            smsstatisticsdetailTableEl.hide();
                            smsstatisticsdetailNullTipEl.show();
                        }
                        //渲染
                        smsstatisticsdetailTitEl.html('' + queryname + '&nbsp;&nbsp;&nbsp;短信使用明细(' + totalCount + ')');
                        smsstatisticsdetailTopInfoEl.html(smsstatisticsdetailTopInfoStr);
                        pagination.setTotalSize(totalCount);//设置分页总数
                    }
                }
            });
        };
        getSMSStatistics(1); //执行请求

        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');
    };
});