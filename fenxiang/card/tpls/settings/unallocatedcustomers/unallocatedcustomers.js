/**
 * 未分配客户
 *
 * 遵循seajs module规范
 * @author liuxiaofan 2014-06-03
 */
define(function (require, exports, module) {
    var root = window,
        FS = root.FS,
        tpl = FS.tpl,
        tplEvent = tpl.event;
    var util = require('util');
    var tplCommon = require('../settings-common');
    var Header = require('modules/crm-list-header/crm-list-header');
    var List = require('modules/crm-customer-list/crm-customer-list');

    exports.init = function () {
        var tplEl = exports.tplEl,
            tplName = exports.tplName;
        var list, header;
        $('.top-fn-btns', tplEl).hide();
        //创建左侧菜单
        tplCommon.createCrmSettingLeftNav(tplEl, tplName);

        header = new Header({
            "element": $(".crm-list-hd", tplEl),
            "title": "全部客户",
            "searchPlaceholder": "搜索客户"
        });
        header.on("search", function (keyword) {
            list.refresh({
                "keyword": keyword
            });
        });

        list = new List({
            warpEl: $('.list-warp', tplEl),
            url: "/FCustomer/GetAllFCustomers"
        });
        list.load();
        list.refresh({
            employeeID: -1,//，员工ID
            keyword: '',// string，搜索关键字
            isFirstChar: false,//，是否首字母查询
            sortType: 0,//，排序规则
            pageNumber: 1,//，页码
            pageSize: 25,
            queryType: 1
        });
    };
});