/* 
 Created on : 2013-11-27, 11:57:35
 Author     : liuxf
 */
define(function(require, exports, module) {
    var root = window;
    var FS = root.FS;
    var tpl = FS.tpl;
    var util = require('util');
    var moment = require('moment');
    var Pagination = require('uilibs/pagination');//分页组件
    var formatData = function(data) {
        var trStr = '';
        var logs = data.logs || [];
        _.each(logs, function(log) {
            var createTime = log.createTime;
            var fullName = log.fullName;
            var content = log.content;
            var toBrContent = content.replace(/[\n|\r]/g, '<br/>');//换行转换
            var formatTime = moment.unix(createTime).format('MMMDD日 HH:mm');
            trStr += '<tr><td class="manageslogs-table-gray">' + formatTime + '</td><td class="manageslogs-table-gray">' + fullName + '</td><td class="manageslogs-table-content">' + toBrContent + '</td></tr>';
        });
        return trStr;
    };
    exports.init = function() {
//    	if(FS.getAppStore('globalData').isAllowDangerOperate) {
//			$('.left-crm-reset').show();
//		}
        var tplEl = exports.tplEl;
        var manageslogsTableTbodyEl = $('.manageslogs-table tbody', tplEl);
        var manageslogsPaginationEl = $('.manageslogs-pagination', tplEl);
        //初始化分页组件
        var pagination = new Pagination({
            "element": manageslogsPaginationEl,
            "pageSize": 20
        }).render();
        //分页组件事件绑定
        pagination.on('page', function(pageNumber) {
            getAdminOperationLogs(pageNumber);
        });
        /**
         * 管理员获取操作日志
         */
        var getAdminOperationLogs = function(pageNumber) {
            util.api({
                "url": '/Management/GetAdminOperationLogs',
                "type": 'get',
                "dataType": 'json',
                "data": {
                    "type": 0,
                    "account": '',
                    "fullName": '',
                    "pageSize": 20,
                    "pageNumber": pageNumber
                },
                "success": function(responseData) {
                    var data = responseData.value || {};
                    if (responseData.success) {
                        manageslogsTableTbodyEl.html(formatData(data)); //渲染
                        pagination.setTotalSize(data.totalCount);//设置分页总数
                    }
                }
            });
        };
        getAdminOperationLogs(1);//执行请求

        //左侧导航注册
        util.regTplNav($('.tpl-l .flag-left-list a',tplEl),'fl-item-on');

    };
});